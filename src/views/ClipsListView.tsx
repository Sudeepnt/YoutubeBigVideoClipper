import { useEffect, useMemo, useState } from 'react';
import ResultsPage from '../components/results/ResultsPage';
import { CaptionStyleTone, ClipDetails, ClipItem } from '../components/results/types';
import { ClipSuggestion, Project, TranscriptSegment, ViewType } from '../types';

interface ClipsListViewProps {
  project?: Project | null;
  clips: ClipSuggestion[];
  onClipsChange: (clips: ClipSuggestion[]) => void;
  onEditClip: (clip: ClipSuggestion) => void;
  onDeleteClip?: (clipId: string) => void;
  onClearProjectClips?: (projectId: string) => Promise<void>;
  onBack?: () => void;
  onViewChange?: (view: ViewType) => void;
}

const SCORE_RANKING = [94, 90, 85, 84, 82, 79];

const SAMPLE_TITLES = [
  'Get Your Dive Master Certificate & Explore Oceans',
  'Dance Around the World: My Ultimate Goal',
  'English Goals for Beginners: Short & Long Term',
  'Dance Culture: The Happiest Cultures Connect Through Dance',
  'Learn Languages & Travel: Your Next Adventure Awaits!',
  'Dream Dance Lessons: Brazil, Colombia, India, and Beyond',
];

const SAMPLE_DURATIONS = ['00:02:12', '00:00:44', '00:00:46', '00:00:48', '00:00:15', '00:00:20'];

const INTERNET_VIDEO_URL = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

const SAMPLE_MEDIA = [
  {
    thumbnailUrl: '/opus-capture/public.cdn.opus.pro/clip-web/images/thumbnail/tutorial_qAdcMVbrIeM__1.png',
    videoUrl: INTERNET_VIDEO_URL,
  },
  {
    thumbnailUrl: '/opus-capture/public.cdn.opus.pro/clip-web/images/thumbnail/tutorial_ZnhFtWcfY4w__2.png',
    videoUrl: INTERNET_VIDEO_URL,
  },
  {
    thumbnailUrl: '/opus-capture/public.cdn.opus.pro/clip-web/images/thumbnail/tutorial_HkZPPre33BI__3.png',
    videoUrl: INTERNET_VIDEO_URL,
  },
  {
    thumbnailUrl: '/opus-capture/public.cdn.opus.pro/clip-web/images/thumbnail/tutorial_k_YlnxFwgM0__4.png',
    videoUrl: INTERNET_VIDEO_URL,
  },
  {
    thumbnailUrl: '/opus-capture/public.cdn.opus.pro/clip-web/images/thumbnail/tutorial_nY6KPBFJ7_8__5.png',
    videoUrl: INTERNET_VIDEO_URL,
  },
  {
    thumbnailUrl: '/opus-capture/i.ytimg.com/vi/hP0EceBuGjg/maxresdefault.jpg',
    videoUrl: INTERNET_VIDEO_URL,
  },
];

const FALLBACK_CLIPS: ClipItem[] = SAMPLE_TITLES.map((title, index) => ({
  id: `sample-${index + 1}`,
  title,
  score: SCORE_RANKING[index],
  duration: SAMPLE_DURATIONS[index],
  thumbnailUrl: SAMPLE_MEDIA[index].thumbnailUrl,
  videoUrl: SAMPLE_MEDIA[index].videoUrl,
  isPlayable: index === 1,
  isSelected: index === 1,
  hasAutoHook: index < 5,
  showFavoriteAction: index === 1,
  showCommentAction: index === 1,
}));

