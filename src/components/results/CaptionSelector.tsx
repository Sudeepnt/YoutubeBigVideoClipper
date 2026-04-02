import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CaptionStyleTone } from './types';
import './CaptionSelector.css';

interface CaptionSelectorProps {
  value: CaptionStyleTone;
  onChange: (style: CaptionStyleTone) => void;
}

interface CaptionStyleOption {
  id: CaptionStyleTone;
  name: string;
}

type CaptionWordData = {
  text: string;
  index: number;
  isAccent: boolean;
};

type CaptionStylePreviewProps = {
  styleId: CaptionStyleTone;
  text?: string;
  compact?: boolean;
};

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'get', 'got',
  'has', 'have', 'he', 'her', 'his', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'me',
  'my', 'of', 'on', 'or', 'our', 'she', 'so', 'that', 'the', 'their', 'them', 'there',
  'they', 'this', 'to', 'up', 'was', 'we', 'were', 'what', 'when', 'who', 'with', 'you',
  'your',
]);

const PREVIEW_TEXT: Record<CaptionStyleTone, string> = {
  'no-captions': '',
  karaoke: 'TO GET STARTED',
  beasty: 'TO GET STARTED',
  'deep-diver': 'TO GET STARTED',
  youshaei: 'TO GET STARTED',
  'pod-p': 'TO GET STARTED',
  mozi: 'TO GET STARTED',
  popline: 'TO GET STARTED',
  simple: 'TO GET STARTED',
  'think-media': 'TO GET STARTED',
  'glitch-infinite': 'TO GET STARTED',
  'seamless-bounce': 'TO GET STARTED',
  'baby-earthquake': 'TO GET STARTED',
  'blur-switch': 'TO GET STARTED',
};

export const CAPTION_STYLE_OPTIONS: CaptionStyleOption[] = [
  { id: 'no-captions', name: 'No captions' },
  { id: 'karaoke', name: 'Karaoke' },
  { id: 'beasty', name: 'Beasty' },
  { id: 'deep-diver', name: 'Deep Diver' },
  { id: 'youshaei', name: 'Youshaei' },
  { id: 'pod-p', name: 'Pod P' },
  { id: 'mozi', name: 'Mozi' },
  { id: 'popline', name: 'Popline' },
  { id: 'simple', name: 'Simple' },
  { id: 'think-media', name: 'Think Media' },
  { id: 'glitch-infinite', name: 'Glitch Infinite' },
  { id: 'seamless-bounce', name: 'Seamless Bounce' },
  { id: 'baby-earthquake', name: 'Baby Earthquake' },
  { id: 'blur-switch', name: 'Blur Switch' },
];

function normalizeWord(value: string) {
  return value.toLowerCase().replace(/[^\w]/g, '');
}

function pickAccentIndex(words: string[]) {
  if (!words.length) return -1;

  let bestIndex = 0;
  let bestScore = -1;

  words.forEach((word, index) => {
    const normalized = normalizeWord(word);
    const score = normalized.length - (STOPWORDS.has(normalized) ? 4 : 0);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function splitLines(words: string[], styleId: CaptionStyleTone) {
  if (styleId !== 'karaoke') {
    return words.length ? [words] : [];
  }

  if (words.length <= 2) {
    return words.length ? [words] : [];
  }

  const splitIndex = Math.ceil(words.length / 2);
  return [words.slice(0, splitIndex), words.slice(splitIndex)].filter((line) => line.length > 0);
}

function buildCaptionLines(styleId: CaptionStyleTone, text: string) {
  const words = text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
  const accentIndex = pickAccentIndex(words);
  const lines = splitLines(words, styleId);

  let globalIndex = 0;
  return lines.map((line) =>
    line.map((word) => {
      const payload: CaptionWordData = {
        text: word,
        index: globalIndex,
        isAccent: globalIndex === accentIndex,
      };
      globalIndex += 1;
      return payload;
    })
  );
}

function getCaptionClassName(styleId: CaptionStyleTone) {
  return `caption-preview tone-${styleId.replace(/[^a-z0-9]+/gi, '-')}`;
}

export function CaptionStylePreview({ styleId, text, compact = false }: CaptionStylePreviewProps) {
  if (styleId === 'no-captions') {
    return <div className="style-no-captions" />;
  }

  const resolvedText = text?.trim() || PREVIEW_TEXT[styleId] || 'TO GET STARTED';
  const lines = buildCaptionLines(styleId, resolvedText);

  return (
    <div className={`${getCaptionClassName(styleId)} ${compact ? 'compact' : 'full'}`}>
      {lines.map((line, lineIndex) => (
        <div key={`${styleId}-line-${lineIndex}`} className="caption-preview-line">
          {line.map((word) => (
            <span
              key={`${styleId}-${word.index}-${word.text}`}
              className={[
                'caption-preview-word',
                word.isAccent ? 'is-accent' : '',
                styleId === 'pod-p' && word.isAccent ? 'is-underlined' : '',
              ].filter(Boolean).join(' ')}
            >
              {word.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function CaptionSelector({ value, onChange }: CaptionSelectorProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activeOption = useMemo(
    () => CAPTION_STYLE_OPTIONS.find((option) => option.id === value) || CAPTION_STYLE_OPTIONS[0],
    [value]
  );

  return (
    <div ref={rootRef} className="caption-selector relative">
      <button
        type="button"
        className={`caption-selector-trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{activeOption.name}</span>
        <ChevronDown size={13} />
      </button>

      {open && (
        <div className="caption-grid-menu" role="menu" aria-label="Caption style presets">
          {CAPTION_STYLE_OPTIONS.map((option) => {
            const isActive = option.id === value;
            return (
              <div
                key={option.id}
                className={`caption-style-item ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                role="menuitem"
              >
                <div className="caption-style-preview">
                  <CaptionStylePreview styleId={option.id} compact />
                </div>
                <div className="caption-style-name">{option.name}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
