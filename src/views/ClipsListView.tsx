import { useEffect, useMemo, useState } from 'react';
import ResultsPage from '../components/results/ResultsPage';
import { CaptionStyleTone, ClipDetails, ClipItem } from '../components/results/types';
import { buildScheduledDate, formatScheduledLabel } from '../lib/clipScheduling';
import { ClipSuggestion, Project, TranscriptSegment, ViewType } from '../types';
import { getProjectTranscript, transcribeSource, type StoredProjectTranscript } from '../lib/workflowApi';
import { isTauri } from '@tauri-apps/api/core';

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
const CATEGORY_ROTATION = [
  'Useful quote',
  'Podcast insight',
  'Journey & tutorial',
  'Bold opinion',
  'Motivation',
  'Creator lesson',
];

const BADGE_ROTATION = [
  [{ label: 'Useful quotes', tone: 'gold' as const }],
  [{ label: 'Retention hook', tone: 'violet' as const }],
  [
    { label: 'Bold opinion hook', tone: 'gold' as const },
    { label: 'Journey & tutorial', tone: 'slate' as const },
  ],
  [{ label: 'Podcast insight', tone: 'emerald' as const }],
  [{ label: 'Story payoff', tone: 'violet' as const }],
  [{ label: 'Motivation clip', tone: 'emerald' as const }],
];

