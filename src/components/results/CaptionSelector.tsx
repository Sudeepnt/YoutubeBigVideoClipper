import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CaptionStyleTone } from './types';
import './CaptionSelector.css';

interface CaptionSelectorProps {
  value: CaptionStyleTone;
  onChange: (style: CaptionStyleTone) => void;
}

export const CAPTION_STYLE_OPTIONS: { id: CaptionStyleTone; name: string; renderPreview: () => React.ReactNode }[] = [
  {
    id: 'no-captions',
    name: 'No captions',
    renderPreview: () => <div className="style-no-captions"></div>,
  },
  {
    id: 'karaoke',
    name: 'Karaoke',
    renderPreview: () => (
      <div className="preview-text style-karaoke">
        <div><span className="t1">TO</span><span className="t2">GET</span></div>
        <div className="t3">STARTED</div>
      </div>
    ),
  },
  {
    id: 'beasty',
    name: 'Beasty',
    renderPreview: () => <div className="preview-text style-beasty">TO GET</div>,
  },
  {
    id: 'deep-diver',
    name: 'Deep Diver',
    renderPreview: () => (
      <div className="preview-text style-deep-diver">
        <div><span className="t1">To</span>get started</div>
      </div>
    ),
  },
  {
    id: 'youshaei',
    name: 'Youshaei',
    renderPreview: () => (
      <div className="preview-text style-youshaei">
        <div><span className="t1">TO</span>GFT STARTFD</div>
      </div>
    ),
  },
  {
    id: 'pod-p',
    name: 'Pod P',
    renderPreview: () => <div className="preview-text style-pod-p">TO GET</div>,
  },
  {
    id: 'mozi',
    name: 'Mozi',
    renderPreview: () => (
      <div className="preview-text style-mozi">
        <div className="t1">TO GET</div>
        <div className="t2">STARTED</div>
      </div>
    ),
  },
  {
    id: 'popline',
    name: 'Popline',
    renderPreview: () => (
      <div className="preview-text style-popline">
        <div className="t1">TO GET</div>
        <div className="t2">STARTED</div>
      </div>
    ),
  },
  {
    id: 'simple',
    name: 'Simple',
    renderPreview: () => (
      <div className="preview-text style-simple">
        <div>TO GET</div>
      </div>
    ),
  },
  {
    id: 'think-media',
    name: 'Think Media',
    renderPreview: () => (
      <div className="preview-text style-think-media">
        <div className="t1">TO GET</div>
        <div className="t2">STARTED</div>
      </div>
    ),
  },
  {
    id: 'glitch-infinite',
    name: 'Glitch Infinite',
    renderPreview: () => (
      <div className="preview-text style-glitch-infinite">
        <div><span className="t1">To</span><span className="t2">get</span></div>
        <div className="t2">started</div>
      </div>
    ),
  },
  {
    id: 'seamless-bounce',
    name: 'Seamless Bounce',
    renderPreview: () => (
      <div className="preview-text style-seamless-bounce">
        <div><span className="t1">To</span><span className="t2">get</span></div>
        <div className="t3">started</div>
      </div>
    ),
  },
  {
    id: 'baby-earthquake',
    name: 'Baby Earthquake',
    renderPreview: () => (
      <div className="preview-text style-baby-earthquake">
        <div><span className="t1">to</span><span className="t2">get</span></div>
        <div className="t3">started</div>
      </div>
    ),
  },
  {
    id: 'blur-switch',
    name: 'Blur Switch',
    renderPreview: () => (
      <div className="preview-text style-blur-switch">
        <div><span className="t1">TO</span><span className="t2">GET STARTED</span></div>
      </div>
    ),
  },
];

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

  const activeOption = CAPTION_STYLE_OPTIONS.find((o) => o.id === value) || CAPTION_STYLE_OPTIONS[0];

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
                  {option.renderPreview()}
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
