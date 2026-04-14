import json
import os
import sys


def main() -> int:
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: transcribe.py <audio_path> [model_size]"}), file=sys.stderr)
        return 1

    audio_path = sys.argv[1]
    model_size = sys.argv[2] if len(sys.argv) > 2 else "medium"

    try:
        from faster_whisper import WhisperModel
    except Exception as exc:
        print(
            json.dumps(
                {
                    "error": (
                        "faster-whisper is not installed for the Python runtime used by ClipForge. "
                        "Install it with `python3 -m pip install faster-whisper`."
                    ),
                    "detail": str(exc),
                }
            ),
            file=sys.stderr,
        )
        return 1

    device = os.environ.get("CLIPFORGE_WHISPER_DEVICE", "cpu")
    compute_type = os.environ.get("CLIPFORGE_WHISPER_COMPUTE_TYPE", "int8")
    cpu_threads = int(os.environ.get("CLIPFORGE_WHISPER_CPU_THREADS", str(os.cpu_count() or 4)))
    num_workers = int(os.environ.get("CLIPFORGE_WHISPER_NUM_WORKERS", "1"))

    model = WhisperModel(
        model_size,
        device=device,
        compute_type=compute_type,
        cpu_threads=cpu_threads,
        num_workers=num_workers,
    )
    segments, info = model.transcribe(
        audio_path,
        beam_size=1,
        best_of=1,
        vad_filter=True,
        word_timestamps=True,
        condition_on_previous_text=False,
    )

    words = []
    for segment in segments:
        for word in getattr(segment, "words", []) or []:
            text = (getattr(word, "word", "") or "").strip()
            start = getattr(word, "start", None)
            end = getattr(word, "end", None)
            probability = getattr(word, "probability", 0.0)

            if not text or start is None or end is None:
                continue

            words.append(
                {
                    "word": text,
                    "start": int(round(float(start) * 1000)),
                    "end": int(round(float(end) * 1000)),
                    "confidence": float(probability or 0.0),
                }
            )

    payload = {
        "modelSize": model_size,
        "language": getattr(info, "language", None),
        "wordCount": len(words),
        "words": words,
    }
    json.dump(payload, sys.stdout)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
