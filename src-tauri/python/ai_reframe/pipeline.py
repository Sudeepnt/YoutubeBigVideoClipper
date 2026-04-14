from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import cv2
import numpy as np

if __package__ in (None, ""):
    PACKAGE_ROOT = Path(__file__).resolve().parent.parent
    if str(PACKAGE_ROOT) not in sys.path:
        sys.path.append(str(PACKAGE_ROOT))
    from ai_reframe.cropper import CropPlanner
    from ai_reframe.detector import FaceDetector
    from ai_reframe.tracker import IOUTracker, TrackedFace
else:
    from .cropper import CropPlanner
    from .detector import FaceDetector
    from .tracker import IOUTracker, TrackedFace


@dataclass
class ReframeConfig:
    output_width: int = 720
    output_height: int = 1280
    detection_interval: int = 2
    detector_width: int = 512
    analysis_frame_step: int = 3
    smoothing_alpha: float = 0.92
    face_y_offset_ratio: float = -0.45
    subject_hold_sec: float = 0.22
    max_move_ratio: float = 0.035
    hard_cut_on_switch: bool = True
    side_bias_ratio: float = 0.18
    speaker_switch_margin: float = 1.04
    speaker_min_score: float = 0.45
    speaker_switch_penalty: float = 0.9
    speaker_min_segment_sec: float = 0.45
    debug_overlay: bool = False
    layout_mode: str = "single"  # auto | single | split


class SpeakerActivityEstimator:
    def __init__(self):
        self._prev_mouth_patch: Dict[int, np.ndarray] = {}
        self._prev_face_patch: Dict[int, np.ndarray] = {}
        self._ema_score: Dict[int, float] = {}

    def _mouth_patch(self, frame_gray: np.ndarray, x: float, y: float, w: float, h: float) -> Optional[np.ndarray]:
        x1 = int(max(0, x + (w * 0.12)))
        x2 = int(min(frame_gray.shape[1], x + (w * 0.88)))
        y1 = int(max(0, y + (h * 0.48)))
        y2 = int(min(frame_gray.shape[0], y + (h * 0.98)))
        if x2 - x1 < 8 or y2 - y1 < 6:
            return None

        patch = frame_gray[y1:y2, x1:x2]
        if patch.size == 0:
            return None

        patch = cv2.resize(patch, (80, 36), interpolation=cv2.INTER_LINEAR)
        patch = cv2.GaussianBlur(patch, (3, 3), 0)
        return patch

    def _face_patch(self, frame_gray: np.ndarray, x: float, y: float, w: float, h: float) -> Optional[np.ndarray]:
        x1 = int(max(0, x + (w * 0.16)))
        x2 = int(min(frame_gray.shape[1], x + (w * 0.84)))
        y1 = int(max(0, y + (h * 0.08)))
        y2 = int(min(frame_gray.shape[0], y + (h * 0.98)))
        if x2 - x1 < 16 or y2 - y1 < 16:
            return None

        patch = frame_gray[y1:y2, x1:x2]
        if patch.size == 0:
            return None

        patch = cv2.resize(patch, (96, 96), interpolation=cv2.INTER_LINEAR)
        patch = cv2.GaussianBlur(patch, (3, 3), 0)
        return patch

    def update(self, frame_bgr: np.ndarray, tracks) -> Dict[int, float]:
        frame_gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
        current_scores: Dict[int, float] = {}
        alive_track_ids = set()

        for track in tracks:
            track_id = int(track.track_id)
            alive_track_ids.add(track_id)
            mouth_patch = self._mouth_patch(frame_gray, track.x, track.y, track.w, track.h)
            face_patch = self._face_patch(frame_gray, track.x, track.y, track.w, track.h)
            if mouth_patch is None or face_patch is None:
                continue

            raw_score = 0.0
            prev_mouth = self._prev_mouth_patch.get(track_id)
            prev_face = self._prev_face_patch.get(track_id)
            if (
                prev_mouth is not None
                and prev_face is not None
                and prev_mouth.shape == mouth_patch.shape
                and prev_face.shape == face_patch.shape
            ):
                mouth_delta = float(cv2.mean(cv2.absdiff(mouth_patch, prev_mouth))[0])
                face_delta = float(cv2.mean(cv2.absdiff(face_patch, prev_face))[0])

                # Reduce head-nod false positives by subtracting global face motion from mouth motion.
                relative_mouth = max(0.0, mouth_delta - (face_delta * 0.78))
                mouth_focus = min(2.0, max(0.25, mouth_delta / (face_delta + 2.0)))
                raw_score = relative_mouth * mouth_focus

            prev_ema = self._ema_score.get(track_id, 0.0)
            if raw_score >= prev_ema:
                ema = (prev_ema * 0.52) + (raw_score * 0.48)
            else:
                ema = (prev_ema * 0.86) + (raw_score * 0.14)
            self._ema_score[track_id] = ema
            self._prev_mouth_patch[track_id] = mouth_patch
            self._prev_face_patch[track_id] = face_patch
            current_scores[track_id] = ema

        stale_ids = set(self._prev_mouth_patch.keys()) - alive_track_ids
        for track_id in stale_ids:
            self._prev_mouth_patch.pop(track_id, None)
            self._prev_face_patch.pop(track_id, None)
            self._ema_score.pop(track_id, None)

        return current_scores


TrackSnapshot = Dict[int, Tuple[float, float, float, float]]


