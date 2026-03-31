import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, RectangleHorizontal } from 'lucide-react';
import { AspectRatioOption } from './types';

interface AspectRatioSelectorProps {
  value: AspectRatioOption;
  onChange: (ratio: AspectRatioOption) => void;
  compact?: boolean;
  label?: string;
}

const RATIO_OPTIONS: AspectRatioOption[] = ['9:16', '1:1', '16:9', '4:5'];

export default function AspectRatioSelector({
  value,
  onChange,
  compact = false,
  label = 'Aspect ratio',
}: AspectRatioSelectorProps) {
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

  return (
    <div ref={rootRef} className={`aspect-ratio-selector ${compact ? 'is-compact' : ''}`}>
      <button
        type="button"
        className={`aspect-ratio-trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {compact && <RectangleHorizontal size={13} />}
        {!compact && <span className="aspect-ratio-label">{label}</span>}
        <span>{value}</span>
        <ChevronDown size={13} />
      </button>

      {open && (
        <div className="aspect-ratio-menu" role="menu" aria-label="Aspect ratio options">
          {RATIO_OPTIONS.map((option) => {
            const isActive = option === value;
            return (
              <button
                key={option}
                type="button"
                className={`aspect-ratio-option ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                <span>{option}</span>
                {isActive && <Check size={13} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
