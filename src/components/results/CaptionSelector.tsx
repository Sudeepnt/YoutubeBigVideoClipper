import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CaptionStyleTone } from './types';
import { SubtitleOverlay, SUBTITLE_STYLE_PRESETS, type SubtitleCue } from './SubtitleOverlay';
import './CaptionSelector.css';

interface CaptionSelectorProps {
  value: CaptionStyleTone;
  onChange: (style: CaptionStyleTone) => void;
}

interface CaptionStyleOption {
  id: CaptionStyleTone;
  name: string;
  desc: string;
}

type CaptionStylePreviewProps = {
  styleId: CaptionStyleTone;
  text?: string;
  compact?: boolean;
};

const PREVIEW_TEXT: Record<CaptionStyleTone, string> = {
  classic: 'TO GET STARTED',
  tiktok: 'TO GET STARTED',
  box: 'TO GET STARTED',
  cinematic: 'TO GET STARTED',
  outline: 'TO GET STARTED',
  'bold-center': 'TO GET STARTED',
};

export const CAPTION_STYLE_OPTIONS: CaptionStyleOption[] = SUBTITLE_STYLE_PRESETS;

const PREVIEW_CUE: SubtitleCue = {
  start: 0,
  end: 2.4,
  text: 'TO GET STARTED',
};

export function CaptionStylePreview({ styleId, text, compact = false }: CaptionStylePreviewProps) {
  const resolvedText = text?.trim() || PREVIEW_TEXT[styleId];

  return (
    <div className={`caption-preview-frame ${compact ? 'is-compact' : 'is-full'}`}>
      <div className="caption-preview-stage">
        <div className="caption-preview-video-wash" />
        <SubtitleOverlay
          stylePreset={styleId}
          displayText={resolvedText}
          currentTime={styleId === 'tiktok' ? 1.2 : 0.4}
          currentSubtitle={PREVIEW_CUE}
          compact={compact}
        />
      </div>
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
                <div className="caption-style-meta">
                  <div className="caption-style-name">{option.name}</div>
                  <div className="caption-style-desc">{option.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