class MotionSubjectTracker:
    def __init__(self, frame_w: int, frame_h: int):
        self.frame_w = int(frame_w)
        self.frame_h = int(frame_h)
        self._prev_gray: Optional[np.ndarray] = None
        self._last_bbox: Optional[Tuple[float, float, float, float]] = None
        self._missed = 0
        self._track_id = 900001
        self._max_hold_frames = 10
        self._min_area = max(1800.0, float(frame_w * frame_h) * 0.0016)

    def _clamp_bbox(self, x: float, y: float, w: float, h: float) -> Tuple[float, float, float, float]:
        w = max(8.0, min(float(self.frame_w), w))
        h = max(8.0, min(float(self.frame_h), h))
        x = max(0.0, min(x, self.frame_w - w))
        y = max(0.0, min(y, self.frame_h - h))
        return (x, y, w, h)

    def update(self, frame_bgr: np.ndarray, allow_output: bool) -> Optional[TrackedFace]:
        gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (7, 7), 0)
        detected_bbox: Optional[Tuple[float, float, float, float]] = None

        if self._prev_gray is not None:
            diff = cv2.absdiff(gray, self._prev_gray)
            _, motion_mask = cv2.threshold(diff, 24, 255, cv2.THRESH_BINARY)
            motion_mask = cv2.morphologyEx(motion_mask, cv2.MORPH_OPEN, np.ones((3, 3), dtype=np.uint8))
            motion_mask = cv2.dilate(motion_mask, np.ones((5, 5), dtype=np.uint8), iterations=2)
            contours, _ = cv2.findContours(motion_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            best_area = 0.0
            best_rect: Optional[Tuple[int, int, int, int]] = None
            for contour in contours:
                area = float(cv2.contourArea(contour))
                if area < self._min_area:
                    continue
                x, y, w, h = cv2.boundingRect(contour)
                # Expand so fast-moving subjects keep context.
                ex = float(x) - (w * 0.18)
                ey = float(y) - (h * 0.16)
                ew = float(w) * 1.36
                eh = float(h) * 1.30
                ex, ey, ew, eh = self._clamp_bbox(ex, ey, ew, eh)
                metric = area * (1.0 + (ew * eh) / max(1.0, float(self.frame_w * self.frame_h)))
                if metric > best_area:
                    best_area = metric
                    best_rect = (int(round(ex)), int(round(ey)), int(round(ew)), int(round(eh)))

            if best_rect is not None:
                bx, by, bw, bh = best_rect
                if self._last_bbox is None:
                    self._last_bbox = (float(bx), float(by), float(bw), float(bh))
                else:
                    px, py, pw, ph = self._last_bbox
                    self._last_bbox = (
                        (px * 0.58) + (bx * 0.42),
                        (py * 0.58) + (by * 0.42),
                        (pw * 0.58) + (bw * 0.42),
                        (ph * 0.58) + (bh * 0.42),
                    )
                self._missed = 0
                detected_bbox = self._last_bbox
            else:
                self._missed += 1

        self._prev_gray = gray

        if not allow_output:
            return None

        if detected_bbox is None:
            if self._last_bbox is None or self._missed > self._max_hold_frames:
                return None
            detected_bbox = self._last_bbox

        x, y, w, h = detected_bbox
        x, y, w, h = self._clamp_bbox(x, y, w, h)
        return TrackedFace(
            track_id=self._track_id,
            x=x,
            y=y,
            w=w,
            h=h,
            score=0.90,
        )


def _collect_track_snapshot(tracks) -> TrackSnapshot:
    return {
        int(track.track_id): (float(track.x), float(track.y), float(track.w), float(track.h))
        for track in tracks
    }


def _filter_primary_tracks(tracks, frame_w: int, frame_h: int):
    if not tracks:
        return []

    max_area = max(float(track.w) * float(track.h) for track in tracks)
    frame_area = float(max(1, frame_w * frame_h))
    min_abs_area = frame_area * 0.0035
    min_area = max(min_abs_area, max_area * 0.18)

    filtered = [
        track
        for track in tracks
        if (float(track.w) * float(track.h)) >= min_area and float(track.score) >= 0.35
    ]
    if filtered:
        return filtered

    largest = max(tracks, key=lambda track: float(track.w) * float(track.h))
    return [largest]


def _pick_track_by_side(tracks, side: Optional[int], frame_w: int):
    if side not in (-1, 1) or not tracks:
        return None

    frame_mid_x = frame_w * 0.5
    if side < 0:
        side_tracks = [track for track in tracks if (track.x + (track.w * 0.5)) < frame_mid_x]
    else:
        side_tracks = [track for track in tracks if (track.x + (track.w * 0.5)) >= frame_mid_x]

    if not side_tracks:
        return None
    return max(side_tracks, key=lambda track: float(track.w) * float(track.h))


def _state_emission(
    frame_index: int,
    state: Optional[int],
    frame_tracks: List[TrackSnapshot],
    emission_scores: List[Dict[int, float]],
) -> float:
    visible_tracks = frame_tracks[frame_index]
    if state is None:
        return -0.04 if not visible_tracks else -0.16
    if state in emission_scores[frame_index]:
        return emission_scores[frame_index][state]
    return -0.32 if visible_tracks else -0.05


def _segment_runs(values: List[Optional[int]]) -> List[Tuple[int, int, Optional[int]]]:
    if not values:
        return []
    runs: List[Tuple[int, int, Optional[int]]] = []
    start = 0
    current = values[0]
    for idx in range(1, len(values)):
        if values[idx] == current:
            continue
        runs.append((start, idx - 1, current))
        start = idx
        current = values[idx]
    runs.append((start, len(values) - 1, current))
    return runs


def _avg_state_emission(
    start: int,
    end: int,
    state: int,
    frame_tracks: List[TrackSnapshot],
    emission_scores: List[Dict[int, float]],
) -> float:
    total = 0.0
    count = 0
    for frame_index in range(start, end + 1):
        total += _state_emission(frame_index, state, frame_tracks, emission_scores)
        count += 1
    if count <= 0:
        return -1.0
    return total / float(count)


def _enforce_min_segment_length(
    timeline: List[Optional[int]],
    frame_tracks: List[TrackSnapshot],
    emission_scores: List[Dict[int, float]],
    min_segment_frames: int,
) -> List[Optional[int]]:
    if min_segment_frames <= 1 or len(timeline) < 3:
        return timeline

    output = list(timeline)
    for _ in range(16):
        changed = False
        runs = _segment_runs(output)
        if len(runs) <= 1:
            break

        for run_index, (start, end, state) in enumerate(runs):
            if (end - start + 1) >= min_segment_frames:
                continue

            prev_state = runs[run_index - 1][2] if run_index > 0 else None
            next_state = runs[run_index + 1][2] if run_index + 1 < len(runs) else None

            replacement: Optional[int] = None
            if prev_state is not None and prev_state == next_state:
                replacement = prev_state
            else:
                candidates = [candidate for candidate in (prev_state, next_state) if candidate is not None]
                if candidates:
                    replacement = max(
                        candidates,
                        key=lambda candidate: _avg_state_emission(start, end, candidate, frame_tracks, emission_scores),
                    )

            if replacement is None:
                continue

            for frame_index in range(start, end + 1):
                output[frame_index] = replacement
            changed = True

        if not changed:
            break

    return output


def _majority_filter_timeline(
    timeline: List[Optional[int]],
    process_fps: float,
    config: ReframeConfig,
) -> List[Optional[int]]:
    if len(timeline) < 5:
        return timeline

    window_frames = max(5, int(round(max(0.18, config.speaker_min_segment_sec * 0.55) * max(1.0, process_fps))))
    if window_frames % 2 == 0:
        window_frames += 1
    radius = window_frames // 2

    filtered = list(timeline)
    for frame_index in range(len(timeline)):
        start = max(0, frame_index - radius)
        end = min(len(timeline), frame_index + radius + 1)
        counts: Dict[int, int] = {}
        for state in timeline[start:end]:
            if state is None:
                continue
            counts[state] = counts.get(state, 0) + 1
        if not counts:
            continue
        top_state, top_count = max(counts.items(), key=lambda item: item[1])
        if top_count >= max(2, (end - start) // 3):
            filtered[frame_index] = top_state

    return filtered


def _build_conversation_timeline(
    frame_tracks: List[TrackSnapshot],
    frame_scores: List[Dict[int, float]],
    frame_w: int,
    process_fps: float,
) -> List[Optional[int]]:
    frame_mid_x = frame_w * 0.5

    def _best_side_track(track_map: TrackSnapshot, is_left: bool) -> Optional[int]:
        best_id: Optional[int] = None
        best_metric = -1.0
        for track_id, (x, _y, w, h) in track_map.items():
            cx = x + (w * 0.5)
            if is_left and cx >= frame_mid_x:
                continue
            if (not is_left) and cx < frame_mid_x:
                continue
            side_distance = abs(cx - frame_mid_x) / max(1.0, frame_mid_x)
            area = w * h
            metric = area * (0.70 + (side_distance * 0.7))
            if metric > best_metric:
                best_metric = metric
                best_id = int(track_id)
        return best_id

    all_scores = [float(score) for score_map in frame_scores for score in score_map.values() if float(score) > 0.0]
    if all_scores:
        score_floor = max(0.015, float(np.percentile(np.array(all_scores, dtype=np.float32), 45)) * 0.52)
    else:
        score_floor = 0.03

    switch_margin = 1.35
    switch_delta = score_floor * 0.45
    confirm_frames = max(2, int(round(0.16 * max(1.0, process_fps))))
    missing_switch_frames = max(4, int(round(0.20 * max(1.0, process_fps))))

    active_side: Optional[int] = None  # -1 left, +1 right
    pending_side: Optional[int] = None
    pending_count = 0
    missing_active = 0
    left_ema = 0.0
    right_ema = 0.0
    timeline: List[Optional[int]] = []

    for frame_index, track_map in enumerate(frame_tracks):
        score_map = frame_scores[frame_index]
        left_track_id = _best_side_track(track_map, is_left=True)
        right_track_id = _best_side_track(track_map, is_left=False)

        left_raw = float(score_map.get(left_track_id, 0.0)) if left_track_id is not None else 0.0
        right_raw = float(score_map.get(right_track_id, 0.0)) if right_track_id is not None else 0.0

        # Faster attack than decay for turn-taking.
        left_ema = ((left_ema * 0.55) + (left_raw * 0.45)) if left_raw >= left_ema else ((left_ema * 0.84) + (left_raw * 0.16))
        right_ema = ((right_ema * 0.55) + (right_raw * 0.45)) if right_raw >= right_ema else ((right_ema * 0.84) + (right_raw * 0.16))

        if active_side is None:
            if left_track_id is None and right_track_id is None:
                timeline.append(None)
                continue
            if right_track_id is None:
                active_side = -1
            elif left_track_id is None:
                active_side = +1
            else:
                active_side = -1 if left_ema >= right_ema else +1

        active_track = left_track_id if active_side == -1 else right_track_id
        alt_side = +1 if active_side == -1 else -1
        alt_track = right_track_id if active_side == -1 else left_track_id
        active_score = left_ema if active_side == -1 else right_ema
        alt_score = right_ema if active_side == -1 else left_ema

        if active_track is None:
            missing_active += 1
        else:
            missing_active = 0

        # If active track disappears, switch after a short grace period.
        if active_track is None and alt_track is not None and missing_active >= missing_switch_frames:
            active_side = alt_side
            pending_side = None
            pending_count = 0
            active_track = alt_track
            active_score, alt_score = alt_score, active_score

        # Only switch on confident speaking dominance, not head motion.
        should_challenge = (
            alt_track is not None
            and alt_score >= score_floor
            and alt_score > ((active_score * switch_margin) + switch_delta)
        )

        if should_challenge:
            if pending_side == alt_side:
                pending_count += 1
            else:
                pending_side = alt_side
                pending_count = 1
            if pending_count >= confirm_frames:
                active_side = alt_side
                pending_side = None
                pending_count = 0
        else:
            pending_side = None
            pending_count = 0

        chosen_track = left_track_id if active_side == -1 else right_track_id
        if chosen_track is None:
            chosen_track = right_track_id if active_side == -1 else left_track_id
        timeline.append(chosen_track if chosen_track is not None else None)

    return timeline


def _build_speaker_timeline(
    frame_tracks: List[TrackSnapshot],
    frame_scores: List[Dict[int, float]],
    frame_w: int,
    frame_h: int,
    process_fps: float,
    config: ReframeConfig,
) -> List[Optional[int]]:
    frame_count = len(frame_tracks)
    if frame_count <= 0:
        return []

    score_samples: Dict[int, List[float]] = {}
    for score_map in frame_scores:
        for track_id, score in score_map.items():
            score_samples.setdefault(int(track_id), []).append(float(score))

    score_scale: Dict[int, float] = {}
    for track_id, samples in score_samples.items():
        if not samples:
            score_scale[track_id] = 1.0
            continue
        percentile = float(np.percentile(np.array(samples, dtype=np.float32), 85))
        score_scale[track_id] = max(0.12, percentile)

    frame_mid_x = frame_w * 0.5

    # Apply "side-speaker bias" only for true two-person opposite-side layouts.
    # For general videos, allow center subjects normally.
    pair_like_frames = 0
    for track_map in frame_tracks:
        if len(track_map) < 2:
            continue
        centers = sorted((x + (w * 0.5)) / max(1.0, float(frame_w)) for (x, _y, w, _h) in track_map.values())
        span = centers[-1] - centers[0]
        if span >= 0.34 and centers[0] <= 0.46 and centers[-1] >= 0.54:
            pair_like_frames += 1
    conversation_mode = pair_like_frames >= max(22, int(round(frame_count * 0.18)))

    if conversation_mode:
        return _build_conversation_timeline(
            frame_tracks=frame_tracks,
            frame_scores=frame_scores,
            frame_w=frame_w,
            process_fps=process_fps,
        )

    frame_area = float(max(1, frame_w * frame_h))
    emission_scores: List[Dict[int, float]] = []
    for frame_index in range(frame_count):
        track_map = frame_tracks[frame_index]
        score_map = frame_scores[frame_index]
        emission: Dict[int, float] = {}
        for track_id, (x, y, w, h) in track_map.items():
            raw_score = float(score_map.get(track_id, 0.0))
            scale = score_scale.get(track_id, 1.0)
            normalized = min(2.5, raw_score / max(1e-6, scale))

            center_x = x + (w * 0.5)
            side_distance = min(1.0, abs(center_x - frame_mid_x) / max(1.0, frame_mid_x))
            area_ratio = max(0.0, (w * h) / frame_area)

            if conversation_mode:
                side_bonus = side_distance * 0.48
                area_bonus = min(0.40, area_ratio * 20.0)
                center_penalty = 0.60 if side_distance < 0.18 else (0.20 if side_distance < 0.28 else 0.0)
                emission[track_id] = (normalized * 1.95) + side_bonus + area_bonus - center_penalty
            else:
                side_bonus = side_distance * 0.06
                area_bonus = min(0.55, area_ratio * 24.0)
                emission[track_id] = (normalized * 2.05) + side_bonus + area_bonus

        emission_scores.append(emission)

    switch_penalty = max(0.2, float(config.speaker_switch_penalty))
    dp_prev: Dict[Optional[int], float] = {}
    dp_history: List[Dict[Optional[int], float]] = []
    backpointers: List[Dict[Optional[int], Optional[int]]] = []
    state_lists: List[List[Optional[int]]] = []

    for frame_index in range(frame_count):
        visible_ids = set(frame_tracks[frame_index].keys())
        candidate_states = set(visible_ids)
        candidate_states.update(dp_prev.keys())
        candidate_states.add(None)

        dp_curr: Dict[Optional[int], float] = {}
        back: Dict[Optional[int], Optional[int]] = {}

        for state in candidate_states:
            emit = _state_emission(frame_index, state, frame_tracks, emission_scores)
            if frame_index == 0 or not dp_prev:
                dp_curr[state] = emit
                back[state] = None
                continue

            best_prev_state: Optional[int] = None
            best_score = -1e18
            for prev_state, prev_score in dp_prev.items():
                transition = 0.0
                if prev_state != state:
                    adaptive_penalty = switch_penalty
                    if state is not None:
                        prev_emit = _state_emission(frame_index, prev_state, frame_tracks, emission_scores)
                        dominance = emit - prev_emit
                        if dominance >= 0.95:
                            adaptive_penalty *= 0.12
                        elif dominance >= 0.55:
                            adaptive_penalty *= 0.42
                    transition = -adaptive_penalty
                if state is None:
                    transition -= 0.05
                elif prev_state is None:
                    transition -= 0.02
                candidate_score = prev_score + transition + emit
                if candidate_score > best_score:
                    best_score = candidate_score
                    best_prev_state = prev_state

            dp_curr[state] = best_score
            back[state] = best_prev_state

        dp_prev = dp_curr
        dp_history.append(dict(dp_curr))
        backpointers.append(back)
        state_lists.append(list(dp_curr.keys()))

    if not dp_prev:
        return [None for _ in range(frame_count)]

    best_state = max(dp_prev.items(), key=lambda item: item[1])[0]
    timeline: List[Optional[int]] = [None for _ in range(frame_count)]
    for frame_index in range(frame_count - 1, -1, -1):
        timeline[frame_index] = best_state
        best_state = backpointers[frame_index].get(best_state)
        if best_state is None and frame_index > 0 and state_lists[frame_index - 1]:
            best_state = max(
                state_lists[frame_index - 1],
                key=lambda candidate: dp_history[frame_index - 1].get(candidate, -1e18),
            )

    min_segment_frames = max(2, int(round(float(config.speaker_min_segment_sec) * max(1.0, process_fps))))
    timeline = _majority_filter_timeline(timeline, process_fps, config)
    timeline = _enforce_min_segment_length(
        timeline,
        frame_tracks,
        emission_scores,
        min_segment_frames=min_segment_frames,
    )

    # Only apply center-avoid remap in podcast-like two-person scenes.
    if conversation_mode:
        for frame_index, track_id in enumerate(timeline):
            if track_id is None:
                continue
            track = frame_tracks[frame_index].get(track_id)
            if track is None:
                continue
            center_x = track[0] + (track[2] * 0.5)
            side_distance = abs(center_x - frame_mid_x) / max(1.0, frame_mid_x)
            if side_distance >= 0.15:
                continue
            alternative_ids = [
                candidate
                for candidate in frame_tracks[frame_index].keys()
                if candidate != track_id
                and abs((frame_tracks[frame_index][candidate][0] + (frame_tracks[frame_index][candidate][2] * 0.5)) - frame_mid_x)
                / max(1.0, frame_mid_x)
                >= 0.15
            ]
            if not alternative_ids:
                continue
            timeline[frame_index] = max(
                alternative_ids,
                key=lambda candidate: emission_scores[frame_index].get(candidate, -1e9),
            )

    return timeline


def _analyze_speaking_timeline(
    input_path: Path,
    source_fps: float,
    process_fps: float,
    frame_w: int,
    frame_h: int,
    config: ReframeConfig,
) -> Tuple[List[Optional[int]], List[Optional[int]]]:
    cap = cv2.VideoCapture(str(input_path))
    if not cap.isOpened():
        raise RuntimeError("Could not open source video for speaker timeline analysis.")

    detector = FaceDetector(
        detection_width=config.detector_width,
        min_confidence=0.35,
        model_selection=1,
    )
    tracker = IOUTracker(
        iou_threshold=0.30,
        max_missed=max(24, config.detection_interval * 28),
    )
    speaker_activity = SpeakerActivityEstimator()
    motion_tracker = MotionSubjectTracker(frame_w=frame_w, frame_h=frame_h)

    frame_tracks: List[TrackSnapshot] = []
    frame_scores: List[Dict[int, float]] = []
    source_frame_index = 0
    output_frame_index = 0
    analysis_step = max(1, int(config.analysis_frame_step))
    last_score_map: Dict[int, float] = {}

    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                break

            if source_fps > process_fps:
                source_ms = int((source_frame_index / source_fps) * 1000.0)
                target_ms = int((output_frame_index / process_fps) * 1000.0)
                source_frame_ms = int(1000.0 / max(source_fps, 1.0))
                if source_ms + source_frame_ms < target_ms:
                    source_frame_index += 1
                    continue

            if analysis_step > 1 and (output_frame_index % analysis_step) != 0:
                predicted_tracks = tracker.predict(output_frame_index)
                primary_tracks = _filter_primary_tracks(predicted_tracks, frame_w=frame_w, frame_h=frame_h)
                motion_track = motion_tracker.update(frame, allow_output=(len(primary_tracks) == 0))
                if motion_track is not None:
                    primary_tracks = [motion_track]
                track_ids = {int(track.track_id) for track in primary_tracks}
                decayed_scores = {
                    int(track_id): float(score) * 0.96
                    for track_id, score in last_score_map.items()
                    if int(track_id) in track_ids
                }
                frame_tracks.append(_collect_track_snapshot(primary_tracks))
                frame_scores.append(decayed_scores)
                last_score_map = decayed_scores
                output_frame_index += 1
                source_frame_index += 1
                continue

            if output_frame_index % max(1, config.detection_interval) == 0:
                detections = detector.detect(frame)
                tracked_faces = tracker.update(detections, output_frame_index)
            else:
                tracked_faces = tracker.predict(output_frame_index)

            primary_tracks = _filter_primary_tracks(tracked_faces, frame_w=frame_w, frame_h=frame_h)
            motion_track = motion_tracker.update(frame, allow_output=(len(primary_tracks) == 0))
            if motion_track is not None:
                primary_tracks = [motion_track]
            score_map = speaker_activity.update(frame, primary_tracks)
            frame_tracks.append(_collect_track_snapshot(primary_tracks))
            frame_scores.append({int(track_id): float(score) for track_id, score in score_map.items()})
            last_score_map = {int(track_id): float(score) for track_id, score in score_map.items()}

            output_frame_index += 1
            source_frame_index += 1
    finally:
        try:
            if cap.isOpened():
                cap.release()
        except Exception:
            pass
        try:
            detector.close()
        except Exception:
            pass

    if not frame_tracks:
        return [], []

    timeline = _build_speaker_timeline(
        frame_tracks=frame_tracks,
        frame_scores=frame_scores,
        frame_w=frame_w,
        frame_h=frame_h,
        process_fps=process_fps,
        config=config,
    )

    frame_mid_x = frame_w * 0.5
    side_timeline: List[Optional[int]] = []
    last_side: Optional[int] = None
    for frame_index, selected_track_id in enumerate(timeline):
        side: Optional[int] = None
        if selected_track_id is not None:
            selected_box = frame_tracks[frame_index].get(int(selected_track_id))
            if selected_box is not None:
                center_x = selected_box[0] + (selected_box[2] * 0.5)
                side = -1 if center_x < frame_mid_x else 1
        if side is None:
            side = last_side
        side_timeline.append(side)
        if side is not None:
            last_side = side

    return timeline, side_timeline


def _draw_debug_overlay(
    output_frame: np.ndarray,
    crop_x: int,
    crop_y: int,
    crop_w: int,
    crop_h: int,
    tracks,
    speaker_scores: Dict[int, float],
    active_track_id: Optional[int],
    did_switch: bool,
    speaker_box,
) -> np.ndarray:
    out_h, out_w = output_frame.shape[:2]
    debug = output_frame.copy()
    sx = out_w / float(max(1, crop_w))
    sy = out_h / float(max(1, crop_h))

    for track in tracks:
        x1 = int(round((track.x - crop_x) * sx))
        y1 = int(round((track.y - crop_y) * sy))
        x2 = int(round((track.x + track.w - crop_x) * sx))
        y2 = int(round((track.y + track.h - crop_y) * sy))

        if x2 <= 0 or y2 <= 0 or x1 >= out_w or y1 >= out_h:
            continue

        x1 = max(0, min(out_w - 1, x1))
        y1 = max(0, min(out_h - 1, y1))
        x2 = max(0, min(out_w - 1, x2))
        y2 = max(0, min(out_h - 1, y2))
        if x2 <= x1 or y2 <= y1:
            continue

        is_active = active_track_id is not None and int(track.track_id) == int(active_track_id)
        color = (0, 64, 255) if is_active else (40, 220, 40)
        thickness = 4 if is_active else 2
        cv2.rectangle(debug, (x1, y1), (x2, y2), color, thickness)

        score = float(speaker_scores.get(int(track.track_id), 0.0))
        label = f"id:{track.track_id} s:{score:.2f}"
        cv2.putText(
            debug,
            label,
            (x1, max(14, y1 - 8)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.45,
            color,
            1,
            cv2.LINE_AA,
        )

    if speaker_box is not None:
        bx1 = int(round((speaker_box.x - crop_x) * sx))
        by1 = int(round((speaker_box.y - crop_y) * sy))
        bx2 = int(round((speaker_box.x + speaker_box.w - crop_x) * sx))
        by2 = int(round((speaker_box.y + speaker_box.h - crop_y) * sy))
        bx1 = max(0, min(out_w - 1, bx1))
        by1 = max(0, min(out_h - 1, by1))
        bx2 = max(0, min(out_w - 1, bx2))
        by2 = max(0, min(out_h - 1, by2))
        if bx2 > bx1 and by2 > by1:
            cv2.rectangle(debug, (bx1, by1), (bx2, by2), (255, 255, 0), 2)
            cv2.putText(
                debug,
                "speaker-region",
                (bx1, max(16, by1 - 8)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.48,
                (255, 255, 0),
                2,
                cv2.LINE_AA,
            )

    status_text = f"active:{active_track_id if active_track_id is not None else '-'}"
    if did_switch:
        status_text += " SWITCH"
    cv2.putText(
        debug,
        status_text,
        (10, 24),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.65,
        (255, 220, 30),
        2,
        cv2.LINE_AA,
    )
    return debug


def _draw_crop_minimap(
    output_frame: np.ndarray,
    source_frame: np.ndarray,
    crop_x: int,
    crop_y: int,
    crop_w: int,
    crop_h: int,
    tracks,
    active_track_id: Optional[int],
) -> np.ndarray:
    out = output_frame.copy()
    src_h, src_w = source_frame.shape[:2]
    mini_w = 160
    mini_h = max(90, int(round(mini_w * (src_h / max(1, src_w)))))
    mini = cv2.resize(source_frame, (mini_w, mini_h), interpolation=cv2.INTER_AREA)

    sx = mini_w / float(max(1, src_w))
    sy = mini_h / float(max(1, src_h))
    cx1 = int(round(crop_x * sx))
    cy1 = int(round(crop_y * sy))
    cx2 = int(round((crop_x + crop_w) * sx))
    cy2 = int(round((crop_y + crop_h) * sy))
    cv2.rectangle(mini, (cx1, cy1), (cx2, cy2), (240, 230, 40), 2)

    for track in tracks:
        x1 = int(round(track.x * sx))
        y1 = int(round(track.y * sy))
        x2 = int(round((track.x + track.w) * sx))
        y2 = int(round((track.y + track.h) * sy))
        is_active = active_track_id is not None and int(track.track_id) == int(active_track_id)
        color = (0, 64, 255) if is_active else (40, 220, 40)
        cv2.rectangle(mini, (x1, y1), (x2, y2), color, 1)

    pad = 8
    x0 = max(0, out.shape[1] - mini_w - pad)
    y0 = max(0, out.shape[0] - mini_h - pad)
    out[y0 : y0 + mini_h, x0 : x0 + mini_w] = mini
    cv2.rectangle(out, (x0, y0), (x0 + mini_w, y0 + mini_h), (255, 255, 255), 1)
    cv2.putText(out, "crop-map", (x0 + 6, y0 + 14), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)
    return out


def _resolve_pair_tracks(tracks, state: Dict[str, Optional[int]]):
    if len(tracks) < 2:
        return None, None

    by_id = {int(track.track_id): track for track in tracks}
    left_id = state.get("left_id")
    right_id = state.get("right_id")
    if left_id in by_id and right_id in by_id and left_id != right_id:
        return by_id[left_id], by_id[right_id]

    sorted_by_x = sorted(tracks, key=lambda t: t.x + (t.w * 0.5))
    left_track = sorted_by_x[0]
    right_track = sorted_by_x[-1]
    if int(left_track.track_id) == int(right_track.track_id):
        return None, None

    state["left_id"] = int(left_track.track_id)
    state["right_id"] = int(right_track.track_id)
    return left_track, right_track


def _compute_person_crop(
    track,
    frame_w: int,
    frame_h: int,
    target_aspect: float,
    side_sign: int,
):
    face_cx = track.x + (track.w * 0.5)
    face_cy = track.y + (track.h * 0.5)

    # Make the person occupy less of the frame by expanding crop aggressively.
    crop_h = max(track.h * 5.2, frame_h * 0.55)
    crop_w = max(track.w * 4.4, crop_h * target_aspect)

    # Keep the speaking side in frame and include upper body/table context.
    center_x = face_cx + (track.w * 0.40 * side_sign)
    center_y = face_cy + (track.h * 1.20)

    crop_w = min(float(frame_w), max(80.0, crop_w))
    crop_h = min(float(frame_h), max(80.0, crop_h))

    x = center_x - (crop_w * 0.5)
    y = center_y - (crop_h * 0.5)
    x = max(0.0, min(x, frame_w - crop_w))
    y = max(0.0, min(y, frame_h - crop_h))
    return int(round(x)), int(round(y)), int(round(crop_w)), int(round(crop_h))


def _draw_track_in_pane(
    pane: np.ndarray,
    track,
    crop_x: int,
    crop_y: int,
    crop_w: int,
    crop_h: int,
    active_track_id: Optional[int],
    score: float,
    title: str,
) -> np.ndarray:
    out = pane.copy()
    h, w = out.shape[:2]
    sx = w / float(max(1, crop_w))
    sy = h / float(max(1, crop_h))

    x1 = int(round((track.x - crop_x) * sx))
    y1 = int(round((track.y - crop_y) * sy))
    x2 = int(round((track.x + track.w - crop_x) * sx))
    y2 = int(round((track.y + track.h - crop_y) * sy))
    x1 = max(0, min(w - 1, x1))
    y1 = max(0, min(h - 1, y1))
    x2 = max(0, min(w - 1, x2))
    y2 = max(0, min(h - 1, y2))
    is_active = active_track_id is not None and int(track.track_id) == int(active_track_id)
    color = (0, 64, 255) if is_active else (40, 220, 40)

    cv2.rectangle(out, (x1, y1), (x2, y2), color, 2)
    cv2.rectangle(out, (0, 0), (w - 1, h - 1), color, 2 if is_active else 1)
    cv2.putText(
        out,
        f"{title} id:{track.track_id} s:{score:.2f}",
        (8, 20),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.52,
        color,
        2,
        cv2.LINE_AA,
    )
    return out


def _render_split_layout(
    frame_bgr: np.ndarray,
    output_width: int,
    output_height: int,
    left_track,
    right_track,
    active_track_id: Optional[int],
    speaker_scores: Dict[int, float],
    debug_overlay: bool,
) -> np.ndarray:
    pane_h_top = output_height // 2
    pane_h_bottom = output_height - pane_h_top
    pane_aspect = output_width / float(max(1, pane_h_top))
    frame_h, frame_w = frame_bgr.shape[:2]

    left_crop = _compute_person_crop(left_track, frame_w, frame_h, pane_aspect, side_sign=-1)
    right_crop = _compute_person_crop(right_track, frame_w, frame_h, pane_aspect, side_sign=1)

    # Put current active speaker on top panel.
    top_track, top_crop, top_title = left_track, left_crop, "top"
    bottom_track, bottom_crop, bottom_title = right_track, right_crop, "bottom"
    if active_track_id is not None and int(active_track_id) == int(right_track.track_id):
        top_track, top_crop, top_title = right_track, right_crop, "top"
        bottom_track, bottom_crop, bottom_title = left_track, left_crop, "bottom"

    tx, ty, tw, th = top_crop
    bx, by, bw, bh = bottom_crop
    top_src = frame_bgr[ty : ty + th, tx : tx + tw]
    bottom_src = frame_bgr[by : by + bh, bx : bx + bw]
    if top_src.size == 0 or bottom_src.size == 0:
        return cv2.resize(frame_bgr, (output_width, output_height), interpolation=cv2.INTER_LINEAR)

    top_pane = cv2.resize(top_src, (output_width, pane_h_top), interpolation=cv2.INTER_LINEAR)
    bottom_pane = cv2.resize(bottom_src, (output_width, pane_h_bottom), interpolation=cv2.INTER_LINEAR)

    if debug_overlay:
        top_score = float(speaker_scores.get(int(top_track.track_id), 0.0))
        bottom_score = float(speaker_scores.get(int(bottom_track.track_id), 0.0))
        top_pane = _draw_track_in_pane(top_pane, top_track, tx, ty, tw, th, active_track_id, top_score, top_title)
        bottom_pane = _draw_track_in_pane(bottom_pane, bottom_track, bx, by, bw, bh, active_track_id, bottom_score, bottom_title)

    out = np.vstack([top_pane, bottom_pane])
    cv2.line(out, (0, pane_h_top), (output_width, pane_h_top), (240, 240, 240), 2)
    return out


def _open_writer(path: Path, fps: float, width: int, height: int):
    for codec in ("avc1", "mp4v"):
        writer = cv2.VideoWriter(
            str(path),
            cv2.VideoWriter_fourcc(*codec),
            fps,
            (width, height),
        )
        if writer.isOpened():
            return writer
    return None


def _run_ffmpeg_mux(input_video: Path, processed_silent_video: Path, output_video: Path) -> None:
    ffmpeg_cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(processed_silent_video),
        "-i",
        str(input_video),
        "-map",
        "0:v:0",
        "-map",
        "1:a:0?",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-b:a",
        "160k",
        "-shortest",
        "-movflags",
        "+faststart",
        str(output_video),
    ]

    result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
    if result.returncode == 0:
        return

    fallback_cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(processed_silent_video),
        "-c:v",
        "copy",
        "-movflags",
        "+faststart",
        str(output_video),
    ]
    fallback = subprocess.run(fallback_cmd, capture_output=True, text=True)
    if fallback.returncode != 0:
        stderr = fallback.stderr.strip() or result.stderr.strip() or "ffmpeg mux failed"
        raise RuntimeError(stderr)


def _compute_processing_fps(source_fps: float) -> float:
    if source_fps <= 1.0:
        return 24.0
    return min(30.0, source_fps)


def process_video(input_path: str, output_path: str) -> Dict[str, object]:
    return process_video_with_config(input_path, output_path, ReframeConfig())


def process_video_with_config(
    input_path: str,
    output_path: str,
    config: ReframeConfig,
) -> Dict[str, object]:
    in_path = Path(input_path).expanduser().resolve()
    out_path = Path(output_path).expanduser().resolve()

    if not in_path.is_file():
        raise FileNotFoundError(f"Input video not found: {in_path}")

    out_path.parent.mkdir(parents=True, exist_ok=True)

    meta_cap = cv2.VideoCapture(str(in_path))
    if not meta_cap.isOpened():
        raise RuntimeError("Could not open source video.")

    source_fps = float(meta_cap.get(cv2.CAP_PROP_FPS) or 24.0)
    process_fps = _compute_processing_fps(source_fps)
    frame_w = int(meta_cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
    frame_h = int(meta_cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)
    meta_cap.release()

    if frame_w <= 0 or frame_h <= 0:
        raise RuntimeError("Could not read source video dimensions.")

    speaking_timeline, speaking_side_timeline = _analyze_speaking_timeline(
        input_path=in_path,
        source_fps=source_fps,
        process_fps=process_fps,
        frame_w=frame_w,
        frame_h=frame_h,
        config=config,
    )

    cap: Optional[cv2.VideoCapture] = cv2.VideoCapture(str(in_path))
    if cap is None or not cap.isOpened():
        raise RuntimeError("Could not open source video for render pass.")

    detector: Optional[FaceDetector] = FaceDetector(
        detection_width=config.detector_width,
        min_confidence=0.35,
        model_selection=1,
    )
    tracker = IOUTracker(
        iou_threshold=0.30,
        max_missed=max(24, config.detection_interval * 28),
    )
    cropper = CropPlanner(
        frame_w=frame_w,
        frame_h=frame_h,
        aspect_w=9,
        aspect_h=16,
        smoothing_alpha=config.smoothing_alpha,
        face_y_offset_ratio=config.face_y_offset_ratio,
        subject_hold_sec=config.subject_hold_sec,
        max_move_ratio=config.max_move_ratio,
        hard_cut_on_switch=config.hard_cut_on_switch,
        side_bias_ratio=config.side_bias_ratio,
        speaker_switch_margin=config.speaker_switch_margin,
        speaker_min_score=config.speaker_min_score,
    )
    speaker_activity = SpeakerActivityEstimator()
    motion_tracker = MotionSubjectTracker(frame_w=frame_w, frame_h=frame_h)
    pair_layout_state: Dict[str, Optional[int]] = {"left_id": None, "right_id": None}
    render_needs_scores = bool(config.debug_overlay)

    tmp_silent = Path(tempfile.gettempdir()) / f"clipforge-reframe-{next(tempfile._get_candidate_names())}.mp4"
    writer = _open_writer(tmp_silent, process_fps, config.output_width, config.output_height)
    if writer is None or not writer.isOpened():
        if cap is not None and cap.isOpened():
            cap.release()
        if detector is not None:
            detector.close()
        raise RuntimeError("Could not open output video writer.")

    source_frame_index = 0
    output_frame_index = 0

    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                break

            if source_fps > process_fps:
                source_ms = int((source_frame_index / source_fps) * 1000.0)
                target_ms = int((output_frame_index / process_fps) * 1000.0)
                source_frame_ms = int(1000.0 / max(source_fps, 1.0))
                if source_ms + source_frame_ms < target_ms:
                    source_frame_index += 1
                    continue

            if output_frame_index % max(1, config.detection_interval) == 0:
                detections = detector.detect(frame)
                tracked_faces = tracker.update(detections, output_frame_index)
            else:
                tracked_faces = tracker.predict(output_frame_index)

            primary_tracks = _filter_primary_tracks(tracked_faces, frame_w=frame_w, frame_h=frame_h)
            motion_track = motion_tracker.update(frame, allow_output=(len(primary_tracks) == 0))
            if motion_track is not None:
                primary_tracks = [motion_track]
            if render_needs_scores:
                speaker_scores = speaker_activity.update(frame, primary_tracks)
            else:
                speaker_scores = {}
            forced_track_id = speaking_timeline[output_frame_index] if output_frame_index < len(speaking_timeline) else None
            preferred_side = speaking_side_timeline[output_frame_index] if output_frame_index < len(speaking_side_timeline) else None

            if primary_tracks:
                current_ids = {int(track.track_id) for track in primary_tracks}
                by_id = {int(track.track_id): track for track in primary_tracks}
                if forced_track_id is None or int(forced_track_id) not in current_ids:
                    side_track = _pick_track_by_side(primary_tracks, preferred_side, frame_w=frame_w)
                    if side_track is not None:
                        forced_track_id = int(side_track.track_id)
                elif preferred_side in (-1, 1):
                    forced_track = by_id.get(int(forced_track_id))
                    if forced_track is not None:
                        center_x = forced_track.x + (forced_track.w * 0.5)
                        center_ratio = abs(center_x - (frame_w * 0.5)) / max(1.0, frame_w * 0.5)
                        # If selected track falls near center while both sides are visible,
                        # snap to the preferred speaking side to avoid center dead-space crops.
                        if center_ratio < 0.14:
                            side_track = _pick_track_by_side(primary_tracks, preferred_side, frame_w=frame_w)
                            if side_track is not None:
                                forced_track_id = int(side_track.track_id)

            decision = cropper.compute(
                primary_tracks,
                output_frame_index,
                process_fps,
                speaker_scores=speaker_scores,
                forced_track_id=forced_track_id,
                forced_side=preferred_side,
            )
            if len(primary_tracks) >= 2 and preferred_side in (-1, 1):
                crop_center_x = decision.crop.x + (decision.crop.w * 0.5)
                frame_mid_x = frame_w * 0.5
                near_center = abs(crop_center_x - frame_mid_x) < (decision.crop.w * 0.18)
                wrong_side = ((crop_center_x - frame_mid_x) * preferred_side) < (decision.crop.w * 0.04)
                if near_center or wrong_side:
                    anchor_center_x = frame_mid_x + (preferred_side * decision.crop.w * 0.30)
                    adjusted_x = int(round(anchor_center_x - (decision.crop.w * 0.5)))
                    adjusted_x = max(0, min(adjusted_x, frame_w - decision.crop.w))
                    decision.crop.x = adjusted_x
            active_track_id = decision.active_track_id
            use_split = (
                config.layout_mode == "split"
                or (config.layout_mode == "auto" and len(primary_tracks) >= 2)
            )

            if use_split:
                left_track, right_track = _resolve_pair_tracks(primary_tracks, pair_layout_state)
                if left_track is not None and right_track is not None:
                    vertical = _render_split_layout(
                        frame,
                        config.output_width,
                        config.output_height,
                        left_track,
                        right_track,
                        active_track_id,
                        speaker_scores,
                        config.debug_overlay,
                    )
                else:
                    use_split = False

            if not use_split:
                crop = decision.crop
                cropped = frame[crop.y : crop.y + crop.h, crop.x : crop.x + crop.w]
                if cropped.size == 0:
                    source_frame_index += 1
                    continue

                vertical = cv2.resize(
                    cropped,
                    (config.output_width, config.output_height),
                    interpolation=cv2.INTER_LINEAR,
                )
                if config.debug_overlay:
                    vertical = _draw_debug_overlay(
                        vertical,
                        crop.x,
                        crop.y,
                        crop.w,
                        crop.h,
                        primary_tracks,
                        speaker_scores,
                        active_track_id,
                        decision.did_switch,
                        decision.speaker_box,
                    )
                    vertical = _draw_crop_minimap(
                        vertical,
                        frame,
                        crop.x,
                        crop.y,
                        crop.w,
                        crop.h,
                        primary_tracks,
                        active_track_id,
                    )
            writer.write(vertical)
            output_frame_index += 1
            source_frame_index += 1

        if output_frame_index <= 0:
            raise RuntimeError("No frames were processed for AI reframe output.")

        # Flush and close the temporary render before ffmpeg mux reads it.
        if cap is not None:
            cap.release()
        writer.release()
        _run_ffmpeg_mux(in_path, tmp_silent, out_path)

        return {
            "status": "ok",
            "outputPath": str(out_path),
            "width": config.output_width,
            "height": config.output_height,
            "fps": process_fps,
            "processedFrames": output_frame_index,
            "detectionInterval": max(1, config.detection_interval),
            "timelineFrames": len(speaking_timeline),
        }
    finally:
        try:
            if cap is not None and cap.isOpened():
                cap.release()
        except Exception:
            pass
        try:
            if writer is not None:
                writer.release()
        except Exception:
            pass
        try:
            if detector is not None:
                detector.close()
        except Exception:
            pass
        if tmp_silent.exists():
            tmp_silent.unlink(missing_ok=True)


def parse_args(argv: Optional[list[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="AI reframe: horizontal video to vertical shorts format")
    parser.add_argument("input_path", help="Path to source MP4 video")
    parser.add_argument("output_path", help="Path for reframed MP4 output")
    parser.add_argument("--width", type=int, default=720, choices=[720, 1080], help="Output width")
    parser.add_argument("--height", type=int, default=1280, choices=[1280, 1920], help="Output height")
    parser.add_argument("--detection-interval", type=int, default=2, help="Run face detection every N frames")
    parser.add_argument("--detector-width", type=int, default=512, help="Detection inference width")
    parser.add_argument("--analysis-frame-step", type=int, default=3, help="Analyze every Nth frame in speaker timeline pass")
    parser.add_argument("--alpha", type=float, default=0.92, help="Exponential smoothing alpha")
    parser.add_argument("--subject-hold-sec", type=float, default=0.8, help="Minimum subject hold duration")
    parser.add_argument("--max-move-ratio", type=float, default=0.035, help="Max crop movement ratio per frame")
    parser.add_argument("--face-y-offset-ratio", type=float, default=-0.45, help="Face center offset (negative moves down)")
    parser.add_argument("--speaker-switch-penalty", type=float, default=0.9, help="Penalty for switching active speaker track")
    parser.add_argument("--speaker-min-segment-sec", type=float, default=0.45, help="Minimum speaker segment duration after smoothing")
    parser.add_argument("--layout-mode", choices=["auto", "single", "split"], default="single", help="Layout strategy")
    parser.add_argument("--debug-overlay", action="store_true", help="Draw tracking boundary boxes in output")
    parser.add_argument("--no-debug-overlay", action="store_true", help="Disable tracking boundary boxes in output")
    return parser.parse_args(argv)


def main(argv: Optional[list[str]] = None) -> int:
    args = parse_args(argv)

    if (args.width, args.height) not in {(720, 1280), (1080, 1920)}:
        print(json.dumps({"error": "Output resolution must be 720x1280 or 1080x1920."}), file=sys.stderr)
        return 1

    config = ReframeConfig(
        output_width=int(args.width),
        output_height=int(args.height),
        detection_interval=max(1, int(args.detection_interval)),
        detector_width=max(160, int(args.detector_width)),
        analysis_frame_step=max(1, int(args.analysis_frame_step)),
        smoothing_alpha=float(args.alpha),
        face_y_offset_ratio=float(args.face_y_offset_ratio),
        subject_hold_sec=max(0.1, float(args.subject_hold_sec)),
        max_move_ratio=max(0.005, float(args.max_move_ratio)),
        speaker_switch_penalty=max(0.1, float(args.speaker_switch_penalty)),
        speaker_min_segment_sec=max(0.1, float(args.speaker_min_segment_sec)),
        debug_overlay=(False if args.no_debug_overlay else (True if args.debug_overlay else True)),
        layout_mode=str(args.layout_mode),
    )

    try:
        result = process_video_with_config(args.input_path, args.output_path, config)
        json.dump(result, sys.stdout)
        return 0
    except Exception as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
