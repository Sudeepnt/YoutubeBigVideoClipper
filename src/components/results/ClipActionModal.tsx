import { useEffect, useState } from 'react';
import { ArrowUpToLine, CalendarDays, Clock3, Download, Scissors, X } from 'lucide-react';
import { ClipItem } from './types';

export type ClipActionType = 'schedule' | 'download' | 'edit' | 'upload';

interface ClipActionModalProps {
  clip: ClipItem;
  action: ClipActionType;
  onClose: () => void;
}

export default function ClipActionModal({ clip, action, onClose }: ClipActionModalProps) {
  const [dateValue, setDateValue] = useState(() => new Date().toISOString().slice(0, 10));
  const [timeValue, setTimeValue] = useState('18:00');

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [onClose]);

  const config = getActionConfig(action);
  const Icon = config.icon;

  return (
    <div className="clip-action-modal-backdrop" onClick={onClose}>
      <section className="clip-action-modal" onClick={(event) => event.stopPropagation()}>
        <header className="clip-action-modal-header">
          <div className="clip-action-modal-copy">
            <div className="clip-action-modal-eyebrow">
              <Icon size={12} />
              <span>{config.kicker}</span>
            </div>
            <h3>{config.title}</h3>
            <p>{config.description}</p>
          </div>

          <button type="button" className="clip-action-modal-close" onClick={onClose} aria-label="Close action form">
            <X size={15} />
          </button>
        </header>

        <div className="clip-action-modal-clip">
          <img src={clip.thumbnailUrl} alt={clip.title} />
          <div className="clip-action-modal-clip-copy">
            <strong>{clip.title}</strong>
            <span>{clip.duration}</span>
          </div>
        </div>

        <div className="clip-action-modal-body">
          {action === 'schedule' && (
            <>
              <div className="clip-action-note">
                Keep ClipForge open. Scheduled publishing will only complete while this app stays open.
              </div>
              <label className="clip-action-field">
                <span>Choose date</span>
                <div className="clip-action-input-wrap">
                  <CalendarDays size={14} />
                  <input type="date" value={dateValue} onChange={(event) => setDateValue(event.target.value)} />
                </div>
              </label>
              <label className="clip-action-field">
                <span>Choose time</span>
                <div className="clip-action-input-wrap">
                  <Clock3 size={14} />
                  <input type="time" value={timeValue} onChange={(event) => setTimeValue(event.target.value)} />
                </div>
              </label>
            </>
          )}

          {action === 'download' && (
            <div className="clip-action-note">
              Export options will be added next. For now this opens the download flow from one place.
            </div>
          )}

          {action === 'edit' && (
            <div className="clip-action-note">
              Quick edit flow will open here next so users can trim and refine without hunting through the app.
            </div>
          )}

          {action === 'upload' && (
            <div className="clip-action-note">
              Upload flow will open here next with platform selection, caption, and final confirmation.
            </div>
          )}
        </div>

        <footer className="clip-action-modal-footer">
          <button type="button" className="clip-action-secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="clip-action-primary-btn" onClick={onClose}>
            {config.cta}
          </button>
        </footer>
      </section>
    </div>
  );
}

function getActionConfig(action: ClipActionType) {
  switch (action) {
    case 'schedule':
      return {
        icon: CalendarDays,
        kicker: 'Schedule Clip',
        title: 'Choose when this clip should go live',
        description: 'Pick the publish date first, then the exact time.',
        cta: 'Save schedule',
      };
    case 'download':
      return {
        icon: Download,
        kicker: 'Download Clip',
        title: 'Prepare this clip for download',
        description: 'We can keep this quick and focused in a centered action flow.',
        cta: 'Continue',
      };
    case 'edit':
      return {
        icon: Scissors,
        kicker: 'Edit Clip',
        title: 'Open a faster edit flow',
        description: 'This keeps editing decisions close to the card instead of sending users hunting.',
        cta: 'Continue',
      };
    case 'upload':
    default:
      return {
        icon: ArrowUpToLine,
        kicker: 'Upload Clip',
        title: 'Send this clip live',
        description: 'A focused upload form keeps the results page feeling fast and calm.',
        cta: 'Continue',
      };
  }
}
