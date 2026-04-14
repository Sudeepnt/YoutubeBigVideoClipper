import json
import sys
import textwrap
from pathlib import Path

import cv2
import numpy as np


def build_cues(words):
    chunks = []
    current = []
    for word in words:
        prev = current[-1] if current else None
        gap = (word["start"] - prev["end"]) > 900 if prev else False
        if (gap or len(current) >= 7) and current:
            chunks.append(current)
            current = []
        current.append(word)
    if current:
        chunks.append(current)
    return [
        {
            "start": chunk[0]["start"],
            "end": chunk[-1]["end"],
            "text": " ".join(item["word"] for item in chunk).strip(),
        }
        for chunk in chunks
    ]


def open_writer(output_path: Path, fps: float, width: int, height: int):
    for codec in ("avc1", "mp4v"):
        writer = cv2.VideoWriter(
            str(output_path),
            cv2.VideoWriter_fourcc(*codec),
            fps,
            (width, height),
        )
        if writer.isOpened():
            return writer
    return None


def build_text_overlay(text: str, width: int, height: int):
    overlay = np.zeros((height, width, 4), dtype=np.uint8)
    wrapped = textwrap.wrap(text, width=22) or [text]

    font = cv2.FONT_HERSHEY_DUPLEX
    font_scale = max(0.78, min(width, height) / 950.0)
    text_thickness = 2
    outline_thickness = 6
    line_gap = max(12, int(font_scale * 18))

    sizes = [cv2.getTextSize(line, font, font_scale, text_thickness)[0] for line in wrapped]
    max_w = max((size[0] for size in sizes), default=0)
    line_h = max((size[1] for size in sizes), default=0)
    total_h = (line_h * len(wrapped)) + (line_gap * max(0, len(wrapped) - 1))
    pad_x = max(22, int(font_scale * 22))
    pad_y = max(14, int(font_scale * 14))
    x = int((width - max_w) / 2)
    y = int(height - total_h - max(64, int(height * 0.07)))

    cv2.rectangle(
        overlay,
        (x - pad_x, y - pad_y),
        (x + max_w + pad_x, y + total_h + pad_y),
        (0, 0, 0, 156),
        thickness=-1,
    )

    baseline_y = y + line_h
    for index, line in enumerate(wrapped):
        line_width = sizes[index][0]
        line_x = int((width - line_width) / 2)
        line_y = baseline_y + index * (line_h + line_gap)
        cv2.putText(
            overlay,
            line,
            (line_x, line_y),
            font,
            font_scale,
            (0, 0, 0, 255),
            outline_thickness,
            cv2.LINE_AA,
        )
        cv2.putText(
            overlay,
            line,
            (line_x, line_y),
            font,
            font_scale,
            (255, 255, 255, 255),
            text_thickness,
            cv2.LINE_AA,
        )

    return overlay


def blend_overlay(frame, overlay):
    alpha = overlay[:, :, 3:4].astype(np.float32) / 255.0
    if not np.any(alpha):
        return frame
    rgb = overlay[:, :, :3].astype(np.float32)
    base = frame.astype(np.float32)
    blended = (base * (1.0 - alpha)) + (rgb * alpha)
    return blended.astype(np.uint8)


def main() -> int:
    if len(sys.argv) < 4:
        print(
            json.dumps(
                {"error": "Usage: burn_subtitles.py <video_path> <transcript_json_path> <output_path>"}
            ),
            file=sys.stderr,
        )
        return 1

    input_path = Path(sys.argv[1])
    transcript_path = Path(sys.argv[2])
    output_path = Path(sys.argv[3])

    if not input_path.is_file():
        print(json.dumps({"error": f"Input video not found: {input_path}"}), file=sys.stderr)
        return 1
    if not transcript_path.is_file():
        print(json.dumps({"error": f"Transcript json not found: {transcript_path}"}), file=sys.stderr)
        return 1

    payload = json.loads(transcript_path.read_text(encoding="utf-8"))
    words = payload.get("words", [])
    cues = build_cues(words)

    cap = cv2.VideoCapture(str(input_path))
    if not cap.isOpened():
        print(json.dumps({"error": "Could not open input video."}), file=sys.stderr)
        return 1

    source_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    fps = min(source_fps, 24.0)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    max_output_frames = int((frame_count / source_fps) * fps) if source_fps > 0 else frame_count

    writer = open_writer(output_path, fps, width, height)
    if writer is None or not writer.isOpened():
        cap.release()
        print(json.dumps({"error": "Could not open output video writer."}), file=sys.stderr)
        return 1

    cue_index = 0
    source_index = 0
    output_index = 0
    cached_overlay = None
    cached_text = None

    while source_index < frame_count and output_index < max_output_frames:
        ok, frame = cap.read()
        if not ok:
            break

        source_ms = int((source_index / source_fps) * 1000)
        target_ms = int((output_index / fps) * 1000)
        if source_ms + int(1000 / max(source_fps, 1.0)) < target_ms:
            source_index += 1
            continue

        current_ms = target_ms
        while cue_index + 1 < len(cues) and cues[cue_index + 1]["start"] <= current_ms:
            cue_index += 1

        active_text = ""
        if cues:
            cue = cues[cue_index]
            if cue["start"] <= current_ms <= cue["end"]:
                active_text = cue["text"]

        if active_text:
            if cached_text != active_text or cached_overlay is None:
                cached_text = active_text
                cached_overlay = build_text_overlay(active_text, width, height)
            frame = blend_overlay(frame, cached_overlay)
        else:
            cached_text = None
            cached_overlay = None

        writer.write(frame)
        source_index += 1
        output_index += 1

    cap.release()
    writer.release()
    json.dump({"status": "ok", "outputPath": str(output_path)}, sys.stdout)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
