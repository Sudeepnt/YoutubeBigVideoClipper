import { useEffect } from 'react';
import { ArrowDown, ArrowUp, Pencil, X } from 'lucide-react';
import CaptionSelector from './CaptionSelector';
import ClipActionsPanel from './ClipActionsPanel';
import ClipScorePanel from './ClipScorePanel';
import SceneAnalysisPanel from './SceneAnalysisPanel';
import VideoPreviewPlayer from './VideoPreviewPlayer';
import { AspectRatioOption, CaptionStyleTone, ClipDetails } from './types';

interface ClipViewerOverlayProps {
  clip: ClipDetails;
  onClose: () => void;
  onPreviousClip: () => void;
  onNextClip: () => void;
  onAspectRatioChange: (ratio: AspectRatioOption) => void;
  onCaptionStyleChange: (style: CaptionStyleTone) => void;
  onEditClip?: () => void;
}

export default function ClipViewerOverlay({
  clip,
  onClose,
  onPreviousClip,
  onNextClip,
  onAspectRatioChange,
  onCaptionStyleChange,
  onEditClip,
}: ClipViewerOverlayProps) {
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [onClose]);

  return (
    <div className="clip-viewer-backdrop" onClick={onClose}>
      <section
        className={`clip-viewer-overlay ${clip.aspectRatio === '16:9' ? 'clip-viewer-overlay--wide' : ''}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="clip-viewer-header">
          <div className="clip-viewer-title-block">
            <p className="clip-viewer-kicker">Clip Details</p>
            <div className="clip-viewer-title-row">
              <h2 className="clip-viewer-title">
                #{clip.rank} {clip.title}
              </h2>
              <button type="button" className="clip-viewer-edit-title-btn" aria-label="Rename clip title">
                <Pencil size={14} />
              </button>
              <CaptionSelector value={clip.captionStyle} onChange={onCaptionStyleChange} />
            </div>
          </div>

          <div className="clip-viewer-nav-buttons">
            <div className="clip-viewer-nav-btn-wrap">
              <button type="button" className="clip-viewer-nav-btn" onClick={onPreviousClip} aria-label="Previous clip">
                <ArrowUp size={15} />
              </button>
              <span className="clip-viewer-tooltip">Previous clip (↑)</span>
            </div>

            <div className="clip-viewer-nav-btn-wrap">
              <button type="button" className="clip-viewer-nav-btn" onClick={onNextClip} aria-label="Next clip">
                <ArrowDown size={15} />
              </button>
              <span className="clip-viewer-tooltip">Next clip (↓)</span>
            </div>

            <button type="button" className="clip-viewer-nav-btn" onClick={onClose} aria-label="Close viewer">
              <X size={15} />
            </button>
          </div>
        </header>

        <div className="clip-viewer-body-grid">
          <ClipScorePanel score={clip.score} metrics={clip.metrics} />
          <VideoPreviewPlayer clip={clip} />
          <SceneAnalysisPanel clip={clip} />
          <ClipActionsPanel
            aspectRatio={clip.aspectRatio}
            onAspectRatioChange={onAspectRatioChange}
            onEditClip={onEditClip}
          />
        </div>
      </section>
    </div>
  );
}
