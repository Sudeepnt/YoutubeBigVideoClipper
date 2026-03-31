import { Play } from 'lucide-react';
import AspectRatioSelector from './AspectRatioSelector';
import { CAPTION_STYLE_OPTIONS } from './CaptionSelector';
import { AspectRatioOption, ClipDetails } from './types';

interface VideoPreviewPlayerProps {
  clip: ClipDetails;
  captionText?: string;
  onAspectRatioChange: (ratio: AspectRatioOption) => void;
}

export default function VideoPreviewPlayer({ clip, onAspectRatioChange }: VideoPreviewPlayerProps) {
  const activeCaptionOption = CAPTION_STYLE_OPTIONS.find((o) => o.id === clip.captionStyle) || CAPTION_STYLE_OPTIONS[0];

  return (
    <section className="viewer-player-column" aria-label="Video preview">
      <div className="viewer-player-header">
        <AspectRatioSelector value={clip.aspectRatio} onChange={onAspectRatioChange} />
      </div>

      <div className="viewer-video-shell" data-ratio={clip.aspectRatio}>
        <div className="viewer-video-frame">
          {clip.videoUrl ? (
            <video
              src={clip.videoUrl}
              poster={clip.thumbnailUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className="viewer-video-media"
            />
          ) : (
            <img src={clip.thumbnailUrl} alt={clip.title} className="viewer-video-media" loading="lazy" />
          )}

          <div className="viewer-video-caption" style={{ transform: 'scale(1.5) translateX(-50%)', transformOrigin: 'bottom center', pointerEvents: 'none', position: 'absolute', bottom: '15%', left: '50%', width:'100%', display: 'flex', justifyContent: 'center' }}>
            {activeCaptionOption.renderPreview()}
          </div>

          <div className="viewer-video-top-overlay">
            <span>LOW-RES PREVIEW</span>
            <span>00:10 / {clip.duration}</span>
          </div>

          <button type="button" className="viewer-video-play-btn" aria-label="Play preview">
            <Play size={18} fill="currentColor" />
          </button>
        </div>
      </div>

      <div className="viewer-hook-duration">~10 sec</div>
    </section>
  );
}
