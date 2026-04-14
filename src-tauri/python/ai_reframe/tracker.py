from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable, List, Optional, Tuple

from .detector import FaceBox


BBox = Tuple[float, float, float, float]


@dataclass
class TrackedFace:
    track_id: int
    x: float
    y: float
    w: float
    h: float
    score: float

    @property
    def area(self) -> float:
        return max(0.0, self.w) * max(0.0, self.h)


@dataclass
class _TrackState:
    track_id: int
    bbox: BBox
    score: float
    last_detected_bbox: BBox
    previous_detected_bbox: BBox
    last_detected_frame: int
    previous_detected_frame: int
    last_updated_frame: int
    missed_detections: int = 0


def _iou(a: BBox, b: BBox) -> float:
    ax1, ay1, aw, ah = a
    bx1, by1, bw, bh = b
    ax2, ay2 = ax1 + aw, ay1 + ah
    bx2, by2 = bx1 + bw, by1 + bh

    inter_x1 = max(ax1, bx1)
    inter_y1 = max(ay1, by1)
    inter_x2 = min(ax2, bx2)
    inter_y2 = min(ay2, by2)
    inter_w = max(0.0, inter_x2 - inter_x1)
    inter_h = max(0.0, inter_y2 - inter_y1)
    inter = inter_w * inter_h

    union = (aw * ah) + (bw * bh) - inter
    if union <= 0.0:
        return 0.0
    return inter / union


def _bbox_from_face(face: FaceBox) -> BBox:
    return (float(face.x), float(face.y), float(face.w), float(face.h))


def _clamp_bbox(bbox: BBox) -> BBox:
    x, y, w, h = bbox
    return (x, y, max(1.0, w), max(1.0, h))


class IOUTracker:
    def __init__(self, iou_threshold: float = 0.3, max_missed: int = 12):
        self.iou_threshold = float(iou_threshold)
        self.max_missed = int(max(1, max_missed))
        self._tracks: Dict[int, _TrackState] = {}
        self._next_track_id = 1

    def _active_faces(self) -> List[TrackedFace]:
        return [
            TrackedFace(
                track_id=track.track_id,
                x=track.bbox[0],
                y=track.bbox[1],
                w=track.bbox[2],
                h=track.bbox[3],
                score=track.score,
            )
            for track in self._tracks.values()
        ]

    def update(self, detections: Iterable[FaceBox], frame_index: int) -> List[TrackedFace]:
        detection_list = list(detections)
        detection_boxes = [_bbox_from_face(face) for face in detection_list]

        existing_ids = list(self._tracks.keys())
        unmatched_tracks = set(existing_ids)
        unmatched_detections = set(range(len(detection_boxes)))
        matches: List[Tuple[int, int]] = []

        while unmatched_tracks and unmatched_detections:
            best_pair: Optional[Tuple[int, int]] = None
            best_score = self.iou_threshold

            for track_id in unmatched_tracks:
                track_box = self._tracks[track_id].bbox
                for det_idx in unmatched_detections:
                    score = _iou(track_box, detection_boxes[det_idx])
                    if score > best_score:
                        best_score = score
                        best_pair = (track_id, det_idx)

            if not best_pair:
                break

            track_id, det_idx = best_pair
            matches.append((track_id, det_idx))
            unmatched_tracks.discard(track_id)
            unmatched_detections.discard(det_idx)

        for track_id, det_idx in matches:
            track = self._tracks[track_id]
            detection_box = _clamp_bbox(detection_boxes[det_idx])
            track.previous_detected_bbox = track.last_detected_bbox
            track.previous_detected_frame = track.last_detected_frame
            track.last_detected_bbox = detection_box
            track.last_detected_frame = frame_index
            track.bbox = detection_box
            track.score = float(detection_list[det_idx].score)
            track.last_updated_frame = frame_index
            track.missed_detections = 0

        for track_id in unmatched_tracks:
            track = self._tracks[track_id]
            track.missed_detections += 1

        for det_idx in unmatched_detections:
            detection_box = _clamp_bbox(detection_boxes[det_idx])
            track_id = self._next_track_id
            self._next_track_id += 1
            self._tracks[track_id] = _TrackState(
                track_id=track_id,
                bbox=detection_box,
                score=float(detection_list[det_idx].score),
                last_detected_bbox=detection_box,
                previous_detected_bbox=detection_box,
                last_detected_frame=frame_index,
                previous_detected_frame=frame_index,
                last_updated_frame=frame_index,
                missed_detections=0,
            )

        stale_track_ids = [
            track_id
            for track_id, track in self._tracks.items()
            if track.missed_detections > self.max_missed
        ]
        for track_id in stale_track_ids:
            self._tracks.pop(track_id, None)

        return self._active_faces()

    def predict(self, frame_index: int) -> List[TrackedFace]:
        for track in self._tracks.values():
            dt = frame_index - track.last_updated_frame
            if dt <= 0:
                continue

            px, py, pw, ph = track.previous_detected_bbox
            lx, ly, lw, lh = track.last_detected_bbox
            delta_frames = max(1, track.last_detected_frame - track.previous_detected_frame)

            vx = (lx - px) / float(delta_frames)
            vy = (ly - py) / float(delta_frames)
            vw = (lw - pw) / float(delta_frames)
            vh = (lh - ph) / float(delta_frames)
            damping = 0.85 ** dt

            predicted = (
                track.bbox[0] + (vx * dt * damping),
                track.bbox[1] + (vy * dt * damping),
                track.bbox[2] + (vw * dt * damping),
                track.bbox[3] + (vh * dt * damping),
            )
            track.bbox = _clamp_bbox(predicted)
            track.last_updated_frame = frame_index

        return self._active_faces()
