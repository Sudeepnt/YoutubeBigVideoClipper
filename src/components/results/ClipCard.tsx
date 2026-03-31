import { useEffect, useRef } from 'react';
import {
  CalendarDays,
  BriefcaseBusiness,
  Scissors,
  Heart,
  MessageCircle,
  Play,
} from 'lucide-react';
import { ClipItem } from './types';

interface ClipCardProps {
  clip: ClipItem;
  isPreviewing: boolean;
  onPreview: (id: string) => void;
  onOpenClip: (id: string) => void;
}

export default function ClipCard({ clip, isPreviewing, onPreview, onOpenClip }: ClipCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPreviewing) {
      void videoRef.current.play().catch(() => undefined);
      return;
    }

    videoRef.current.pause();
  }, [isPreviewing]);

  return (
    <article
      className={`results-clip-card ${clip.isSelected ? 'is-selected' : ''}`}
      onClick={() => onOpenClip(clip.id)}
      aria-label={clip.title}
    >
      <div className="results-clip-thumb-wrap">
        <div className="results-clip-thumb">
          {clip.videoUrl ? (
            <video
              ref={videoRef}
              src={clip.videoUrl}
              poster={clip.thumbnailUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className="results-clip-media"
            />
          ) : (
            <img src={clip.thumbnailUrl} alt={clip.title} className="results-clip-media" loading="lazy" />
          )}
          <div className="results-clip-overlay" />

          {clip.isPlayable && (
            <button
              type="button"
              className={`results-clip-preview-btn ${isPreviewing ? 'is-previewing' : ''}`}
              onClick={(event) => {
                event.stopPropagation();
                onPreview(clip.id);
              }}
              aria-label="Preview clip"
            >
              <Play size={16} fill="currentColor" />
            </button>
          )}

          <span className="results-clip-duration">{clip.duration}</span>
        </div>

        {(clip.showFavoriteAction || clip.showCommentAction) && (
          <div className="results-clip-floating-actions">
            {clip.showFavoriteAction && (
              <button
                type="button"
                className="results-clip-floating-btn"
                aria-label="Favorite clip"
                title="Favorite clip"
                onClick={(event) => event.stopPropagation()}
              >
                <Heart size={13} />
              </button>
            )}
            {clip.showCommentAction && (
              <button
                type="button"
                className="results-clip-floating-btn"
                aria-label="Comment clip"
                title="Comment clip"
                onClick={(event) => event.stopPropagation()}
              >
                <MessageCircle size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="results-clip-body">
        <div className="results-clip-score">{clip.score}</div>
        <div className="results-clip-meta-icons" aria-hidden="true">
          <CalendarDays size={12} />
          <BriefcaseBusiness size={12} />
          <Scissors size={12} />
        </div>
        <h3 className="results-clip-title" title={clip.title}>
          {clip.title}
        </h3>
      </div>
    </article>
  );
}