export default function ClipsListView(props: ClipsListViewProps) {
  const { project, clips, onEditClip, onBack, onViewChange } = props;

  const [searchValue, setSearchValue] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAutoHook, setShowAutoHook] = useState(true);
  const [previewClipId, setPreviewClipId] = useState<string | null>(null);
  const [viewerClipId, setViewerClipId] = useState<string | null>(null);
  const [clipDetailsById, setClipDetailsById] = useState<Record<string, ClipDetails>>({});

  const useFallbackData = clips.length === 0;

  const resultClips = useMemo<ClipItem[]>(() => {
    if (useFallbackData) {
      return FALLBACK_CLIPS;
    }

    return clips.map((clip, index) => {
      const trimmedHook = sanitizeTitle(clip.hook);
      const fallbackMedia = SAMPLE_MEDIA[index % SAMPLE_MEDIA.length];
      const fallbackTitle = SAMPLE_TITLES[index % SAMPLE_TITLES.length];

      return {
        id: clip.id,
        clipId: clip.id,
        title: trimmedHook.length > 18 ? trimmedHook : fallbackTitle,
        score: SCORE_RANKING[index] ?? normalizeScore(clip.score),
        duration: formatAsClock(clip.endMs - clip.startMs),
        thumbnailUrl: clip.thumbnailUrl ?? fallbackMedia.thumbnailUrl,
        videoUrl: clip.videoUrl ?? fallbackMedia.videoUrl,
        isPlayable: index === 1,
        isSelected: clip.selected,
        hasAutoHook: index < 10,
        showFavoriteAction: index === 1,
        showCommentAction: index === 1,
      };
    });
  }, [clips, useFallbackData]);

  useEffect(() => {
    setClipDetailsById((previous) => {
      const next: Record<string, ClipDetails> = {};

      resultClips.forEach((clip, index) => {
        const created = createClipDetails(clip, index);
        const existing = previous[clip.id];

        next[clip.id] = existing
          ? {
              ...existing,
              rank: created.rank,
              title: created.title,
              score: created.score,
              duration: created.duration,
              thumbnailUrl: created.thumbnailUrl,
              videoUrl: created.videoUrl,
              metrics: created.metrics,
              transcript: created.transcript,
              summary: created.summary,
            }
          : created;
      });

      return next;
    });
  }, [resultClips]);

  useEffect(() => {
    if (!viewerClipId) return;
    if (resultClips.some((clip) => clip.id === viewerClipId)) return;
    setViewerClipId(null);
  }, [viewerClipId, resultClips]);

  const visibleClips = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return resultClips;
    return resultClips.filter((clip) => clip.title.toLowerCase().includes(query));
  }, [resultClips, searchValue]);

  const activeViewerClip = viewerClipId ? clipDetailsById[viewerClipId] ?? null : null;

  const viewerCaptionText = useMemo(() => {
    if (!activeViewerClip) return '';
    return buildCaption(activeViewerClip.title);
  }, [activeViewerClip]);

  const handlePreviewClip = (clipId: string) => {
    setPreviewClipId((current) => (current === clipId ? null : clipId));
  };

  const handleOpenClipViewer = (clipId: string) => {
    setViewerClipId(clipId);
  };

  const handleCycleViewerClip = (direction: -1 | 1) => {
    if (!resultClips.length) return;

    setViewerClipId((current) => {
      const activeId = current ?? resultClips[0].id;
      const currentIndex = resultClips.findIndex((clip) => clip.id === activeId);
      const safeIndex = currentIndex >= 0 ? currentIndex : 0;
      const nextIndex = (safeIndex + direction + resultClips.length) % resultClips.length;
      return resultClips[nextIndex].id;
    });
  };

  const handleViewerAspectRatioChange = (aspectRatio: ClipDetails['aspectRatio']) => {
    if (!viewerClipId) return;

    setClipDetailsById((previous) => {
      const current = previous[viewerClipId];
      if (!current) return previous;

      return {
        ...previous,
        [viewerClipId]: {
          ...current,
          aspectRatio,
        },
      };
    });
  };

  const handleViewerCaptionStyleChange = (captionStyle: CaptionStyleTone) => {
    if (!viewerClipId) return;

    setClipDetailsById((previous) => {
      const current = previous[viewerClipId];
      if (!current) return previous;

      return {
        ...previous,
        [viewerClipId]: {
          ...current,
          captionStyle,
        },
      };
    });
  };

  const handleEditActiveClip = () => {
    if (!activeViewerClip || useFallbackData) return;

    const targetClip = clips.find((clip) => clip.id === activeViewerClip.id);
    if (!targetClip) return;

    onEditClip(targetClip);
  };

  return (
    <ResultsPage
      projectTitle={project?.name ?? 'SLOW English Podcast for Beginners'}
      clips={visibleClips}
      totalClipCount={useFallbackData ? FALLBACK_CLIPS.length : clips.length}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      showAutoHook={showAutoHook}
      onDisableAutoHook={() => setShowAutoHook(false)}
      onCloseAutoHook={() => setShowAutoHook(false)}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      previewClipId={previewClipId}
      onPreviewClip={handlePreviewClip}
      onOpenClip={handleOpenClipViewer}
      onBack={onBack}
      onNavigate={(view) => onViewChange?.(view)}
      activeSidebarItem="clips"
      viewerClip={activeViewerClip}
      viewerCaptionText={viewerCaptionText}
      onCloseViewer={() => setViewerClipId(null)}
      onPreviousViewerClip={() => handleCycleViewerClip(-1)}
      onNextViewerClip={() => handleCycleViewerClip(1)}
      onViewerAspectRatioChange={handleViewerAspectRatioChange}
      onViewerCaptionStyleChange={handleViewerCaptionStyleChange}
      onEditViewerClip={handleEditActiveClip}
    />
  );
}