const INTERNET_VIDEO_URL = '/caption_ref.mp4';

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
  timelineLabel: buildTimelineLabel(index * 18_000, index * 18_000 + parseClockToMs(SAMPLE_DURATIONS[index])),
  scheduledLabel: formatScheduledLabel(buildScheduledDate(index)),
  categoryLabel: CATEGORY_ROTATION[index % CATEGORY_ROTATION.length],
  editLabel: 'Quick edit',
  badges: BADGE_ROTATION[index % BADGE_ROTATION.length],
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
  const [projectTranscript, setProjectTranscript] = useState<StoredProjectTranscript | null>(null);

  const useFallbackData = clips.length === 0;
  const clipTranscriptRange = useMemo(() => {
    if (clips.length === 0) {
      return null;
    }

    return {
      startMs: Math.min(...clips.map((clip) => clip.startMs)),
      endMs: Math.max(...clips.map((clip) => clip.endMs)),
    };
  }, [clips]);

  useEffect(() => {
    if (!project?.id || !isTauri() || useFallbackData) {
      setProjectTranscript(null);
      return;
    }

    let cancelled = false;
    let pollTimer: number | undefined;

    const loadTranscript = async () => {
      try {
        let transcript = await getProjectTranscript(project.id);
        if (cancelled) return;

        const transcriptCoversClipRange = Boolean(
          transcript
          && clipTranscriptRange
          && (transcript.sourceStartMs ?? 0) <= clipTranscriptRange.startMs
          && (transcript.sourceEndMs ?? Number.MAX_SAFE_INTEGER) >= clipTranscriptRange.endMs
        );

        const shouldStartTranscription = Boolean(project.sourcePath)
          && Boolean(clipTranscriptRange)
          && (!transcript || transcript.status === 'error' || !transcriptCoversClipRange);

        if (shouldStartTranscription) {
          setProjectTranscript(createPendingTranscript(
            project.id,
            transcript?.modelSize ?? 'medium',
            clipTranscriptRange?.startMs ?? null,
            clipTranscriptRange?.endMs ?? null,
          ));
          transcript = await transcribeSource({
            projectId: project.id,
            videoPath: project.sourcePath,
            modelSize: transcript?.modelSize ?? 'medium',
            startMs: clipTranscriptRange?.startMs,
            endMs: clipTranscriptRange?.endMs,
          });
          if (cancelled) return;
        }

        setProjectTranscript(transcript);

        if (transcript?.status === 'processing') {
          pollTimer = window.setTimeout(loadTranscript, 2500);
        }
      } catch (error) {
        console.error('Failed to load project transcript', error);
      }
    };

    void loadTranscript();

    return () => {
      cancelled = true;
      if (pollTimer) {
        window.clearTimeout(pollTimer);
      }
    };
  }, [clipTranscriptRange, project?.id, project?.sourcePath, useFallbackData]);

  const resultClips = useMemo<ClipItem[]>(() => {
    if (useFallbackData) {
      return FALLBACK_CLIPS;
    }

    return clips.map((clip, index) => {
      const trimmedHook = sanitizeTitle(clip.hook);
      const realTitle = trimmedHook || `Clip ${index + 1}`;
      const realThumbnail = clip.thumbnailUrl ?? project?.thumbnailUrl ?? '';

      return {
        id: clip.id,
        clipId: clip.id,
        title: realTitle,
        score: normalizeScore(clip.score),
        duration: formatAsClock(clip.endMs - clip.startMs),
        thumbnailUrl: realThumbnail,
        videoUrl: clip.videoUrl,
        videoPath: clip.videoPath,
        aspectRatio: clip.aspectRatio ?? '9:16',
        captionStyle: normalizeCaptionStyle(clip.captionStyle),
        timelineLabel: buildTimelineLabel(clip.startMs, clip.endMs),
        scheduledLabel: formatScheduledLabel(buildScheduledDate(index)),
        categoryLabel: inferCategoryLabel(clip, index),
        editLabel: inferEditLabel(clip.endMs - clip.startMs),
        badges: buildInsightBadges(clip, index),
        isPlayable: Boolean(clip.videoUrl),
        isSelected: clip.selected,
        hasAutoHook: index < 10,
        showFavoriteAction: false,
        showCommentAction: false,
      };
    });
  }, [clips, project?.thumbnailUrl, useFallbackData]);

  useEffect(() => {
    setClipDetailsById((previous) => {
      const next: Record<string, ClipDetails> = {};

      resultClips.forEach((clip, index) => {
        const created = createClipDetails(clip, index);
        const sourceClip = clips.find((item) => item.id === clip.id);
        const transcriptWords = sourceClip ? getClipTranscriptWords(projectTranscript, sourceClip) : [];
        const transcriptSegments = buildTranscriptSegments(transcriptWords, 0);
        const summary = buildSceneSummary(clip.title, transcriptWords);
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
              aspectRatio: created.aspectRatio,
              metrics: created.metrics,
              transcript: transcriptSegments,
              transcriptWords,
              summary,
            }
          : created;
      });

      return next;
    });
  }, [clips, projectTranscript, resultClips]);

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

  const handleClipAspectRatioChange = (clipId: string, aspectRatio: ClipDetails['aspectRatio']) => {
    setClipDetailsById((previous) => {
      const current = previous[clipId];
      if (!current) return previous;

      return {
        ...previous,
        [clipId]: {
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
      clipDetailsById={clipDetailsById}
      viewerClip={activeViewerClip}
      onCloseViewer={() => setViewerClipId(null)}
      onPreviousViewerClip={() => handleCycleViewerClip(-1)}
      onNextViewerClip={() => handleCycleViewerClip(1)}
      onViewerAspectRatioChange={handleViewerAspectRatioChange}
      onClipAspectRatioChange={handleClipAspectRatioChange}
      onViewerCaptionStyleChange={handleViewerCaptionStyleChange}
      onEditViewerClip={handleEditActiveClip}
      onEditClipFromList={(clipId) => {
        const targetClip = clips.find((clip) => clip.id === clipId);
        if (!targetClip) return;
        onEditClip(targetClip);
      }}
    />
  );
}

function createPendingTranscript(
  projectId: string,
  modelSize: string,
  sourceStartMs: number | null,
  sourceEndMs: number | null,
): StoredProjectTranscript {
  const now = new Date().toISOString();
  return {
    id: `pending-${projectId}`,
    projectId,
    modelSize,
    status: 'processing',
    sourceStartMs,
    sourceEndMs,
    words: [],
    language: null,
    error: null,
    createdAt: now,
    updatedAt: now,
  };
}

function createClipDetails(clip: ClipItem, index: number): ClipDetails {
  const initialCaptionStyle = normalizeCaptionStyle(clip.captionStyle);

  return {
    id: clip.id,
    rank: index + 1,
    title: clip.title,
    score: clip.score,
    duration: clip.duration,
    thumbnailUrl: clip.thumbnailUrl,
    videoUrl: clip.videoUrl,
    videoPath: clip.videoPath,
    metrics: buildMetricsFromScore(clip.score),
    transcript: [],
    transcriptWords: [],
    summary: buildSceneSummary(clip.title, []),
    captionStyle: initialCaptionStyle,
    aspectRatio: clip.aspectRatio ?? '9:16',
  };
}

function normalizeCaptionStyle(value: string | undefined): CaptionStyleTone {
  switch (value) {
    case 'classic':
    case 'tiktok':
    case 'box':
    case 'cinematic':
    case 'outline':
    case 'bold-center':
      return value;
    default:
      return 'classic';
  }
}

function formatAsClock(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

function formatAsShortClock(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function parseClockToMs(clock: string): number {
  const parts = clock.split(':').map((value) => Number(value));
  const [hours = 0, minutes = 0, seconds = 0] = parts.length === 3 ? parts : [0, parts[0] ?? 0, parts[1] ?? 0];
  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
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

function buildSceneSummary(title: string, transcriptWords: ClipDetails['transcriptWords']): string[] {
  if (transcriptWords.length > 0) {
    const excerpt = transcriptWords
      .slice(0, 18)
      .map((word) => word.word)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return [
      `Transcribed from the source with faster-whisper medium and synced to this clip window.`,
      excerpt ? `Opening transcript slice: "${excerpt}${transcriptWords.length > 18 ? '…' : ''}"` : `Transcript is ready for "${title}".`,
    ];
  }

  return [
    `Discover a focused story arc in "${title}" with a strong first impression that sustains attention.`,
    'The scene emphasizes momentum, emotional clarity, and direct audience value to improve retention.',
  ];
}

function buildTranscriptSegments(words: ClipDetails['transcriptWords'], _clipStartMs: number): TranscriptSegment[] {
  if (!words.length) {
    return [];
  }

  const segments: TranscriptSegment[] = [];
  let currentWords: ClipDetails['transcriptWords'] = [];
  let currentStart = words[0].start;

  for (const word of words) {
    const previousWord = currentWords[currentWords.length - 1];
    const gapTooLarge = previousWord ? word.start - previousWord.end > 1200 : false;
    const segmentTooLong = currentWords.length >= 14;

    if ((gapTooLarge || segmentTooLong) && currentWords.length > 0) {
      segments.push({
        id: segments.length + 1,
        start: currentStart,
        end: previousWord.end,
        text: currentWords.map((item) => item.word).join(' ').replace(/\s+/g, ' ').trim(),
        words: currentWords,
      });
      currentWords = [];
      currentStart = word.start;
    }

    currentWords.push({
      ...word,
      start: word.start,
      end: word.end,
    });
  }

  const lastWord = currentWords[currentWords.length - 1];
  if (currentWords.length > 0 && lastWord) {
    segments.push({
      id: segments.length + 1,
      start: currentStart,
      end: lastWord.end,
      text: currentWords.map((item) => item.word).join(' ').replace(/\s+/g, ' ').trim(),
      words: currentWords,
    });
  }

  return segments;
}

function getClipTranscriptWords(projectTranscript: StoredProjectTranscript | null, clip: ClipSuggestion): ClipDetails['transcriptWords'] {
  if (!projectTranscript?.words?.length) {
    return [];
  }

  return projectTranscript.words
    .filter((word) => word.end > clip.startMs && word.start < clip.endMs)
    .map((word) => ({
      ...word,
      start: Math.max(0, word.start - clip.startMs),
      end: Math.max(0, Math.min(word.end, clip.endMs) - clip.startMs),
    }));
}

function buildTimelineLabel(startMs: number, endMs: number): string {
  return `${formatAsShortClock(startMs)}-${formatAsShortClock(endMs)}`;
}

function inferCategoryLabel(clip: ClipSuggestion, index: number): string {
  const text = `${clip.hook} ${clip.reason}`.toLowerCase();

  if (text.includes('quote')) return 'Useful quote';
  if (text.includes('tutorial') || text.includes('learn')) return 'Journey & tutorial';
  if (text.includes('podcast')) return 'Podcast insight';
  if (text.includes('motivat') || text.includes('mindset')) return 'Motivation';

  return CATEGORY_ROTATION[index % CATEGORY_ROTATION.length];
}

function inferEditLabel(durationMs: number): string {
  const seconds = Math.max(1, Math.round(durationMs / 1000));

  if (seconds > 40) return 'Trim to 30s';
  if (seconds > 20) return 'Tighten cuts';
  return 'Quick edit';
}

function buildInsightBadges(clip: ClipSuggestion, index: number): ClipItem['badges'] {
  const text = `${clip.hook} ${clip.reason}`.toLowerCase();

  if (text.includes('quote')) {
    return [{ label: 'Useful quotes', tone: 'gold' }];
  }

  if (text.includes('hook')) {
    return [{ label: 'Bold opinion hook', tone: 'gold' }];
  }

  if (text.includes('tutorial') || text.includes('learn')) {
    return [
      { label: 'Journey & tutorial', tone: 'slate' },
      { label: 'Save-worthy', tone: 'emerald' },
    ];
  }

  return BADGE_ROTATION[index % BADGE_ROTATION.length];
}
