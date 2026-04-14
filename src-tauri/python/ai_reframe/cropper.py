from __future__ import annotations

from dataclasses import dataclass
import math
from typing import Dict, List, Optional, Tuple

from .tracker import TrackedFace


@dataclass
class CropBox:
    x: int
    y: int
    w: int
    h: int


@dataclass
class CropDecision:
    crop: CropBox
    active_track_id: Optional[int]
    did_switch: bool
    speaker_box: Optional[CropBox]


class CropPlanner:
    def __init__(
        self,
        frame_w: int,
        frame_h: int,
        aspect_w: int = 9,
        aspect_h: int = 16,
        smoothing_alpha: float = 0.82,
        face_y_offset_ratio: float = -0.45,
        subject_hold_sec: float = 0.35,
        max_move_ratio: float = 0.012,
        hard_cut_on_switch: bool = True,
        side_bias_ratio: float = 0.18,
        speaker_switch_margin: float = 1.12,
        speaker_min_score: float = 1.0,
        speaker_box_area_scale: float = 50.0,
        speaker_box_y_shift_faces: float = 1.9,
        camera_deadzone_ratio: float = 0.18,
    ):
        self.frame_w = int(frame_w)
        self.frame_h = int(frame_h)
        self.smoothing_alpha = float(smoothing_alpha)
        self.face_y_offset_ratio = float(face_y_offset_ratio)
        self.subject_hold_sec = float(subject_hold_sec)
        self.max_move_ratio = float(max_move_ratio)
        self.hard_cut_on_switch = bool(hard_cut_on_switch)
        self.side_bias_ratio = min(0.45, max(0.0, float(side_bias_ratio)))
        self.speaker_switch_margin = max(1.0, float(speaker_switch_margin))
        self.speaker_min_score = max(0.0, float(speaker_min_score))
        self.speaker_box_area_scale = max(1.0, float(speaker_box_area_scale))
        self.speaker_box_y_shift_faces = max(0.0, float(speaker_box_y_shift_faces))
        self.camera_deadzone_ratio = min(0.35, max(0.0, float(camera_deadzone_ratio)))

        ratio = float(aspect_w) / float(aspect_h)
        source_ratio = self.frame_w / float(self.frame_h)

        if source_ratio >= ratio:
            crop_h = self.frame_h
            crop_w = int(round(crop_h * ratio))
        else:
            crop_w = self.frame_w
            crop_h = int(round(crop_w / ratio))

        self.crop_w = max(2, min(self.frame_w, crop_w))
        self.crop_h = max(2, min(self.frame_h, crop_h))

        self._subject_track_id: Optional[int] = None
        self._subject_side: Optional[int] = None  # -1 left, +1 right
        self._last_subject_switch_frame = -10_000
        self._smooth_center: Optional[Tuple[float, float]] = None
        self._last_target_center: Optional[Tuple[float, float]] = None

    def _center_clamped(self, cx: float, cy: float) -> Tuple[float, float]:
        min_cx = self.crop_w / 2.0
        max_cx = self.frame_w - (self.crop_w / 2.0)
        min_cy = self.crop_h / 2.0
        max_cy = self.frame_h - (self.crop_h / 2.0)
        return (
            min(max(cx, min_cx), max_cx),
            min(max(cy, min_cy), max_cy),
        )

    def _pick_subject(
        self,
        tracks: List[TrackedFace],
        frame_index: int,
        fps: float,
        speaker_scores: Optional[Dict[int, float]] = None,
        forced_track_id: Optional[int] = None,
    ) -> Tuple[Optional[TrackedFace], bool]:
        if not tracks:
            return None, False

        by_id = {track.track_id: track for track in tracks}
        if forced_track_id is not None:
            forced_subject = by_id.get(int(forced_track_id))
            if forced_subject is not None:
                did_switch = self._subject_track_id != forced_subject.track_id
                self._subject_track_id = forced_subject.track_id
                frame_mid_x = self.frame_w * 0.5
                self._subject_side = -1 if (forced_subject.x + (forced_subject.w * 0.5)) < frame_mid_x else 1
                if did_switch:
                    self._last_subject_switch_frame = frame_index
                return forced_subject, did_switch

            # If forced track is momentarily missing, keep current visible subject and avoid center flash.
            if self._subject_track_id is not None:
                existing_subject = by_id.get(self._subject_track_id)
                if existing_subject is not None:
                    return existing_subject, False

            # Timeline requested a specific subject but it's missing right now.
            # Do not jump to arbitrary detections (often center false positives).
            return None, False

        hold_frames = max(1, int(round(self.subject_hold_sec * max(1.0, fps))))
        current_subject = by_id.get(self._subject_track_id) if self._subject_track_id is not None else None

        def score_for(track: TrackedFace) -> float:
            if not speaker_scores:
                return 0.0
            return float(speaker_scores.get(track.track_id, 0.0))

        frame_mid_x = self.frame_w * 0.5
        center_band = self.frame_w * 0.14

        def is_center_track(track: TrackedFace) -> bool:
            cx = track.x + (track.w * 0.5)
            return abs(cx - frame_mid_x) < center_band

        def side_weight(track: TrackedFace) -> float:
            cx = track.x + (track.w * 0.5)
            side_distance = abs(cx - frame_mid_x) / max(1.0, frame_mid_x)
            center_penalty = 0.55 if is_center_track(track) else 1.0
            return track.area * (0.72 + side_distance * 0.9) * center_penalty

        best_speaker = max(tracks, key=score_for)
        best_speaker_score = score_for(best_speaker)
        largest_side = max(tracks, key=side_weight)

        non_center_tracks = [track for track in tracks if not is_center_track(track)]
        if non_center_tracks and is_center_track(best_speaker):
            side_speaker = max(non_center_tracks, key=score_for)
            if score_for(side_speaker) >= (best_speaker_score * 0.75):
                best_speaker = side_speaker
                best_speaker_score = score_for(side_speaker)

        if current_subject is None:
            chosen: TrackedFace
            if self._subject_side is not None:
                side_pref_tracks = [
                    track for track in tracks
                    if ((track.x + (track.w * 0.5)) - frame_mid_x) * self._subject_side > 0
                ]
                if side_pref_tracks:
                    chosen = max(side_pref_tracks, key=side_weight)
                else:
                    chosen = largest_side
            else:
                chosen = best_speaker if best_speaker_score >= self.speaker_min_score else largest_side
            self._subject_track_id = chosen.track_id
            self._subject_side = -1 if (chosen.x + (chosen.w * 0.5)) < frame_mid_x else 1
            self._last_subject_switch_frame = frame_index
            return chosen, True

        # Single visible face should stay locked with no switching logic.
        if len(tracks) <= 1:
            only_track = current_subject if current_subject is not None else tracks[0]
            self._subject_track_id = only_track.track_id
            self._subject_side = -1 if (only_track.x + (only_track.w * 0.5)) < frame_mid_x else 1
            return only_track, current_subject is None

        current_score = score_for(current_subject)
        can_switch = (frame_index - self._last_subject_switch_frame) >= hold_frames
        should_switch = (
            best_speaker.track_id != current_subject.track_id
            and best_speaker_score >= self.speaker_min_score
            and best_speaker_score > (current_score * self.speaker_switch_margin)
            and can_switch
        )

        if should_switch:
            self._subject_track_id = best_speaker.track_id
            self._subject_side = -1 if (best_speaker.x + (best_speaker.w * 0.5)) < frame_mid_x else 1
            self._last_subject_switch_frame = frame_index
            return best_speaker, True

        return current_subject, False

    def _smooth_center_with_limit(self, target: Tuple[float, float]) -> Tuple[float, float]:
        target_x, target_y = target
        if self._smooth_center is None:
            self._smooth_center = target
            return target

        prev_x, prev_y = self._smooth_center
        # Dead-zone stabilization: ignore small target shifts so camera doesn't jitter
        # when the speaker moves inside an already-covered region.
        dx_target = target_x - prev_x
        dy_target = target_y - prev_y
        deadzone_x = max(6.0, self.crop_w * self.camera_deadzone_ratio)
        deadzone_y = max(6.0, self.crop_h * self.camera_deadzone_ratio)
        if abs(dx_target) <= deadzone_x and abs(dy_target) <= deadzone_y:
            return self._smooth_center

        def _trim_deadzone(delta: float, deadzone: float) -> float:
            if delta > 0:
                return max(0.0, delta - deadzone)
            return min(0.0, delta + deadzone)

        corrected_target_x = prev_x + _trim_deadzone(dx_target, deadzone_x)
        corrected_target_y = prev_y + _trim_deadzone(dy_target, deadzone_y)

        alpha = min(0.97, max(0.7, self.smoothing_alpha))
        smooth_x = (alpha * prev_x) + ((1.0 - alpha) * corrected_target_x)
        smooth_y = (alpha * prev_y) + ((1.0 - alpha) * corrected_target_y)

        max_move_px = max(8.0, max(self.frame_w, self.frame_h) * self.max_move_ratio)
        dx = smooth_x - prev_x
        dy = smooth_y - prev_y
        if dx > max_move_px:
            smooth_x = prev_x + max_move_px
        elif dx < -max_move_px:
            smooth_x = prev_x - max_move_px

        if dy > max_move_px:
            smooth_y = prev_y + max_move_px
        elif dy < -max_move_px:
            smooth_y = prev_y - max_move_px

        self._smooth_center = (smooth_x, smooth_y)
        return self._smooth_center

    def compute(
        self,
        tracks: List[TrackedFace],
        frame_index: int,
        fps: float,
        speaker_scores: Optional[Dict[int, float]] = None,
        forced_track_id: Optional[int] = None,
        forced_side: Optional[int] = None,
    ) -> CropDecision:
        subject, did_switch = self._pick_subject(
            tracks,
            frame_index,
            fps,
            speaker_scores=speaker_scores,
            forced_track_id=forced_track_id,
        )
        speaker_box: Optional[CropBox] = None

        if subject is not None:
            face_cx = subject.x + (subject.w * 0.5)
            face_cy = subject.y + (subject.h * 0.5)

            # Build a much larger "speaker region" (~50x area by default) so crop targets person, not face.
            linear = math.sqrt(self.speaker_box_area_scale)
            speaker_w = max(subject.w, subject.w * linear)
            speaker_h = max(subject.h, subject.h * linear)
            speaker_cx = face_cx
            speaker_cy = face_cy + (subject.h * self.speaker_box_y_shift_faces)

            frame_mid_x = self.frame_w * 0.5
            if speaker_cx < (frame_mid_x - subject.w * 0.25):
                speaker_cx -= subject.w * self.side_bias_ratio
            elif speaker_cx > (frame_mid_x + subject.w * 0.25):
                speaker_cx += subject.w * self.side_bias_ratio

            if forced_side in (-1, 1):
                side_anchor = frame_mid_x + (forced_side * self.crop_w * 0.30)
                # Keep conversation framing away from center dead-space.
                speaker_cx = (speaker_cx * 0.60) + (side_anchor * 0.40)

            speaker_x = speaker_cx - (speaker_w * 0.5)
            speaker_y = speaker_cy - (speaker_h * 0.5)
            speaker_x = max(0.0, min(speaker_x, self.frame_w - speaker_w))
            speaker_y = max(0.0, min(speaker_y, self.frame_h - speaker_h))
            speaker_box = CropBox(
                x=int(round(max(0.0, speaker_x))),
                y=int(round(max(0.0, speaker_y))),
                w=int(round(min(float(self.frame_w), speaker_w))),
                h=int(round(min(float(self.frame_h), speaker_h))),
            )

            target_cy = speaker_cy - (subject.h * self.face_y_offset_ratio)
            target_center = self._center_clamped(speaker_cx, target_cy)
            self._last_target_center = target_center
        elif self._last_target_center is not None:
            target_center = self._last_target_center
        else:
            if self._subject_side is not None:
                x = (self.frame_w * 0.5) + (self._subject_side * self.crop_w * 0.34)
                target_center = self._center_clamped(x, self.frame_h * 0.56)
            else:
                target_center = self._center_clamped(self.frame_w / 2.0, self.frame_h * 0.56)

        if did_switch and self.hard_cut_on_switch:
            self._smooth_center = target_center
            smooth_center = target_center
        else:
            smooth_center = self._smooth_center_with_limit(target_center)
        clamped_center = self._center_clamped(*smooth_center)
        self._smooth_center = clamped_center

        x = int(round(clamped_center[0] - (self.crop_w / 2.0)))
        y = int(round(clamped_center[1] - (self.crop_h / 2.0)))

        x = max(0, min(x, self.frame_w - self.crop_w))
        y = max(0, min(y, self.frame_h - self.crop_h))

        active_track_id = subject.track_id if subject is not None else self._subject_track_id
        return CropDecision(
            crop=CropBox(x=x, y=y, w=self.crop_w, h=self.crop_h),
            active_track_id=active_track_id,
            did_switch=did_switch,
            speaker_box=speaker_box,
        )
