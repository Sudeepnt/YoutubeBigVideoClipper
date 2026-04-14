import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type MouseEvent } from 'react';
import {
  CalendarDays,
  BriefcaseBusiness,
  Scissors,
  Download,
  ArrowUpToLine,
  Heart,
  MessageCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { ClipActionType } from './ClipActionModal';
import { ClipItem } from './types';

interface ClipCardProps {
  clip: ClipItem;
  isPreviewing: boolean;
  onPreview: (id: string) => void;
  onOpenClip: (id: string) => void;
  onAction: (action: ClipActionType, clip: ClipItem) => void;
}

export default function ClipCard({ clip, isPreviewing, onPreview, onOpenClip, onAction }: ClipCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const scoreToneClass =
    clip.score >= 90 ? 'is-emerald' : clip.score >= 80 ? 'is-mint' : clip.score >= 70 ? 'is-amber' : 'is-orange';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = volume <= 0;
  }, [volume, clip.id, clip.videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    setCurrentTime(0);
    setDuration(0);
    setHasVideoError(false);
    setIsPlaying(false);
    setShouldLoadVideo(false);
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.load();
  }, [clip.id, clip.videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!isPreviewing) {
      if (video) {
        video.pause();
      }
      setIsPlaying(false);
      setShouldLoadVideo(false);
      return;
    }

    setShouldLoadVideo(true);
  }, [isPreviewing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPreviewing || !shouldLoadVideo || hasVideoError) return;

    const tryPlay = async () => {
      try {
        video.muted = volume <= 0;
        video.volume = volume;
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Grid preview autoplay failed', error);
        if (video.error) {
          setHasVideoError(true);
        }
      }
    };

    void tryPlay();
  }, [hasVideoError, isPreviewing, shouldLoadVideo, volume]);

  const activeSubtitleText = buildActiveTranscriptCaption(clip.transcriptWords ?? [], currentTime * 1000);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    setCurrentTime(video.currentTime || 0);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime || 0);
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextTime = Number(event.target.value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleToggleMute = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setVolume((current) => (current <= 0 ? 0.9 : 0));
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
  };

  const handleVolumeInput = (event: FormEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const nextVolume = Number(event.currentTarget.value);
    setVolume(nextVolume);
  };

  const handlePauseCurrentPreview = () => {
    const video = videoRef.current;
    video?.pause();
    setIsPlaying(false);
  };

  const handlePlayCurrentPreview = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = volume <= 0;
      video.volume = volume;
      await video.play();
      setHasVideoError(false);
      setIsPlaying(true);
    } catch (error) {
      console.error('Grid preview play failed', error);
      if (video.error) {
        setHasVideoError(true);
      }
    }
  };

  const handlePreviewToggle = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!clip.isPlayable || hasVideoError) {
      onPreview(clip.id);
      return;
    }

    if (isPreviewing) {
      if (isPlaying) {
        handlePauseCurrentPreview();
        return;
      }

      await handlePlayCurrentPreview();
      return;
    }

    setShouldLoadVideo(true);
    onPreview(clip.id);
  };

  const handleMediaToggle = async (event: MouseEvent<HTMLVideoElement>) => {
    event.stopPropagation();
    if (!isPreviewing) return;

    if (isPlaying) {
      handlePauseCurrentPreview();
      return;
    }

    await handlePlayCurrentPreview();
  };

  return (
    <article
      className={`results-clip-card ${clip.isSelected ? 'is-selected' : ''}`}
      onClick={() => onOpenClip(clip.id)}
      aria-label={clip.title}
    >
      <div className="results-clip-thumb-wrap">
        <div className="results-clip-thumb" data-ratio={clip.aspectRatio ?? '9:16'}>
          <img
            src={clip.thumbnailUrl}
            alt={clip.title}
            className={`results-clip-media ${isPreviewing && shouldLoadVideo && !hasVideoError ? 'is-hidden' : ''}`}
            loading="lazy"
          />
          {clip.videoUrl && shouldLoadVideo && !hasVideoError ? (
            <video
              ref={videoRef}
              src={shouldLoadVideo ? clip.videoUrl : undefined}
              poster={clip.thumbnailUrl}
              playsInline
              preload="metadata"
              className="results-clip-media results-clip-media--video"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onCanPlay={() => setHasVideoError(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={() => {
                setHasVideoError(true);
                setShouldLoadVideo(false);
              }}
              onClick={handleMediaToggle}
            />
          ) : null}

          {activeSubtitleText && (
            <div className="results-clip-subtitle" aria-live="polite">
              <span>{activeSubtitleText}</span>
            </div>
          )}
          <div className="results-clip-overlay" />

          <div className="results-clip-viral-pill">
            <span className={`results-clip-viral-score ${scoreToneClass}`}>{clip.score}</span>
          </div>

          {clip.isPlayable && (
            <button
              type="button"
              className={`results-clip-preview-btn ${isPreviewing ? 'is-previewing' : ''}`}
              onClick={handlePreviewToggle}
              aria-label={isPlaying ? 'Pause clip preview' : 'Play clip preview'}
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>
          )}

          <span className="results-clip-duration">{clip.duration}</span>

          <div className="results-clip-thumb-meta">
            {clip.categoryLabel && (
              <span className="results-clip-thumb-chip results-clip-thumb-chip--category">
                <BriefcaseBusiness size={11} />
                {clip.categoryLabel}
              </span>
            )}
          </div>

          {clip.isPlayable && isPreviewing && (
            <div className="results-clip-player-controls" onClick={(event) => event.stopPropagation()}>
              <div className="results-clip-player-timeline">
                <input
                  type="range"
                  min={0}
                  max={Math.max(duration, 0.1)}
                  step={0.1}
                  value={Math.min(currentTime, duration || 0)}
                  onChange={handleSeek}
                  aria-label="Seek clip preview"
                />
                <span
                  className="results-clip-player-fill"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              <div className="results-clip-player-footer">
                <span className="results-clip-player-time">
                  {formatClock(currentTime)} / {formatClock(duration || parseClock(clip.duration))}
                </span>
                <div className="results-clip-audio-controls">
                  <button
                    type="button"
                    className="results-clip-audio-btn"
                    aria-label={volume <= 0 ? 'Unmute clip preview' : 'Mute clip preview'}
                    onClick={handleToggleMute}
                  >
                    {volume <= 0 ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  </button>
                  <div className="results-clip-volume">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={handleVolumeChange}
                      onInput={handleVolumeInput}
                      aria-label="Adjust clip preview volume"
                    />
                    <span
                      className="results-clip-volume-fill"
                      style={{ width: `${volume * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
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
        <h3 className="results-clip-title" title={clip.title}>
          {clip.title}
        </h3>
        <div className="results-clip-footer-panel">
          <div className="results-clip-actions-row">
            <button
              type="button"
              className="results-clip-action-icon is-calendar"
              title={clip.scheduledLabel ? `Scheduled for ${clip.scheduledLabel}` : 'Schedule upload'}
              onClick={(event) => {
                event.stopPropagation();
                onAction('schedule', clip);
              }}
            >
              <CalendarDays size={12} />
            </button>
            <div className="results-clip-quick-actions">
              <button
                type="button"
                className="results-clip-action-icon"
                title="Download clip"
                onClick={(event) => {
                  event.stopPropagation();
                  onAction('download', clip);
                }}
              >
                <Download size={12} />
              </button>
              <button
                type="button"
                className="results-clip-action-icon"
                title={clip.editLabel ?? 'Edit clip'}
                onClick={(event) => {
                  event.stopPropagation();
                  onAction('edit', clip);
                }}
              >
                <Scissors size={12} />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="results-clip-upload-btn"
            title="Upload clip now"
            onClick={(event) => {
              event.stopPropagation();
              onAction('upload', clip);
            }}
          >
            <ArrowUpToLine size={12} />
            <span>Upload now</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function buildActiveTranscriptCaption(words: ClipItem['transcriptWords'], currentTimeMs: number): string {
  if (!words?.length) {
    return '';
  }

  const activeIndex = words.findIndex((word) => currentTimeMs >= word.start && currentTimeMs <= word.end);
  if (activeIndex < 0) {
    return '';
  }

  const startIndex = Math.max(0, activeIndex - 1);
  const endIndex = Math.min(words.length, activeIndex + 4);

  return words
    .slice(startIndex, endIndex)
    .map((word) => word.word)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatClock(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function parseClock(clock: string): number {
  const parts = clock.split(':').map((value) => Number(value));
  const [hours = 0, minutes = 0, seconds = 0] = parts.length === 3 ? parts : [0, parts[0] ?? 0, parts[1] ?? 0];
  return (hours * 60 + minutes) * 60 + seconds;
}
