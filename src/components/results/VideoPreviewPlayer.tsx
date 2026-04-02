import { Play } from 'lucide-react';
import AspectRatioSelector from './AspectRatioSelector';
import { CaptionStylePreview } from './CaptionSelector';
import { AspectRatioOption, ClipDetails } from './types';

interface VideoPreviewPlayerProps {
  clip: ClipDetails;
  captionText?: string;
  onAspectRatioChange: (ratio: AspectRatioOption) => void;
}

export default function VideoPreviewPlayer({ clip, captionText, onAspectRatioChange }: VideoPreviewPlayerProps) {
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

          {clip.captionStyle !== 'no-captions' && (
            <div className="viewer-video-caption">
              <CaptionStylePreview
                styleId={clip.captionStyle}
                text={captionText || clip.title}
              />
            </div>
          )}

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