function createClipDetails(clip: ClipItem, index: number): ClipDetails {
  return {
    id: clip.id,
    rank: index + 1,
    title: clip.title,
    score: clip.score,
    duration: clip.duration,
    thumbnailUrl: clip.thumbnailUrl,
    videoUrl: clip.videoUrl,
    metrics: buildMetricsFromScore(clip.score),
    transcript: buildTranscriptSegments(index),
    summary: buildSceneSummary(clip.title),
    captionStyle: 'karaoke',
    aspectRatio: '9:16',
  };
}

function formatAsClock(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

function normalizeScore(score: number): number {
  const rawScore = score > 10 ? score : score * 10;
  const rounded = Math.round(rawScore);
  return Math.max(1, Math.min(99, rounded));
}

function sanitizeTitle(title: string): string {
  return title.replace(/\s+/g, ' ').replace(/^['"]+|['"]+$/g, '').trim();
}

function buildMetricsFromScore(score: number): ClipDetails['metrics'] {
  if (score >= 92) {
    return { hook: 'A-', flow: 'A', value: 'A', trend: 'A-' };
  }

  if (score >= 85) {
    return { hook: 'B+', flow: 'A-', value: 'A-', trend: 'B+' };
  }

  if (score >= 80) {
    return { hook: 'B', flow: 'B+', value: 'A-', trend: 'B' };
  }

  return { hook: 'B-', flow: 'B', value: 'B+', trend: 'C+' };
}

function buildSceneSummary(title: string): string[] {
  return [
    `Discover a focused story arc in "${title}" with a strong first impression that sustains attention.`,
    'The scene emphasizes momentum, emotional clarity, and direct audience value to improve retention.',
  ];
}

function buildTranscriptSegments(index: number): TranscriptSegment[] {
  const offset = index * 20_000;

  return [
    {
      id: 1,
      start: 48_000 + offset,
      end: 61_000 + offset,
      text: 'What is a goal that you are working on right now?',
      words: [],
    },
    {
      id: 2,
      start: 61_000 + offset,
      end: 84_000 + offset,
      text: 'I love diving because it brings joy, freedom, and connection to new places.',
      words: [],
    },
    {
      id: 3,
      start: 84_000 + offset,
      end: 101_000 + offset,
      text: 'My goal is to travel, learn from different cultures, and share this journey through short videos.',
      words: [],
    },
  ];
}

function buildCaption(title: string): string {
  const topic = title.split(':')[0] || title;
  return `${topic}: TO GET STARTED`;
}
