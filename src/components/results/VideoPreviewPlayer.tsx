import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Maximize2, Minimize2, Pause, Play, Volume1, Volume2, VolumeX, X } from 'lucide-react';
import { ClipDetails } from './types';
import { SubtitleOverlay, type SubtitleCue } from './SubtitleOverlay';

interface VideoPreviewPlayerProps {
  clip: ClipDetails;
}

export default function VideoPreviewPlayer({ clip }: VideoPreviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [autoplayRequested, setAutoplayRequested] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    setHasVideoError(false);
    setCurrentTime(0);
    setDuration(0);
    setShouldLoadVideo(false);
    setAutoplayRequested(false);

    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    videoRef.current.load();
  }, [clip.id, clip.videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = volume <= 0;
  }, [volume, clip.id, clip.videoUrl]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = document.fullscreenElement;
      setIsFullscreen(active === shellRef.current || active === videoRef.current || active === imageRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo || !autoplayRequested || hasVideoError) return;

    const tryPlay = async () => {
      try {
        video.muted = volume <= 0;
        video.volume = volume;
        await video.play();
        setIsPlaying(true);
        setAutoplayRequested(false);
      } catch (error) {
        console.error('Clip detail preview autoplay failed', error);
        if (video.error) {
          setHasVideoError(true);
        }
      }
    };

    void tryPlay();
  }, [autoplayRequested, hasVideoError, shouldLoadVideo, volume]);

  const handleTogglePlayback = async () => {
    if (hasVideoError) return;

    if (!shouldLoadVideo) {
      setShouldLoadVideo(true);
      setAutoplayRequested(true);
      return;
    }

    const video = videoRef.current;
    if (!video) {
      setAutoplayRequested(true);
      return;
    }

    if (video.paused) {
      try {
        video.muted = volume <= 0;
        video.volume = volume;
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Clip detail preview play failed', error);
        if (video.error) {
          setHasVideoError(true);
        }
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
    setAutoplayRequested(false);
  };

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
    const video = videoRef.current;
    if (!video) return;
    const nextTime = Number(event.target.value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);
  };

  const handleVolumeInput = (event: FormEvent<HTMLInputElement>) => {
    const nextVolume = Number(event.currentTarget.value);
    setVolume(nextVolume);
  };

  const handleToggleMute = () => {
    setVolume((current) => (current <= 0 ? 0.85 : 0));
  };

  const handleToggleFullscreen = async () => {
    const shell = shellRef.current;
    if (!shell) return;

    try {
      if (document.fullscreenElement === shell) {
        await document.exitFullscreen();
        return;
      }
      await shell.requestFullscreen();
    } catch (error) {
      console.error('Fullscreen toggle failed, using expanded preview fallback', error);
      setIsExpanded((current) => !current);
    }
  };

  const activeSubtitle = useMemo(
    () => buildActiveTranscriptCue(clip.transcriptWords, currentTime * 1000),
    [clip.transcriptWords, currentTime]
  );
  const totalDuration = duration || parseClock(clip.duration);
  const seekMax = Math.max(totalDuration, 0.1);
  const seekValue = Math.min(currentTime, seekMax);
  const seekProgressPercent = `${(currentTime / seekMax) * 100}%`;
  const isLargePreview = isFullscreen || isExpanded;

  return (
    <section className="viewer-player-column" aria-label="Video preview">
      <div
        ref={shellRef}
        className={`viewer-video-shell ${isExpanded ? 'is-expanded' : ''}`}
        data-ratio={clip.aspectRatio}
      >
        <div className="viewer-video-frame">
          <img
            ref={imageRef}
            src={clip.thumbnailUrl}
            alt={clip.title}
            className={`viewer-video-media ${shouldLoadVideo && !hasVideoError ? 'is-hidden' : ''}`}
            loading="lazy"
          />

          {clip.videoUrl && shouldLoadVideo && !hasVideoError ? (
            <video
              key={clip.videoUrl}
              ref={videoRef}
              src={clip.videoUrl}
              poster={clip.thumbnailUrl}
              muted={volume <= 0}
              controls={false}
              playsInline
              preload="metadata"
              className="viewer-video-media viewer-video-media--video"
              onLoadedMetadata={handleLoadedMetadata}
              onLoadedData={() => setHasVideoError(false)}
              onTimeUpdate={handleTimeUpdate}
              onCanPlay={() => setHasVideoError(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={() => {
                setHasVideoError(true);
                setShouldLoadVideo(false);
                setAutoplayRequested(false);
              }}
              onClick={(event) => {
                event.stopPropagation();
                void handleTogglePlayback();
              }}
            />
          ) : null}

          <SubtitleOverlay
            stylePreset={clip.captionStyle}
            displayText={activeSubtitle?.text ?? ''}
            currentTime={currentTime}
            currentSubtitle={activeSubtitle}
          />

          <div className="viewer-video-top-overlay">
            <span>LOW-RES PREVIEW</span>
            <div className="viewer-video-top-actions">
              {!isLargePreview ? (
                <>
                  <span>{formatClock(currentTime)} / {formatClock(totalDuration)}</span>
                  <button
                    type="button"
                    className="viewer-video-fullscreen-btn"
                    aria-label={isFullscreen ? 'Exit fullscreen preview' : 'Open fullscreen preview'}
                    onClick={(event) => {
                      event.stopPropagation();
                      void handleToggleFullscreen();
                    }}
                  >
                    {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="viewer-video-close-btn"
                  aria-label="Close fullscreen preview"
                  onClick={(event) => {
                    event.stopPropagation();
                    void handleToggleFullscreen();
                  }}
                >
                  <X size={14} />
                  <span>Back</span>
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            className={`viewer-video-play-btn ${isPlaying ? 'is-playing' : ''}`}
            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
            onClick={(event) => {
              event.stopPropagation();
              void handleTogglePlayback();
            }}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
        </div>

        <div className={`viewer-video-fullscreen-dock ${isLargePreview ? 'is-visible' : ''}`}>
          <button
            type="button"
            className="viewer-player-control-btn"
            aria-label={isPlaying ? 'Pause preview' : 'Resume preview'}
            onClick={(event) => {
              event.stopPropagation();
              void handleTogglePlayback();
            }}
          >
            {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
          </button>
          <span className="viewer-video-dock-time">{formatClock(currentTime)}</span>
          <div className="viewer-video-dock-seek">
            <input
              type="range"
              min={0}
              max={seekMax}
              step={0.1}
              value={seekValue}
              onChange={handleSeek}
              aria-label="Seek clip preview"
            />
            <span className="viewer-video-dock-seek-fill" style={{ width: seekProgressPercent }} />
          </div>
          <span className="viewer-video-dock-time viewer-video-dock-time-end">{formatClock(totalDuration)}</span>
          <button
            type="button"
            className="viewer-player-control-btn viewer-video-audio-toggle"
            aria-label={volume <= 0 ? 'Unmute preview audio' : 'Mute preview audio'}
            onClick={(event) => {
              event.stopPropagation();
              handleToggleMute();
            }}
          >
            {volume <= 0 ? <VolumeX size={14} /> : volume < 0.5 ? <Volume1 size={14} /> : <Volume2 size={14} />}
          </button>
          <div className="viewer-video-audio-bar">
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
              className="viewer-video-audio-fill"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
          <button
            type="button"
            className="viewer-player-control-btn"
            aria-label={isLargePreview ? 'Exit expanded preview' : 'Open fullscreen preview'}
            onClick={(event) => {
              event.stopPropagation();
              void handleToggleFullscreen();
            }}
          >
            {isLargePreview ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      <div className="viewer-player-controls">
        <button
          type="button"
          className="viewer-player-control-btn"
          aria-label={isPlaying ? 'Pause preview' : 'Resume preview'}
          onClick={() => void handleTogglePlayback()}
        >
          {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
        </button>
        <span className="viewer-player-time">{formatClock(currentTime)} / {formatClock(duration || parseClock(clip.duration))}</span>
        <div className="viewer-player-seek">
          <input
            type="range"
            min={0}
            max={seekMax}
            step={0.1}
            value={seekValue}
            onChange={handleSeek}
            aria-label="Seek clip preview"
          />
          <span className="viewer-player-seek-fill" style={{ width: seekProgressPercent }} />
        </div>
        <button
          type="button"
          className="viewer-player-control-btn"
          aria-label={volume <= 0 ? 'Unmute preview audio' : 'Mute preview audio'}
          onClick={handleToggleMute}
        >
          {volume <= 0 ? <VolumeX size={14} /> : volume < 0.5 ? <Volume1 size={14} /> : <Volume2 size={14} />}
        </button>
        <div className="viewer-player-volume">
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
            className="viewer-player-volume-fill"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
        <button
          type="button"
          className="viewer-player-control-btn"
          aria-label={isFullscreen || isExpanded ? 'Exit expanded preview' : 'Open fullscreen preview'}
          onClick={() => void handleToggleFullscreen()}
        >
          {isFullscreen || isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </section>
  );
}

function buildActiveTranscriptCue(words: ClipDetails['transcriptWords'], currentMs: number): SubtitleCue | null {
  if (!words.length) {
    return null;
  }

  const groups = groupWordsIntoCues(words);
  const activeGroup = groups.find((group) => currentMs >= group[0].start && currentMs <= group[group.length - 1].end) ?? null;

  if (!activeGroup) {
    return null;
  }

  const text = activeGroup
    .map((word) => word.word)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    start: activeGroup[0].start / 1000,
    end: activeGroup[activeGroup.length - 1].end / 1000,
    text,
  };
}

function groupWordsIntoCues(words: ClipDetails['transcriptWords']) {
  if (!words.length) return [];

  const groups: ClipDetails['transcriptWords'][] = [];
  let current: ClipDetails['transcriptWords'] = [];

  for (const word of words) {
    const previous = current[current.length - 1];
    const gapTooLarge = previous ? word.start - previous.end > 700 : false;
    const cueTooLong = current.length >= 6;

    if ((gapTooLarge || cueTooLong) && current.length > 0) {
      groups.push(current);
      current = [];
    }

    current.push(word);
  }

  if (current.length > 0) {
    groups.push(current);
  }

  return groups;
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
