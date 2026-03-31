import { X } from 'lucide-react';

interface AutoHookNoticeProps {
  onDisable: () => void;
  onClose: () => void;
}

export default function AutoHookNotice({ onDisable, onClose }: AutoHookNoticeProps) {
  return (
    <section className="auto-hook-notice" aria-label="Auto hook notice">
      <div className="auto-hook-notice-copy">
        <p className="auto-hook-title">Auto hook</p>
        <p className="auto-hook-text">
          A text hook has been added to the first 5 seconds of your top 10 ranked videos. If you do not need it,
          you can click &apos;Disable&apos;. If you would like to refine it further, go to &apos;Edit Clip&apos;.
        </p>
      </div>

      <div className="auto-hook-actions">
        <button type="button" className="auto-hook-disable" onClick={onDisable}>
          Disable it
        </button>
        <button type="button" className="auto-hook-close" onClick={onClose} aria-label="Close auto hook notice">
          <X size={14} />
        </button>
      </div>
    </section>
  );
}
