import './SubtitleOverlay.css';

export type SubtitleStylePreset =
  | 'classic'
  | 'tiktok'
  | 'box'
  | 'cinematic'
  | 'outline'
  | 'bold-center';

export interface SubtitleCue {
  id?: number;
  start: string | number;
  end: string | number;
  text: string;
}

export const SUBTITLE_STYLE_PRESETS: Array<{
  id: SubtitleStylePreset;
  name: string;
  desc: string;
}> = [
  { id: 'classic', name: 'Classic', desc: 'Standard bottom text' },
  { id: 'tiktok', name: 'TikTok', desc: 'Yellow highlights, word-by-word' },
  { id: 'box', name: 'Modern Box', desc: 'Text with solid background' },
  { id: 'cinematic', name: 'Cinematic', desc: 'Subtle drop shadow' },
  { id: 'outline', name: 'Outline', desc: 'White text, black stroke' },
  { id: 'bold-center', name: 'Bold Center', desc: 'Large centered, glow effect' },
];

type SubtitleOverlayProps = {
  stylePreset: SubtitleStylePreset;
  displayText: string;
  currentTime: number;
  currentSubtitle?: SubtitleCue | null;
  compact?: boolean;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function toSeconds(value: string | number): number {
  if (typeof value === 'number') return value;

  const [h, m, sMs] = value.split(':');
  if (!sMs) return 0;

  const normalized = sMs.replace('.', ',');
  const [s, ms = '0'] = normalized.split(',');

  return (
    Number(h || 0) * 3600 +
    Number(m || 0) * 60 +
    Number(s || 0) +
    Number(ms || 0) / 1000
  );
}

function getHighlightedWordIndex(sub: SubtitleCue, time: number): number {
  const start = toSeconds(sub.start);
  const end = toSeconds(sub.end);
  const duration = end - start;
  if (duration <= 0) return 0;

  const progress = (time - start) / duration;
  const words = sub.text.split(/\s+/).filter(Boolean);

  return Math.max(
    0,
    Math.min(Math.floor(progress * words.length), words.length - 1),
  );
}

export function SubtitleOverlay({
  stylePreset,
  displayText,
  currentTime,
  currentSubtitle,
  compact = false,
}: SubtitleOverlayProps) {
  const text = displayText.trim();
  if (!text) return null;

  const rootClassName = cx(
    'subtitle-overlay',
    `subtitle-overlay--${stylePreset}`,
    compact && 'subtitle-overlay--compact',
  );

  switch (stylePreset) {
    case 'classic':
      return (
        <div className={rootClassName} aria-live="polite">
          <div className="subtitle-overlay__lane subtitle-overlay__lane--bottom">
            <div className="subtitle-overlay__chip subtitle-overlay__chip--classic">
              <span className="subtitle-overlay__text subtitle-overlay__text--classic">{text}</span>
            </div>
          </div>
        </div>
      );

    case 'tiktok': {
      const words = text.split(/\s+/).filter(Boolean);
      const highlightIdx = currentSubtitle
        ? getHighlightedWordIndex(currentSubtitle, currentTime)
        : 0;

      return (
        <div className={rootClassName} aria-live="polite">
          <div className="subtitle-overlay__lane subtitle-overlay__lane--raised">
            <div className="subtitle-overlay__word-track">
              {words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className={cx(
                    'subtitle-overlay__word',
                    'subtitle-overlay__word--tiktok',
                    index === highlightIdx && 'is-active',
                  )}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case 'box':
      return (
        <div className={rootClassName} aria-live="polite">
          <div className="subtitle-overlay__lane subtitle-overlay__lane--bottom">
            <div className="subtitle-overlay__chip subtitle-overlay__chip--box">
              <span className="subtitle-overlay__text subtitle-overlay__text--box">{text}</span>
            </div>
          </div>
        </div>
      );

    case 'cinematic':
      return (
        <div className={rootClassName} aria-live="polite">
          <div className="subtitle-overlay__lane subtitle-overlay__lane--bottom">
            <div className="subtitle-overlay__text-wrap">
              <span className="subtitle-overlay__text subtitle-overlay__text--cinematic">{text}</span>
            </div>
          </div>
        </div>
      );

    case 'outline':
      return (
        <div className={rootClassName} aria-live="polite">
          <div className="subtitle-overlay__lane subtitle-overlay__lane--bottom">
            <div className="subtitle-overlay__text-wrap">
              <span className="subtitle-overlay__text subtitle-overlay__text--outline">{text}</span>
            </div>
          </div>
        </div>
      );

    case 'bold-center':
      return (
        <div className={rootClassName} aria-live="polite">
          <div className="subtitle-overlay__lane subtitle-overlay__lane--center">
            <div className="subtitle-overlay__text-wrap subtitle-overlay__text-wrap--center">
              <span className="subtitle-overlay__text subtitle-overlay__text--bold-center">{text}</span>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
