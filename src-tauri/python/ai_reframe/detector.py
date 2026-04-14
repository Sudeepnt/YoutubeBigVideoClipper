from __future__ import annotations

from dataclasses import dataclass
from typing import List

import cv2


@dataclass
class FaceBox:
    x: float
    y: float
    w: float
    h: float
    score: float

    @property
    def area(self) -> float:
        return max(0.0, self.w) * max(0.0, self.h)


class FaceDetector:
    def __init__(
        self,
        detection_width: int = 512,
        min_confidence: float = 0.35,
        model_selection: int = 1,
    ):
        self.detection_width = max(160, int(detection_width))
        self.min_confidence = float(min_confidence)

        try:
            import mediapipe as mp
        except Exception as exc:  # pragma: no cover - runtime dependency
            raise RuntimeError(
                "MediaPipe is not installed. Install with `python3 -m pip install mediapipe`."
            ) from exc

        self._mp = mp
        self._detector = mp.solutions.face_detection.FaceDetection(
            model_selection=int(model_selection),
            min_detection_confidence=self.min_confidence,
        )

    def close(self) -> None:
        if self._detector:
            self._detector.close()

    def detect(self, frame_bgr) -> List[FaceBox]:
        frame_h, frame_w = frame_bgr.shape[:2]
        resize_scale = 1.0

        if frame_w > self.detection_width:
            resize_scale = self.detection_width / float(frame_w)
            resized_w = self.detection_width
            resized_h = max(1, int(round(frame_h * resize_scale)))
            detect_frame = cv2.resize(frame_bgr, (resized_w, resized_h), interpolation=cv2.INTER_AREA)
        else:
            detect_frame = frame_bgr

        detect_rgb = cv2.cvtColor(detect_frame, cv2.COLOR_BGR2RGB)
        results = self._detector.process(detect_rgb)
        if not results or not results.detections:
            return []

        detect_h, detect_w = detect_frame.shape[:2]
        scale_back = 1.0 / resize_scale
        out: List[FaceBox] = []

        for detection in results.detections:
            rel_box = detection.location_data.relative_bounding_box
            score = float(detection.score[0]) if detection.score else 0.0

            raw_x = rel_box.xmin * detect_w
            raw_y = rel_box.ymin * detect_h
            raw_w = rel_box.width * detect_w
            raw_h = rel_box.height * detect_h

            x = max(0.0, raw_x) * scale_back
            y = max(0.0, raw_y) * scale_back
            w = max(0.0, raw_w) * scale_back
            h = max(0.0, raw_h) * scale_back

            if w <= 1.0 or h <= 1.0:
                continue

            if x + w > frame_w:
                w = max(1.0, frame_w - x)
            if y + h > frame_h:
                h = max(1.0, frame_h - y)

            out.append(FaceBox(x=x, y=y, w=w, h=h, score=score))

        return out
