import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { ChevronLeft, ChevronRight, CircleCheckBig, Download, Film, Link2, Monitor, Pause, PenLine, Play, RectangleHorizontal, Smartphone, Square, Trash2, Upload, Volume1, Volume2, VolumeX } from 'lucide-react';
import { ClipSuggestion, Project } from '../types';
import { clearProjectClips, ensureProjectThumbnail, generateClipNative, listProjectClips, loadProjectThumbnailBlobUrl, prepareProcessingSource, prepareProjectPreviewUrl } from '../lib/libraryApi';
import { OPUS_CAPTION_TEMPLATES, formatOpusTemplateLabel } from '../lib/opusBrandTemplates';
import { getProjectTranscript, transcribeSource } from '../lib/workflowApi';
import { CAPTION_STYLE_OPTIONS, CaptionStylePreview } from '../components/results/CaptionSelector';
import type { CaptionStyleTone } from '../components/results/types';
import AiReframeView from './AiReframeView';
import type { AiReframeResult } from '../lib/aiReframeApi';
import { formatDuration, formatFileSize } from '../store';

interface WorkflowViewProps {
    project: Project;
    onProjectDeleted: (projectId: string) => void;
    onClipsReady: (clips: ClipSuggestion[]) => void;
    onOpenClipsList: () => void;
    autoStart?: boolean;
    onAutoStartConsumed?: () => void;
    sourcePreparing?: boolean;
}

const PROCESS_STEPS = [
    {
        id: 'source',
        title: 'Source Ready',
        caption: 'Check link or upload'
    },
    {
        id: 'reframe',
        title: 'Speaker Crop',
        caption: 'Find and crop around the speaker'
    },
    {
        id: 'frames',
        title: 'Scene Map',
        caption: 'Frame and crop pass'
    },
    {
        id: 'hooks',
        title: 'Hook Scan',
        caption: 'Narrative and energy'
    },
    {
        id: 'drafts',
        title: 'Clip Drafts',
        caption: 'Build first set'
    },
    {
        id: 'subtitles',
        title: 'Subtitles',
        caption: 'Burn captions into clips'
    },
    {
        id: 'review',
        title: 'Review',
        caption: 'Open results board'
    }
] as const;
const MANUAL_PROCESS_STEPS = [
    {
        id: 'source',
        title: 'Source Ready',
        caption: 'Check timeframe'
    },
    {
        id: 'trim',
        title: 'Trim Range',
        caption: 'Keep the selected section'
    },
    {
        id: 'subtitles',
        title: 'Subtitles',
        caption: 'Apply chosen subtitle style'
    },
    {
        id: 'review',
        title: 'Review',
        caption: 'Open results board'
    }
] as const;

const PROCESS_GRID_ROWS = 3;
const PROCESS_GRID_COLUMNS = 4;
const MAX_GENERATED_CLIPS = PROCESS_GRID_ROWS * PROCESS_GRID_COLUMNS;
const PROCESS_ROW_PATHS = [
    'M 26 50 C 30 50 30 18 38 18 L 96 18',
    'M 26 50 C 30 50 31 50 38 50 L 96 50',
    'M 26 50 C 30 50 30 82 38 82 L 96 82'
] as const;
const FLOW_LOOP_SECONDS = 4.8;

const PROCESS_GRID = Array.from({ length: PROCESS_GRID_ROWS }, (_, rowIndex) =>
    Array.from({ length: PROCESS_GRID_COLUMNS }, (_, columnIndex) => ({
        id: `row-${rowIndex}-clip-${columnIndex}`,
        order: rowIndex * PROCESS_GRID_COLUMNS + columnIndex,
        rowIndex,
        columnIndex
    }))
);

const pause = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
type PresetCard = {
    name: string;
};

type WorkflowCaptionPresetOption = {
    templateId: string;
    name: string;
    desc: string;
    styleId: CaptionStyleTone | null;
};

const CLIP_MODELS = ['ClipBasic', 'ClipBoost', 'ClipNarrative'] as const;
const GENRE_OPTIONS = ['Auto', 'Podcast', 'Reaction', 'Education'] as const;
const LENGTH_OPTIONS = ['Auto (0m-3m)', '<30s', '30s~59s', '60s~89s', '90s~3m', '3m~5m'] as const;
const ASPECT_RATIOS = ['9:16', '1:1', '16:9', '4:5'] as const;
const ASPECT_RATIO_OPTIONS = [
    { id: '9:16', label: '9:16', platforms: 'TikTok, Reels, Shorts, Facebook', icon: Smartphone, iconClassName: '' },
    { id: '1:1', label: '1:1', platforms: 'Instagram feed, LinkedIn, Facebook', icon: Square, iconClassName: '' },
    { id: '16:9', label: '16:9', platforms: 'YouTube, LinkedIn, Facebook, X', icon: Monitor, iconClassName: '' },
    { id: '4:5', label: '4:5', platforms: 'Instagram, Facebook, LinkedIn', icon: RectangleHorizontal, iconClassName: 'is-portrait' }
] as const;
const NUMBERED_CAPTION_TEMPLATES = OPUS_CAPTION_TEMPLATES.filter((template) => template.templateId !== 'none');
const HIDDEN_CAPTION_SERIALS = new Set([2, 4, 7, 9, 10, 11, 13, 14, 16, 18, 19, 20, 21, 22]);
const WORKFLOW_VISIBLE_CAPTION_TEMPLATES = OPUS_CAPTION_TEMPLATES.filter((template) => {
    if (template.templateId === 'none') return true;
    const templateIndex = NUMBERED_CAPTION_TEMPLATES.findIndex((item) => item.templateId === template.templateId);
    return !HIDDEN_CAPTION_SERIALS.has(templateIndex + 1);
});
const WORKFLOW_NON_NONE_CAPTION_TEMPLATES = WORKFLOW_VISIBLE_CAPTION_TEMPLATES.filter((template) => template.templateId !== 'none');
const WORKFLOW_CAPTION_PRESET_OPTIONS: WorkflowCaptionPresetOption[] = [
    {
        templateId: 'none',
        name: 'No captions',
        desc: 'Hide caption overlay',
        styleId: null
    },
    ...CAPTION_STYLE_OPTIONS
        .slice(0, WORKFLOW_NON_NONE_CAPTION_TEMPLATES.length)
        .map((styleOption, index) => ({
            templateId: WORKFLOW_NON_NONE_CAPTION_TEMPLATES[index].templateId,
            name: styleOption.name,
            desc: styleOption.desc,
            styleId: styleOption.id
        }))
];

const getCaptionTemplateDisplayLabel = (templateId: string, fallbackName: string) => {
    const mappedPreset = WORKFLOW_CAPTION_PRESET_OPTIONS.find((option) => option.templateId === templateId);
    if (mappedPreset) return mappedPreset.name;
    if (templateId === 'none') return 'No captions';
    const templateIndex = NUMBERED_CAPTION_TEMPLATES.findIndex((template) => template.templateId === templateId);
    if (templateIndex >= 0) {
        return `Caption ${templateIndex + 1}`;
    }
    return formatOpusTemplateLabel(templateId, fallbackName);
};

const TEMPLATE_PRESETS: PresetCard[] = [
    { name: 'Preset template 1' },
    { name: 'Preset template 2' }
];

function getClipLengthBounds(option: (typeof LENGTH_OPTIONS)[number]): { min: number; max: number } | null {
    switch (option) {
        case '<30s':
            return { min: 12, max: 29 };
        case '30s~59s':
            return { min: 30, max: 59 };
        case '60s~89s':
            return { min: 60, max: 89 };
        case '90s~3m':
            return { min: 90, max: 180 };
        case '3m~5m':
            return { min: 180, max: 300 };
        default:
            return null;
    }
}

function formatPreviewClock(totalSeconds: number): string {
    const safe = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatTimeframeClock(totalSeconds: number): string {
    const safe = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const seconds = safe % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatEta(totalMs: number): string {
    const totalMinutes = Math.max(1, Math.ceil(totalMs / 60_000));
    if (totalMinutes >= 60) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${totalMinutes}m`;
}

function formatElapsedClock(totalMs: number): string {
    const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getTargetClipDurationSec(
    timeframeDurationSec: number,
    clipLengthBounds: { min: number; max: number } | null
): number {
    if (clipLengthBounds) {
        return Math.max(1, Math.min(timeframeDurationSec, clipLengthBounds.min));
    }

    return Math.max(30, Math.min(90, Math.round(timeframeDurationSec / 6) || 45));
}

function deriveClosestAspectRatio(width: number, height: number): (typeof ASPECT_RATIOS)[number] {
    if (!width || !height) return '16:9';

    const sourceRatio = width / height;
    const ranked = ASPECT_RATIOS
        .map((ratio) => {
            const [ratioWidth, ratioHeight] = ratio.split(':').map(Number);
            return {
                ratio,
                distance: Math.abs(sourceRatio - (ratioWidth / ratioHeight))
            };
        })
        .sort((left, right) => left.distance - right.distance);

    return ranked[0]?.ratio ?? '16:9';
}

export default function WorkflowView({
    project,
    onProjectDeleted,
    onClipsReady,
    onOpenClipsList,
    autoStart = false,
    onAutoStartConsumed,
    sourcePreparing = false
}: WorkflowViewProps) {
    const [workflowStage, setWorkflowStage] = useState<'setup' | 'processing' | 'subtitles'>(() => (
        autoStart || sourcePreparing ? 'processing' : 'setup'
    ));
    const [setupPage, setSetupPage] = useState<'source' | 'reframe'>('source');
    const [isGenerating, setIsGenerating] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [progressText, setProgressText] = useState('Waiting to start');
    const [readyClipCount, setReadyClipCount] = useState(0);
    const [processClips, setProcessClips] = useState<ClipSuggestion[]>([]);
    const [sourcePrepareProgress, setSourcePrepareProgress] = useState(12);
    const [previewState, setPreviewState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
    const [previewDurationSec, setPreviewDurationSec] = useState(0);
    const [previewCurrentSec, setPreviewCurrentSec] = useState(0);
    const [previewPlaying, setPreviewPlaying] = useState(false);
    const [previewVolume, setPreviewVolume] = useState(0.8);
    const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
    const [clippingMode, setClippingMode] = useState<'clip' | 'skip'>('clip');
    const [clipModel, setClipModel] = useState<(typeof CLIP_MODELS)[number]>('ClipBasic');
    const [clipGenre, setClipGenre] = useState<(typeof GENRE_OPTIONS)[number]>('Auto');
    const [clipLength, setClipLength] = useState<(typeof LENGTH_OPTIONS)[number]>('Auto (0m-3m)');
    const [autoHookEnabled, setAutoHookEnabled] = useState(true);
    const [momentsPrompt, setMomentsPrompt] = useState('');
    const [presetTab, setPresetTab] = useState<'quick' | 'templates'>('quick');
    const [aspectRatio, setAspectRatio] = useState<(typeof ASPECT_RATIOS)[number]>('9:16');
    const [selectedWorkflowCaptionId, setSelectedWorkflowCaptionId] = useState<string>(
        WORKFLOW_CAPTION_PRESET_OPTIONS[1]?.templateId
            ?? WORKFLOW_CAPTION_PRESET_OPTIONS[0]?.templateId
            ?? 'none'
    );
    const [timeframeStartSec, setTimeframeStartSec] = useState(0);
    const [timeframeEndSec, setTimeframeEndSec] = useState(0);
    const [processSourceThumbnail, setProcessSourceThumbnail] = useState<string | undefined>(project.thumbnailUrl);
    const [resolvedPreviewSrc, setResolvedPreviewSrc] = useState(project.filePath || '');
    const [previewBlobLoaded, setPreviewBlobLoaded] = useState(false);
    const [subtitleProgressCount, setSubtitleProgressCount] = useState(0);
    const [subtitleTargetCount, setSubtitleTargetCount] = useState(0);
    const [subtitleStatusText, setSubtitleStatusText] = useState('Queued after clip drafting.');
    const [subtitlePhase, setSubtitlePhase] = useState<'preparing' | 'transcribing' | 'applying' | 'complete'>('preparing');
    const [subtitleStageStartedAt, setSubtitleStageStartedAt] = useState<number | null>(null);
    const [subtitleNow, setSubtitleNow] = useState(() => Date.now());
    const [workflowReframeResult, setWorkflowReframeResult] = useState<AiReframeResult | null>(null);
    const autoRunRef = useRef<string | null>(null);
    const previewVideoRef = useRef<HTMLVideoElement | null>(null);
    const timeframeRailRef = useRef<HTMLDivElement | null>(null);
    const previewBlobUrlRef = useRef<string | null>(null);
    const thumbnailBlobUrlRef = useRef<string | null>(null);
    const previewPlayOnLoadRef = useRef(false);
    const [activeTimeframeHandle, setActiveTimeframeHandle] = useState<'start' | 'end' | null>(null);

    const maxDurationSec = useMemo(() => {
        if (!project?.duration || !Number.isFinite(project.duration) || project.duration <= 0) return 180;
        return Math.max(30, Math.floor(project.duration));
    }, [project?.duration]);

    const selectedTimeframeDurationSec = useMemo(() => {
        return Math.max(1, timeframeEndSec - timeframeStartSec);
    }, [timeframeEndSec, timeframeStartSec]);

    const clipLengthBounds = useMemo(() => getClipLengthBounds(clipLength), [clipLength]);

    const targetClipDurationSec = useMemo(() => {
        return getTargetClipDurationSec(selectedTimeframeDurationSec, clipLengthBounds);
    }, [clipLengthBounds, selectedTimeframeDurationSec]);

    const estimatedClipCount = useMemo(() => {
        if (clippingMode === 'skip') return 1;
        return Math.max(1, Math.min(MAX_GENERATED_CLIPS, Math.ceil(selectedTimeframeDurationSec / targetClipDurationSec)));
    }, [clippingMode, selectedTimeframeDurationSec, targetClipDurationSec]);

    const qualityLabel = useMemo(() => {
        if (project.resolution?.height) return `${project.resolution.height}p`;
        if (project.sourceType === 'link') return 'Auto';
        return 'Original';
    }, [project.resolution?.height, project.sourceType]);

    const sourceLabel = project.sourceType === 'link'
        ? (project.sourceUrl || project.fileName || project.name)
        : (project.fileName || project.name);
    const isLinkSource = project.sourceType === 'link';
    const previewSrc = resolvedPreviewSrc || project.filePath || '';
    const displayProgressPercent = sourcePreparing
        ? sourcePrepareProgress
        : workflowStage === 'setup'
            ? setupPage === 'reframe' ? 14 : 0
            : progressPercent;
    const animationStateClass = sourcePreparing || isGenerating || (workflowStage === 'subtitles' && subtitleProgressCount < subtitleTargetCount)
        ? 'is-animating'
        : readyClipCount > 0 && (workflowStage !== 'subtitles' || subtitleProgressCount >= subtitleTargetCount)
            ? 'is-complete'
            : 'is-idle';

    const activeStepIndex = useMemo(() => {
        if (clippingMode === 'skip') {
            if (workflowStage === 'setup') return 0;
            if (sourcePreparing) return 0;
            if (workflowStage === 'subtitles') {
                return subtitleTargetCount > 0 && subtitleProgressCount >= subtitleTargetCount ? 3 : 2;
            }
            if (readyClipCount > 0 && !isGenerating && displayProgressPercent >= 100) return 3;
            return 1;
        }

        if (workflowStage === 'setup') return setupPage === 'reframe' ? 1 : 0;
        if (sourcePreparing) return 0;
        if (workflowStage === 'subtitles') {
            return subtitleTargetCount > 0 && subtitleProgressCount >= subtitleTargetCount ? 6 : 5;
        }
        if (readyClipCount > 0 && !isGenerating && displayProgressPercent >= 100) return 6;
        if (displayProgressPercent >= 78) return 4;
        if (displayProgressPercent >= 52) return 3;
        return 2;
    }, [clippingMode, displayProgressPercent, isGenerating, readyClipCount, setupPage, sourcePreparing, subtitleProgressCount, subtitleTargetCount, workflowStage]);

    const sourceTransferProgress = useMemo(() => {
        if (sourcePreparing) return sourcePrepareProgress;
        if (!isLinkSource) return 100;
        if (progressPercent <= 0) return autoStart ? 6 : 0;
        if (activeStepIndex === 0) return Math.min(100, Math.round(progressPercent * 3.5));
        return 100;
    }, [activeStepIndex, autoStart, isLinkSource, progressPercent, sourcePrepareProgress, sourcePreparing]);

    const downloadedBytes = useMemo(() => {
        return Math.min(project.fileSize, Math.round(project.fileSize * (sourceTransferProgress / 100)));
    }, [project.fileSize, sourceTransferProgress]);

    const processSummary = useMemo(() => {
        if (sourcePreparing) return 'Locking in the source, cutting the selected range, and getting the clipping graph ready.';
        if (workflowStage === 'subtitles') {
            if (subtitleTargetCount <= 0) return 'Preparing the subtitle pass for your new clips.';
            if (subtitleProgressCount >= subtitleTargetCount) return `Subtitles added to ${subtitleTargetCount} clips. Opening results next.`;
            return subtitleStatusText;
        }
        if (clippingMode === 'skip' && !isGenerating && readyClipCount <= 0) {
            return 'Manual mode keeps the selected range as one subtitled output instead of splitting it into clips.';
        }
        if (isGenerating) return progressText;
        if (readyClipCount > 0) return `${readyClipCount} clips are ready for review.`;
        return 'Queued to cut the selected source range first, then split that result into short, ranked clip drafts.';
    }, [clippingMode, isGenerating, progressText, readyClipCount, sourcePreparing, subtitleProgressCount, subtitleStatusText, subtitleTargetCount, workflowStage]);

    const subtitleFlowSummary = useMemo(() => {
        const selectedRangeLabel = formatDuration(selectedTimeframeDurationSec);
        const clipTargetLabel = formatDuration(targetClipDurationSec);
        const clipCountLabel = subtitleTargetCount || processClips.length || estimatedClipCount;

        if (clippingMode === 'skip') {
            return `Selected range ${selectedRangeLabel} -> full output -> subtitles -> results`;
        }

        return `Selected range ${selectedRangeLabel} -> clip drafts up to ${clipTargetLabel} -> ${clipCountLabel} clips -> subtitles -> results`;
    }, [clippingMode, estimatedClipCount, processClips.length, selectedTimeframeDurationSec, subtitleTargetCount, targetClipDurationSec]);

    const subtitleProgressPercent = useMemo(() => {
        if (subtitleTargetCount <= 0) return 0;
        return Math.round((subtitleProgressCount / subtitleTargetCount) * 100);
    }, [subtitleProgressCount, subtitleTargetCount]);

    const subtitleProgressIsMeasured = useMemo(() => {
        return subtitlePhase === 'applying' || subtitlePhase === 'complete';
    }, [subtitlePhase]);

    const subtitleActiveCount = useMemo(() => {
        if (workflowStage !== 'subtitles' || subtitleTargetCount <= 0 || subtitleProgressCount >= subtitleTargetCount) {
            return 0;
        }

        return subtitlePhase === 'transcribing' || subtitlePhase === 'applying' ? 1 : 0;
    }, [subtitlePhase, subtitleProgressCount, subtitleTargetCount, workflowStage]);

    const subtitleQueuedCount = useMemo(() => {
        if (subtitleTargetCount <= 0) return 0;
        return Math.max(0, subtitleTargetCount - subtitleProgressCount - subtitleActiveCount);
    }, [subtitleActiveCount, subtitleProgressCount, subtitleTargetCount]);

    const subtitleHeroTitle = useMemo(() => {
        if (subtitleTargetCount <= 0) return 'Preparing subtitle pass';
        if (subtitleProgressCount >= subtitleTargetCount) return 'Subtitle pass complete';
        if (subtitlePhase === 'transcribing') return 'Waiting for source transcript';
        if (subtitleProgressCount === 0) return `Preparing ${subtitleTargetCount} clips for subtitles`;
        return `Processing clip ${Math.min(subtitleProgressCount + 1, subtitleTargetCount)} of ${subtitleTargetCount}`;
    }, [subtitlePhase, subtitleProgressCount, subtitleTargetCount]);

    const subtitleElapsedLabel = useMemo(() => {
        if (workflowStage !== 'subtitles' || !subtitleStageStartedAt) return '0:00';
        return formatElapsedClock(Math.max(0, subtitleNow - subtitleStageStartedAt));
    }, [subtitleNow, subtitleStageStartedAt, workflowStage]);

    const subtitleProgressLabel = useMemo(() => {
        if (subtitleTargetCount <= 0) return 'Preparing subtitle work...';
        if (!subtitleProgressIsMeasured) return 'Progress becomes measurable after the source transcript is ready.';
        if (subtitleProgressCount >= subtitleTargetCount) return `${subtitleTargetCount} of ${subtitleTargetCount} clips finished.`;
        return `${subtitleProgressCount} of ${subtitleTargetCount} clips finished.`;
    }, [subtitleProgressCount, subtitleProgressIsMeasured, subtitleTargetCount]);

    const isManualClipping = clippingMode === 'skip';
    const effectiveAspectRatio = useMemo<(typeof ASPECT_RATIOS)[number]>(() => {
        if (clippingMode === 'skip') {
            return deriveClosestAspectRatio(project.resolution?.width ?? 0, project.resolution?.height ?? 0);
        }
        return aspectRatio;
    }, [aspectRatio, clippingMode, project.resolution?.height, project.resolution?.width]);
    const selectedCaptionStyle = useMemo<CaptionStyleTone | null>(() => {
        return WORKFLOW_CAPTION_PRESET_OPTIONS.find((option) => option.templateId === selectedWorkflowCaptionId)?.styleId ?? null;
    }, [selectedWorkflowCaptionId]);
    const displayedProcessSteps = isManualClipping ? MANUAL_PROCESS_STEPS : PROCESS_STEPS;

    const selectedAspectOption = useMemo(() => {
        return ASPECT_RATIO_OPTIONS.find((option) => option.id === effectiveAspectRatio) ?? ASPECT_RATIO_OPTIONS[0];
    }, [effectiveAspectRatio]);

    const previewCropResolutionLabel = useMemo(() => {
        const width = project.resolution?.width ?? 0;
        const height = project.resolution?.height ?? 0;
        if (!width || !height) return 'Auto';

        const [ratioWidth, ratioHeight] = effectiveAspectRatio.split(':').map(Number);
        const targetRatio = ratioWidth / ratioHeight;
        const sourceRatio = width / height;

        let cropWidth = width;
        let cropHeight = height;

        if (sourceRatio > targetRatio) {
            cropWidth = Math.round(height * targetRatio);
            cropHeight = height;
        } else {
            cropWidth = width;
            cropHeight = Math.round(width / targetRatio);
        }

        return `${cropWidth}×${cropHeight}`;
    }, [effectiveAspectRatio, project.resolution?.height, project.resolution?.width]);

    const processSceneShouldStayLight = workflowStage === 'processing';
    const processSceneSourceThumbnail = processSourceThumbnail;

    useEffect(() => {
        setWorkflowStage(autoStart || sourcePreparing ? 'processing' : 'setup');
        setSetupPage('source');
        setIsGenerating(false);
        setProgressPercent(0);
        setProgressText('Waiting to start');
        setReadyClipCount(0);
        setProcessClips([]);
        setSourcePrepareProgress(12);
        setPreviewState(project.filePath ? 'idle' : 'error');
        setPreviewDurationSec(0);
        setPreviewCurrentSec(0);
        setPreviewPlaying(false);
        setProcessSourceThumbnail(project.thumbnailUrl);
        setResolvedPreviewSrc(project.filePath || '');
        setPreviewBlobLoaded(false);
        setSubtitleProgressCount(0);
        setSubtitleTargetCount(0);
        setSubtitleStatusText('Queued after clip drafting.');
        setSubtitlePhase('preparing');
        setSubtitleStageStartedAt(null);
        setSubtitleNow(Date.now());
        setWorkflowReframeResult(null);
        if (previewBlobUrlRef.current) {
            if (previewBlobUrlRef.current.startsWith('blob:')) {
                URL.revokeObjectURL(previewBlobUrlRef.current);
            }
            previewBlobUrlRef.current = null;
        }
        if (thumbnailBlobUrlRef.current) {
            URL.revokeObjectURL(thumbnailBlobUrlRef.current);
            thumbnailBlobUrlRef.current = null;
        }
        previewPlayOnLoadRef.current = false;
        autoRunRef.current = null;
    }, [autoStart, project.filePath, project.id, sourcePreparing]);

    useEffect(() => {
        let cancelled = false;

        const assignThumbnailUrl = (nextUrl: string | undefined) => {
            if (cancelled) return;
            setProcessSourceThumbnail(nextUrl);
        };

        const loadDesktopThumbnail = async () => {
            try {
                const blobUrl = await loadProjectThumbnailBlobUrl(project.id);
                if (cancelled) {
                    URL.revokeObjectURL(blobUrl);
                    return;
                }
                if (thumbnailBlobUrlRef.current) {
                    URL.revokeObjectURL(thumbnailBlobUrlRef.current);
                }
                thumbnailBlobUrlRef.current = blobUrl;
                assignThumbnailUrl(blobUrl);
                return true;
            } catch (error) {
                console.error('Failed to load project thumbnail blob', error);
                return false;
            }
        };

        if (isTauri()) {
            void loadDesktopThumbnail().then((loaded) => {
                if (!loaded && project.thumbnailUrl) {
                    assignThumbnailUrl(project.thumbnailUrl);
                }
            });
        } else if (project.thumbnailUrl) {
            assignThumbnailUrl(project.thumbnailUrl);
            return () => {
                cancelled = true;
            };
        } else {
            assignThumbnailUrl(undefined);
        }

        if (!isTauri()) {
            return () => {
                cancelled = true;
            };
        }

        void ensureProjectThumbnail(project.id)
            .then((updatedProject) => {
                if (cancelled) return;
                if (thumbnailBlobUrlRef.current) return;
                setProcessSourceThumbnail(updatedProject.thumbnailUrl);
            })
            .catch((error) => {
                console.error('Failed to ensure project thumbnail', error);
            });

        return () => {
            cancelled = true;
        };
    }, [project.id, project.thumbnailUrl]);

    useEffect(() => {
        if (workflowStage !== 'subtitles' || subtitleProgressCount >= subtitleTargetCount) {
            return;
        }

        const interval = window.setInterval(() => {
            setSubtitleNow(Date.now());
        }, 1000);

        return () => window.clearInterval(interval);
    }, [subtitleProgressCount, subtitleTargetCount, workflowStage]);

    useEffect(() => {
        setTimeframeStartSec(0);
        setTimeframeEndSec(maxDurationSec);
    }, [maxDurationSec, project.id]);

    useEffect(() => {
        if (clippingMode === 'skip' && setupPage === 'reframe') {
            setSetupPage('source');
        }
    }, [clippingMode, setupPage]);

    useEffect(() => {
        if (!sourcePreparing) return;
        const interval = window.setInterval(() => {
            setSourcePrepareProgress((current) => Math.min(86, current + Math.max(3, (86 - current) * 0.14)));
        }, 180);
        return () => window.clearInterval(interval);
    }, [sourcePreparing]);

    useEffect(() => {
        let cancelled = false;

        void listProjectClips(project.id)
            .then((clips) => {
                if (cancelled) return;
                setProcessClips(clips);
                if (!isGenerating) {
                    setReadyClipCount(clips.length);
                }
            })
            .catch((error) => {
                console.error('Failed to load project clips', error);
            });

        return () => {
            cancelled = true;
        };
    }, [isGenerating, project.id]);

    const handleRemoveSource = () => {
        setRemoveConfirmOpen(true);
    };

    const handleConfirmRemoveSource = () => {
        setRemoveConfirmOpen(false);
        onProjectDeleted(project.id);
    };

    const handlePreviewLoaded = () => {
        const video = previewVideoRef.current;
        if (!video) return;
        setPreviewState('ready');
        setPreviewDurationSec(Number.isFinite(video.duration) ? video.duration : 0);
        setPreviewCurrentSec(video.currentTime || 0);
        if (previewPlayOnLoadRef.current) {
            previewPlayOnLoadRef.current = false;
            void video.play().catch((error) => {
                console.error('Preview play after load failed', error);
            });
        }
    };

    const handlePreviewTimeUpdate = () => {
        const video = previewVideoRef.current;
        if (!video) return;
        setPreviewCurrentSec(video.currentTime || 0);
    };

    const togglePreviewPlayback = async () => {
        const video = previewVideoRef.current;
        if (!previewBlobLoaded) {
            setPreviewState('loading');
            previewPlayOnLoadRef.current = true;
            try {
                const previewUrl = isTauri()
                    ? await prepareProjectPreviewUrl(project.id)
                    : (project.filePath || '');

                if (!previewUrl) {
                    throw new Error('Preview URL is missing.');
                }

                if (previewBlobUrlRef.current?.startsWith('blob:')) {
                    URL.revokeObjectURL(previewBlobUrlRef.current);
                }
                previewBlobUrlRef.current = previewUrl;
                setResolvedPreviewSrc(previewUrl);
                setPreviewBlobLoaded(true);
            } catch (error) {
                console.error('Preview preparation failed', error);

                if (project.filePath) {
                    setResolvedPreviewSrc(project.filePath);
                    setPreviewBlobLoaded(true);
                    return;
                }

                previewPlayOnLoadRef.current = false;
                setPreviewState('error');
            }
            return;
        }
        if (!video) return;
        if (video.paused) {
            try {
                await video.play();
                setPreviewPlaying(true);
            } catch (error) {
                console.error('Preview play failed', error);
            }
            return;
        }
        video.pause();
        setPreviewPlaying(false);
    };

    const handlePreviewSeek = (event: ChangeEvent<HTMLInputElement>) => {
        const video = previewVideoRef.current;
        if (!video) return;
        const nextTime = Number(event.target.value);
        video.currentTime = nextTime;
        setPreviewCurrentSec(nextTime);
    };

    const handlePreviewError = () => {
        setPreviewState('error');
    };

    const updateTimeframeHandleFromClientX = useCallback((clientX: number, handle: 'start' | 'end') => {
        const rail = timeframeRailRef.current;
        if (!rail) return;

        const rect = rail.getBoundingClientRect();
        if (rect.width <= 0) return;

        const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        const nextValue = Math.round(ratio * maxDurationSec);

        if (handle === 'start') {
            setTimeframeStartSec(Math.min(nextValue, Math.max(0, timeframeEndSec - 1)));
            return;
        }

        setTimeframeEndSec(Math.max(nextValue, Math.min(maxDurationSec, timeframeStartSec + 1)));
    }, [maxDurationSec, timeframeEndSec, timeframeStartSec]);

    const handleTimeframeHandlePointerDown = useCallback((handle: 'start' | 'end') => (event: ReactPointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setActiveTimeframeHandle(handle);
        updateTimeframeHandleFromClientX(event.clientX, handle);
    }, [updateTimeframeHandleFromClientX]);

    const handleTimeframeRailPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
        const rail = timeframeRailRef.current;
        if (!rail) return;

        const rect = rail.getBoundingClientRect();
        const startX = rect.left + (timeframeStartSec / maxDurationSec) * rect.width;
        const endX = rect.left + (timeframeEndSec / maxDurationSec) * rect.width;
        const handle = Math.abs(event.clientX - startX) <= Math.abs(event.clientX - endX) ? 'start' : 'end';

        setActiveTimeframeHandle(handle);
        updateTimeframeHandleFromClientX(event.clientX, handle);
    }, [maxDurationSec, timeframeEndSec, timeframeStartSec, updateTimeframeHandleFromClientX]);

    const handleTimeframeHandleKeyDown = useCallback((handle: 'start' | 'end') => (event: ReactKeyboardEvent<HTMLButtonElement>) => {
        const step = event.shiftKey ? 5 : 1;

        if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault();
            if (handle === 'start') {
                setTimeframeStartSec((current) => Math.max(0, Math.min(current - step, timeframeEndSec - 1)));
            } else {
                setTimeframeEndSec((current) => Math.max(timeframeStartSec + 1, current - step));
            }
        }

        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (handle === 'start') {
                setTimeframeStartSec((current) => Math.min(current + step, Math.max(0, timeframeEndSec - 1)));
            } else {
                setTimeframeEndSec((current) => Math.min(maxDurationSec, Math.max(timeframeStartSec + 1, current + step)));
            }
        }
    }, [maxDurationSec, timeframeEndSec, timeframeStartSec]);

    const handlePreviewVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const video = previewVideoRef.current;
        const nextVolume = Number(event.target.value);
        setPreviewVolume(nextVolume);
        if (!video) return;
        video.volume = nextVolume;
        video.muted = nextVolume <= 0;
    };

    useEffect(() => {
        const video = previewVideoRef.current;
        if (!video) return;
        video.volume = previewVolume;
        video.muted = previewVolume <= 0;
    }, [previewState, previewSrc, previewVolume]);

    useEffect(() => {
        if (!activeTimeframeHandle) return;

        const handlePointerMove = (event: PointerEvent) => {
            event.preventDefault();
            updateTimeframeHandleFromClientX(event.clientX, activeTimeframeHandle);
        };

        const handlePointerUp = () => {
            setActiveTimeframeHandle(null);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };
    }, [activeTimeframeHandle, updateTimeframeHandleFromClientX]);

    const canStartProcessing = useCallback(() => {
        const sourcePathForGeneration = project.sourcePath ?? project.filePath;
        if (!isTauri() && (!sourcePathForGeneration || sourcePathForGeneration.startsWith('blob:'))) {
            alert('Web workflow clipping supports imported links or persisted files only. Upload a local file in desktop mode or import from link first.');
            return false;
        }
        return true;
    }, [project.filePath, project.sourcePath]);

    const handleGenerate = useCallback(async () => {
        if (isGenerating || sourcePreparing) return;
        if (!canStartProcessing()) return;

        const sourcePathForGeneration = workflowReframeResult?.outputPath || project.sourcePath || project.filePath;

        try {
            setIsGenerating(true);
            setProgressPercent(8);
            setProgressText(
                clippingMode === 'skip'
                    ? 'Preparing the selected source range for one manual clip...'
                    : workflowReframeResult?.outputPath
                        ? 'Loading speaker-tracked source and indexing frames...'
                        : isLinkSource
                            ? 'Downloading source and locking selected quality...'
                            : 'Reading upload metadata and indexing frames...'
            );
            setReadyClipCount(0);
            setProcessClips([]);

            const timeframeStartMs = timeframeStartSec * 1000;
            const timeframeEndMs = timeframeEndSec * 1000;
            const selectedRangeDurationMs = Math.max(1000, timeframeEndMs - timeframeStartMs);
            let workingSourcePath = sourcePathForGeneration;
            let workingSourceDurationSec = selectedTimeframeDurationSec;
            let usingPreparedSource = false;

            if (isTauri() && project.sourcePath && !workflowReframeResult?.outputPath) {
                setProgressPercent(18);
                setProgressText(`Cutting the selected ${formatDuration(selectedTimeframeDurationSec)} range into a working source first...`);
                const preparedSource = await prepareProcessingSource({
                    projectId: project.id,
                    startMs: timeframeStartMs,
                    endMs: timeframeEndMs,
                });
                workingSourcePath = preparedSource.sourcePath;
                workingSourceDurationSec = Math.max(1, Math.round(preparedSource.durationSec));
                usingPreparedSource = true;
                if (preparedSource.thumbnailUrl) {
                    setProcessSourceThumbnail(preparedSource.thumbnailUrl);
                }

                void transcribeSource({
                    projectId: project.id,
                    videoPath: project.sourcePath,
                    modelSize: 'medium',
                    startMs: timeframeStartMs,
                    endMs: timeframeEndMs,
                }).catch((error) => {
                    console.error('Background transcription failed', error);
                });
            }

            await clearProjectClips(project.id);
            onClipsReady([]);
            await pause(isLinkSource ? 550 : 320);

            setProgressPercent(28);
            setProgressText(clippingMode === 'skip'
                ? 'Selected range is ready. Keeping it as one full output...'
                : 'Selected range is ready. Building crop map and scene rhythm from that trimmed source...');
            await pause(420);

            setProgressPercent(54);
            setProgressText(clippingMode === 'skip'
                ? 'Rendering one full-range output with your selected aspect ratio...'
                : 'Scanning hooks, topic shifts, and standout moments...');
            await pause(420);

            const generated: ClipSuggestion[] = [];
            const clipDurationSec = Math.min(targetClipDurationSec, workingSourceDurationSec);
            const clipMs = Math.max(1000, clipDurationSec * 1000);
            const totalToGenerate = clippingMode === 'skip'
                ? 1
                : Math.max(
                    1,
                    Math.min(MAX_GENERATED_CLIPS, Math.ceil(selectedRangeDurationMs / clipMs))
                );

            for (let i = 1; i <= totalToGenerate; i += 1) {
                const relativeClipStart = clippingMode === 'skip'
                    ? 0
                    : (i - 1) * clipMs;
                const relativeClipEnd = clippingMode === 'skip'
                    ? selectedRangeDurationMs
                    : Math.min(relativeClipStart + clipMs, selectedRangeDurationMs);
                const absoluteClipStart = timeframeStartMs + relativeClipStart;
                const absoluteClipEnd = timeframeStartMs + relativeClipEnd;
                const clipStart = usingPreparedSource ? relativeClipStart : absoluteClipStart;
                const clipEnd = usingPreparedSource ? relativeClipEnd : absoluteClipEnd;
                if (clipEnd <= clipStart) break;

                setProgressText(clippingMode === 'skip'
                    ? 'Finalizing the trimmed source as one subtitle-ready output...'
                    : `Drafting clip ${i}/${totalToGenerate} from the trimmed source and scoring it for review...`);

                const persisted = await generateClipNative({
                    projectId: project.id,
                    sourcePath: workingSourcePath,
                    startMs: clipStart,
                    endMs: clipEnd,
                    timelineStartMs: absoluteClipStart,
                    timelineEndMs: absoluteClipEnd,
                    index: i,
                    hook: clippingMode === 'skip'
                        ? `${project.name} full video output`
                        : `${project.name} moment ${i}`,
                    reason: clippingMode === 'skip'
                        ? 'Selected range trimmed first • full output • subtitle-ready'
                        : 'Selected range trimmed first • smart crop map • hook scan • review ready',
                    score: clippingMode === 'skip' ? 10 : Math.max(6, 10 - i),
                    selected: clippingMode === 'skip' ? true : i <= 3,
                    aspectRatio: effectiveAspectRatio,
                    burnSubtitles: false,
                });

                generated.push({
                    ...persisted,
                    aspectRatio: effectiveAspectRatio,
                    captionStyle: selectedCaptionStyle ?? undefined,
                });
                setProcessClips([...generated]);
                onClipsReady([...generated]);
                setReadyClipCount(generated.length);

                setProgressPercent(72 + Math.round((generated.length / totalToGenerate) * 24));
            }

            if (!generated.length) {
                alert('No clips were generated from this source.');
                setProgressPercent(0);
                setProgressText('No draft clips were created.');
                return;
            }

            setWorkflowStage('subtitles');
            setSubtitleTargetCount(generated.length);
            setSubtitleProgressCount(0);
            setSubtitlePhase('preparing');
            setSubtitleStageStartedAt(Date.now());
            setSubtitleNow(Date.now());
            setProgressPercent(86);
            setProgressText('Clip drafting finished. Starting subtitle pass...');
            setSubtitleStatusText(`Transcribing the selected ${formatEta(selectedTimeframeDurationSec * 1000)} source range once so subtitles can sync across every clip...`);
            await pause(180);

            if (isTauri()) {
                setSubtitlePhase('transcribing');
                let transcript = await getProjectTranscript(project.id);

                const transcriptCoversSelection = Boolean(
                    transcript
                    && (transcript.sourceStartMs ?? 0) <= timeframeStartMs
                    && (transcript.sourceEndMs ?? Number.MAX_SAFE_INTEGER) >= timeframeEndMs
                );

                if (!transcript || transcript.status === 'error' || !transcriptCoversSelection) {
                    transcript = await transcribeSource({
                        projectId: project.id,
                        videoPath: project.sourcePath,
                        modelSize: 'medium',
                    startMs: timeframeStartMs,
                    endMs: timeframeEndMs,
                });
                }

                while (transcript?.status === 'processing') {
                    setSubtitleStatusText('Selected source range transcript is still processing. Preparing subtitle overlays for each clip next...');
                    await pause(2500);
                    transcript = await getProjectTranscript(project.id);
                }
            }

            setSubtitlePhase('applying');
            for (let index = 0; index < generated.length; index += 1) {
                setSubtitleStatusText(`Syncing subtitles to clip ${index + 1}/${generated.length}...`);
                await pause(120);
                setProcessClips([...generated]);
                onClipsReady([...generated]);
                setSubtitleProgressCount(index + 1);
                setProgressPercent(86 + Math.round(((index + 1) / generated.length) * 14));
            }

            setSubtitlePhase('complete');
            setProgressPercent(100);
            setProgressText(clippingMode === 'skip'
                ? 'Done. Full output is ready with synced subtitles.'
                : `Done. ${generated.length} clips are ready with synced subtitles.`);
            setSubtitleStatusText(`Subtitles are ready on ${generated.length} clips. Opening results...`);
            window.setTimeout(() => {
                onOpenClipsList();
            }, 420);
        } catch (err) {
            console.error(err);
            alert(`Workflow failed: ${err}`);
            setProgressText('The run stopped before clips were ready.');
        } finally {
            setIsGenerating(false);
        }
    }, [canStartProcessing, clippingMode, effectiveAspectRatio, isGenerating, isLinkSource, onClipsReady, onOpenClipsList, project.filePath, project.id, project.name, project.sourcePath, selectedCaptionStyle, selectedTimeframeDurationSec, sourcePreparing, targetClipDurationSec, timeframeEndSec, timeframeStartSec, workflowReframeResult?.outputPath]);

    const handleStartClipping = useCallback(() => {
        if (!canStartProcessing()) return;
        setWorkflowStage('processing');
        void handleGenerate();
    }, [canStartProcessing, handleGenerate]);

    useEffect(() => {
        if (!autoStart || sourcePreparing) return;
        if (autoRunRef.current === project.id) return;
        autoRunRef.current = project.id;
        setWorkflowStage('processing');
        onAutoStartConsumed?.();
        void handleGenerate();
    }, [autoStart, handleGenerate, onAutoStartConsumed, project.id, sourcePreparing]);

    return (
        <div className={`workflow-page ${workflowStage === 'processing' ? 'workflow-page-processing' : ''}`}>
            {removeConfirmOpen && (
                <div className="workflow-confirm-backdrop" onClick={() => setRemoveConfirmOpen(false)}>
                    <section className="workflow-confirm-modal" onClick={(event) => event.stopPropagation()}>
                        <div className="workflow-confirm-copy">
                            <span>Remove source</span>
                            <h3>Delete this imported video?</h3>
                            <p>
                                This removes <strong>{project.name}</strong> from ClipForge, deletes any generated clips for it,
                                and takes you back to the upload screen.
                            </p>
                        </div>
                        <div className="workflow-confirm-actions">
                            <button
                                type="button"
                                className="workflow-secondary-btn"
                                onClick={() => setRemoveConfirmOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="workflow-remove-confirm-btn"
                                onClick={handleConfirmRemoveSource}
                            >
                                Remove source
                            </button>
                        </div>
                    </section>
                </div>
            )}
            <div className={`workflow-shell ${workflowStage !== 'setup' ? 'workflow-shell-processing' : ''}`}>
                <section className="workflow-stepper-card">
                    <div className="workflow-stepper-head">
                        <div>
                            <span className="workflow-stepper-kicker">
                                {workflowStage === 'setup'
                                    ? (isManualClipping ? 'Manual Clip Flow' : 'ClipForge Flow')
                                    : (isManualClipping ? 'Manual Processing' : 'AI Processing')}
                            </span>
                            <h2>
                                {workflowStage === 'setup'
                                    ? isManualClipping
                                        ? 'Trim one source range, keep one output, and apply your subtitle style'
                                        : setupPage === 'reframe'
                                            ? 'Find the speaker and crop for Shorts before clip analysis starts'
                                            : 'Fresh workflow, not an Opus clone'
                                    : isManualClipping
                                        ? 'Watch the selected range turn into one subtitled result'
                                        : 'Watch the source break into clips in real time'}
                            </h2>
                        </div>
                        <div className="workflow-stepper-meta">
                            <span>{displayProgressPercent}% complete</span>
                            <span>
                                {workflowStage === 'setup'
                                    ? isManualClipping
                                        ? 'Source, timeframe, and subtitle style are ready for one manual output'
                                        : setupPage === 'reframe'
                                            ? workflowReframeResult
                                                ? 'Speaker crop is ready and will feed the clipping pass'
                                                : 'Run speaker detection now so ClipForge crops around the active speaker first'
                                            : 'Source checked and ready for the next step'
                                    : processSummary}
                            </span>
                        </div>
                    </div>

                    <div className="workflow-stepper-track">
                        {displayedProcessSteps.map((step, index) => {
                            const status = index < activeStepIndex ? 'complete' : index === activeStepIndex ? 'active' : 'pending';
                            return (
                                <div key={step.id} className="workflow-stepper-item">
                                    <div className={`workflow-stepper-node ${status}`}>
                                        {status === 'complete' ? <CircleCheckBig size={14} /> : <span>{index + 1}</span>}
                                    </div>
                                    {index < displayedProcessSteps.length - 1 && (
                                        <div className={`workflow-stepper-line ${index < activeStepIndex ? 'complete' : index === activeStepIndex ? 'active' : ''}`} />
                                    )}
                                    <div className="workflow-stepper-copy">
                                        <strong>{step.title}</strong>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {workflowStage === 'setup' && setupPage === 'source' ? (
                    <>
                        <section className="workflow-source-card">
                            <div className="workflow-card-topbar">
                                <div className="workflow-card-label">
                                    {isLinkSource ? <Link2 size={15} /> : <Upload size={15} />}
                                    Source intake
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveSource}
                                    className="workflow-remove-btn"
                                    title="Remove this imported source and return to the home upload screen."
                                >
                                    <Trash2 size={14} />
                                    Remove source
                                </button>
                            </div>

                            <h3>{project.name}</h3>
                            <p>{sourceLabel}</p>

                            <div className="workflow-source-meta-grid">
                                <div>
                                    <span>Source type</span>
                                    <strong>{isLinkSource ? 'Link import' : 'Local upload'}</strong>
                                </div>
                                <div>
                                    <span>Selected quality</span>
                                    <strong>{qualityLabel}</strong>
                                </div>
                                <div>
                                    <span>Expected size</span>
                                    <strong>{formatFileSize(project.fileSize)}</strong>
                                </div>
                            </div>

                            <div className="workflow-transfer-card">
                                <div className="workflow-transfer-head">
                                    <span><Download size={14} /> {sourcePreparing ? 'Downloading link source' : isLinkSource ? 'Import progress' : 'Upload synced'}</span>
                                    <strong>{formatFileSize(downloadedBytes)} / {formatFileSize(project.fileSize)}</strong>
                                </div>
                                <div className="workflow-transfer-bar">
                                    <div className="workflow-transfer-fill" style={{ width: `${sourceTransferProgress}%` }} />
                                </div>
                                <small>
                                    {sourcePreparing
                                        ? 'This opens the stepper page right away, then completes the source download in the background.'
                                        : isLinkSource
                                            ? 'Quality is shown under the link input before this page, then mirrored here while import runs.'
                                            : 'Your file is already local, so processing can move straight into analysis.'}
                                </small>
                            </div>
                        </section>

                        <section className="workflow-preview-card">
                            <div className="workflow-card-topbar">
                                <div className="workflow-card-label">
                                    <Film size={15} />
                                    Source preview
                                </div>
                                <span className="workflow-preview-pill">{qualityLabel}</span>
                            </div>

                            <div className="workflow-preview-frame">
                                {!sourcePreparing ? (
                                    <>
                                        <div className="workflow-preview-stage" data-ratio={effectiveAspectRatio}>
                                            {previewBlobLoaded && previewSrc ? (
                                                <video
                                                    key={previewSrc}
                                                    ref={previewVideoRef}
                                                    src={previewSrc}
                                                    playsInline
                                                    preload="metadata"
                                                    onLoadStart={() => setPreviewState('loading')}
                                                    onLoadedMetadata={handlePreviewLoaded}
                                                    onTimeUpdate={handlePreviewTimeUpdate}
                                                    onPlay={() => setPreviewPlaying(true)}
                                                    onPause={() => setPreviewPlaying(false)}
                                                    onError={handlePreviewError}
                                                />
                                            ) : processSourceThumbnail ? (
                                                <img
                                                    src={processSourceThumbnail}
                                                    alt={`${project.name} source preview`}
                                                    className="workflow-preview-thumbnail"
                                                />
                                            ) : null}
                                        </div>
                                        {previewState === 'ready' && previewBlobLoaded ? (
                                            <div className="workflow-preview-controls">
                                                <button
                                                    type="button"
                                                    className="workflow-preview-control-btn"
                                                    onClick={() => void togglePreviewPlayback()}
                                                    title={previewPlaying ? 'Pause source preview' : 'Play source preview'}
                                                >
                                                    {previewPlaying ? <Pause size={15} /> : <Play size={15} />}
                                                </button>
                                                <span className="workflow-preview-time">{formatPreviewClock(previewCurrentSec)}</span>
                                                <label className="workflow-preview-progress">
                                                    <input
                                                        type="range"
                                                        min={0}
                                                        max={Math.max(previewDurationSec, 0.1)}
                                                        step={0.1}
                                                        value={Math.min(previewCurrentSec, previewDurationSec || 0)}
                                                        onChange={handlePreviewSeek}
                                                        aria-label="Seek source preview"
                                                    />
                                                    <span
                                                        className="workflow-preview-progress-fill"
                                                        style={{
                                                            width: `${previewDurationSec > 0 ? (previewCurrentSec / previewDurationSec) * 100 : 0}%`
                                                        }}
                                                    />
                                                </label>
                                                <span className="workflow-preview-time">{formatPreviewClock(previewDurationSec)}</span>
                                                <label className="workflow-preview-volume" aria-label="Source preview volume">
                                                    <span className="workflow-preview-volume-icon" aria-hidden="true">
                                                        {previewVolume <= 0 ? (
                                                            <VolumeX size={14} />
                                                        ) : previewVolume < 0.5 ? (
                                                            <Volume1 size={14} />
                                                        ) : (
                                                            <Volume2 size={14} />
                                                        )}
                                                    </span>
                                                    <span className="workflow-preview-volume-slider">
                                                        <input
                                                            type="range"
                                                            min={0}
                                                            max={1}
                                                            step={0.01}
                                                            value={previewVolume}
                                                            onChange={handlePreviewVolumeChange}
                                                            aria-label="Adjust source preview volume"
                                                        />
                                                        <span
                                                            className="workflow-preview-volume-fill"
                                                            style={{ width: `${previewVolume * 100}%` }}
                                                        />
                                                    </span>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="workflow-preview-placeholder workflow-preview-placeholder-loading">
                                                {previewState === 'loading' ? (
                                                    <>
                                                        <span className="workflow-preview-spinner" aria-hidden="true" />
                                                        <strong>Loading source preview</strong>
                                                        <p>Hang tight while ClipForge prepares the video preview for playback.</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="workflow-preview-control-btn workflow-preview-overlay-play"
                                                            onClick={() => void togglePreviewPlayback()}
                                                            title="Load and play source preview"
                                                        >
                                                            <Play size={18} />
                                                        </button>
                                                        <strong>Source ready to preview</strong>
                                                        <p>ClipForge loaded a frame from your source. Press play to open the full preview.</p>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="workflow-preview-placeholder">
                                        <Download size={24} />
                                        <strong>Source is downloading</strong>
                                        <p>The preview appears as soon as the imported video file is ready.</p>
                                    </div>
                                )}

                                {previewSrc && !sourcePreparing && previewState === 'error' && (
                                    <div className="workflow-preview-placeholder workflow-preview-placeholder-error">
                                        <Film size={24} />
                                        <strong>Preview is still preparing</strong>
                                        <p>The source finished importing, but the preview could not open yet. Try again in a moment while the file settles.</p>
                                    </div>
                                )}
                            </div>

                            <div className="workflow-preview-stats">
                                <div>
                                    <span>Length</span>
                                    <strong>{formatDuration(project.duration)}</strong>
                                </div>
                                <div>
                                    <span>Draft target</span>
                                    <strong>{estimatedClipCount} clips</strong>
                                </div>
                                <div>
                                    <span>Resolution</span>
                                    <strong>{previewCropResolutionLabel}</strong>
                                </div>
                            </div>
                        </section>

                        <div className="workflow-config-card">
                            <div className="workflow-config-tabs">
                                <button
                                    type="button"
                                    className={`workflow-config-tab ${clippingMode === 'clip' ? 'active' : ''}`}
                                    onClick={() => setClippingMode('clip')}
                                >
                                    Let AI clip the video
                                </button>
                                <button
                                    type="button"
                                    className={`workflow-config-tab ${clippingMode === 'skip' ? 'active' : ''}`}
                                    onClick={() => setClippingMode('skip')}
                                >
                                    Manual clipping
                                </button>
                            </div>

                            {clippingMode === 'skip' && (
                                <div className="workflow-config-note">
                                    ClipForge will not split this video into multiple clips. It will keep the selected timeframe as one full output and carry subtitles across that full video.
                                </div>
                            )}

                            <div className="workflow-timeframe-card">
                                <div className="workflow-timeframe-head">
                                    <span>Processing timeframe</span>
                                    <span className="workflow-credit-pill">Credit saver</span>
                                </div>
                                <div
                                    ref={timeframeRailRef}
                                    className="workflow-timeframe-rail"
                                    onPointerDown={handleTimeframeRailPointerDown}
                                >
                                    <div
                                        className="workflow-timeframe-fill"
                                        style={{
                                            left: `${(timeframeStartSec / maxDurationSec) * 100}%`,
                                            width: `${((timeframeEndSec - timeframeStartSec) / maxDurationSec) * 100}%`
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="workflow-timeframe-handle left"
                                        style={{ left: `${(timeframeStartSec / maxDurationSec) * 100}%` }}
                                        aria-label="Adjust processing timeframe start"
                                        aria-valuemin={0}
                                        aria-valuemax={Math.max(0, timeframeEndSec - 1)}
                                        aria-valuenow={timeframeStartSec}
                                        onPointerDown={handleTimeframeHandlePointerDown('start')}
                                        onKeyDown={handleTimeframeHandleKeyDown('start')}
                                    />
                                    <button
                                        type="button"
                                        className="workflow-timeframe-handle right"
                                        style={{ left: `${(timeframeEndSec / maxDurationSec) * 100}%` }}
                                        aria-label="Adjust processing timeframe end"
                                        aria-valuemin={Math.min(maxDurationSec, timeframeStartSec + 1)}
                                        aria-valuemax={maxDurationSec}
                                        aria-valuenow={timeframeEndSec}
                                        onPointerDown={handleTimeframeHandlePointerDown('end')}
                                        onKeyDown={handleTimeframeHandleKeyDown('end')}
                                    />
                                </div>
                                <div className="workflow-timeframe-values">
                                    <strong>{formatTimeframeClock(timeframeStartSec)}</strong>
                                    <strong className="workflow-timeframe-selection">
                                        Clip selected: {formatDuration(selectedTimeframeDurationSec)}
                                    </strong>
                                    <strong>{formatTimeframeClock(timeframeEndSec)}</strong>
                                </div>
                            </div>

                            {clippingMode !== 'skip' && (
                                <>
                                    <div className="workflow-config-toolbar">
                                        <label>
                                            <span>Clip model</span>
                                            <div className="workflow-choice-group" role="group" aria-label="Clip model options">
                                                {CLIP_MODELS.map((option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        className={`workflow-choice-chip ${clipModel === option ? 'active' : ''}`}
                                                        onClick={() => setClipModel(option)}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </label>
                                        <label>
                                            <span>Genre</span>
                                            <div className="workflow-choice-group" role="group" aria-label="Genre options">
                                                {GENRE_OPTIONS.map((option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        className={`workflow-choice-chip ${clipGenre === option ? 'active' : ''}`}
                                                        onClick={() => setClipGenre(option)}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </label>
                                        <label>
                                            <span>Clip length</span>
                                            <div className="workflow-choice-group" role="group" aria-label="Clip length options">
                                                {LENGTH_OPTIONS.map((option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        className={`workflow-choice-chip ${clipLength === option ? 'active' : ''}`}
                                                        onClick={() => setClipLength(option)}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </label>
                                        <button
                                            type="button"
                                            className={`workflow-toggle ${autoHookEnabled ? 'active' : ''}`}
                                            onClick={() => setAutoHookEnabled((current) => !current)}
                                        >
                                            <span>Auto hook</span>
                                            <span className="workflow-toggle-switch">
                                                <span />
                                            </span>
                                        </button>
                                    </div>

                                    <div className="workflow-aspect-row">
                                        <div className="workflow-aspect-copy">
                                            <span>Choose aspect ratio</span>
                                        </div>
                                        <div className="workflow-aspect-copy workflow-aspect-copy-detail">
                                            <strong>{selectedAspectOption.label}</strong>
                                            <span>{selectedAspectOption.platforms}</span>
                                        </div>
                                    </div>

                                    <div className="workflow-aspect-buttons" role="group" aria-label="Aspect ratio options">
                                        {ASPECT_RATIO_OPTIONS.map((option) => (
                                            <button
                                                key={option.id}
                                                type="button"
                                                className={`workflow-aspect-button ${aspectRatio === option.id ? 'active' : ''}`}
                                                onClick={() => setAspectRatio(option.id)}
                                            >
                                                <div className="workflow-aspect-button-top">
                                                    <span className={`workflow-aspect-button-icon ${option.iconClassName}`}>
                                                        <option.icon size={18} />
                                                    </span>
                                                    <span className="workflow-aspect-button-ratio">{option.label}</span>
                                                </div>
                                                <span className="workflow-aspect-button-platforms">{option.platforms}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="workflow-config-presets">
                                {clippingMode !== 'skip' && (
                                    <div className="workflow-presets-tabs">
                                        <button
                                            type="button"
                                            className={`workflow-config-tab ${presetTab === 'quick' ? 'active' : ''}`}
                                            onClick={() => setPresetTab('quick')}
                                        >
                                            Quick presets
                                        </button>
                                        <button
                                            type="button"
                                            className={`workflow-config-tab ${presetTab === 'templates' ? 'active' : ''}`}
                                            onClick={() => setPresetTab('templates')}
                                        >
                                            My templates
                                        </button>
                                    </div>
                                )}

                                {clippingMode === 'skip' || presetTab === 'quick' ? (
                                    <div className="workflow-preset-surface">
                                        <div className="workflow-preset-label">Caption</div>
                                        <div className="workflow-preset-grid">
                                            {WORKFLOW_CAPTION_PRESET_OPTIONS.map((option) => {
                                                const isSelected = option.templateId === selectedWorkflowCaptionId;

                                                return (
                                                    <button
                                                        key={option.templateId}
                                                        type="button"
                                                        className={`workflow-preset-card ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => setSelectedWorkflowCaptionId(option.templateId)}
                                                        title={option.desc}
                                                    >
                                                        <div className="workflow-preset-thumb">
                                                            {option.styleId === null ? (
                                                                <span className="workflow-no-caption-icon">⊘</span>
                                                            ) : (
                                                                <CaptionStylePreview styleId={option.styleId} compact />
                                                            )}
                                                        </div>
                                                        <span>{option.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="workflow-template-surface">
                                        <button type="button" className="workflow-nav-arrow left">
                                            <ChevronLeft size={14} />
                                        </button>
                                        <div className="workflow-template-grid">
                                            {TEMPLATE_PRESETS.map((preset, index) => (
                                                <button key={preset.name} type="button" className="workflow-template-card">
                                                    {index === 0 && (
                                                        <span className="workflow-template-edit">
                                                            <PenLine size={12} />
                                                            Edit
                                                        </span>
                                                    )}
                                                    <div className="workflow-template-thumb">
                                                        <img
                                                            src={WORKFLOW_VISIBLE_CAPTION_TEMPLATES[index + 1]?.imgUrl || WORKFLOW_VISIBLE_CAPTION_TEMPLATES[index + 1]?.gifUrl || ''}
                                                            alt={WORKFLOW_VISIBLE_CAPTION_TEMPLATES[index + 1] ? getCaptionTemplateDisplayLabel(WORKFLOW_VISIBLE_CAPTION_TEMPLATES[index + 1].templateId, WORKFLOW_VISIBLE_CAPTION_TEMPLATES[index + 1].name) : preset.name}
                                                            className="workflow-preset-image"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                    <span>{preset.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <button type="button" className="workflow-nav-arrow right">
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {clippingMode !== 'skip' && (
                                <>
                                    <div className="workflow-config-helper-row">
                                        <span>Include specific moments</span>
                                        <button type="button">Not sure how to prompt? learn more</button>
                                    </div>

                                    <label className="workflow-prompt-field">
                                        <input
                                            type="text"
                                            value={momentsPrompt}
                                            onChange={(event) => setMomentsPrompt(event.target.value)}
                                            placeholder="Example: find all the moments when someone scored"
                                        />
                                    </label>
                                </>
                            )}

                            <div className="workflow-setup-config-footer">
                                {clippingMode !== 'skip' && (
                                    <button type="button" className="workflow-save-default-btn">
                                        Save settings above as default
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="workflow-open-btn"
                                    onClick={clippingMode === 'skip' ? handleStartClipping : () => setSetupPage('reframe')}
                                >
                                    {clippingMode === 'skip' ? 'Create manual clip' : 'Next: speaker crop'}
                                </button>
                            </div>
                        </div>
                    </>
                ) : workflowStage === 'setup' ? (
                    <AiReframeView
                        projects={[project]}
                        activeProject={project}
                        onBack={() => setSetupPage('source')}
                        embedded
                        backLabel="Back to source"
                        continueLabel="Use speaker crop and continue"
                        onContinue={handleStartClipping}
                        onResult={setWorkflowReframeResult}
                    />
                ) : workflowStage === 'processing' ? (
                    <section className={`workflow-process-card ${animationStateClass}`}>
                        <div className="workflow-process-header">
                            <div className="workflow-process-copy">
                                <span className="workflow-stage-kicker">{clippingMode === 'skip' ? 'Manual Trim' : 'Clipping Graph'}</span>
                                <h3>{clippingMode === 'skip' ? 'One selected source range in, one subtitled result out.' : 'One long source in, multiple short clips out.'}</h3>
                                <p>{processSummary}</p>
                            </div>
                        </div>

                        <div className="workflow-process-scene" aria-label="Animated clipping progress view">
                            <svg
                                className="workflow-process-lines"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                                aria-hidden="true"
                            >
                                <defs>
                                    <linearGradient id="workflowProcessStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="rgba(146, 179, 255, 0.18)" />
                                        <stop offset="50%" stopColor="rgba(255, 255, 255, 0.92)" />
                                        <stop offset="100%" stopColor="rgba(146, 179, 255, 0.12)" />
                                    </linearGradient>
                                    <filter id="workflowProcessGlow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="0.8" result="blur" />
                                        <feMerge>
                                            <feMergeNode in="blur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {PROCESS_ROW_PATHS.map((path, rowIndex) => (
                                    <g key={path}>
                                        <path
                                            id={`workflow-path-${rowIndex}`}
                                            d={path}
                                            pathLength={100}
                                            className="workflow-process-path"
                                        />
                                        <path
                                            d={path}
                                            pathLength={100}
                                            className="workflow-process-path-travel"
                                            style={{ animationDelay: `${rowIndex * 0.42}s` }}
                                        />
                                        <circle
                                            r="1.1"
                                            className="workflow-process-pulse"
                                            filter="url(#workflowProcessGlow)"
                                        >
                                            <animateMotion
                                                dur={`${FLOW_LOOP_SECONDS}s`}
                                                begin={`${rowIndex * 0.42}s`}
                                                repeatCount="indefinite"
                                            >
                                                <mpath href={`#workflow-path-${rowIndex}`} />
                                            </animateMotion>
                                        </circle>
                                    </g>
                                ))}
                            </svg>

                            <div className="workflow-process-source">
                                <div className="workflow-process-source-frame">
                                    <div className="workflow-process-source-screen">
                                        {processSceneSourceThumbnail ? (
                                            <>
                                                <img
                                                    className="workflow-process-source-media workflow-process-source-image"
                                                    src={processSceneSourceThumbnail}
                                                    alt={project.name}
                                                    loading="lazy"
                                                />
                                                <div className="workflow-process-source-overlay">
                                                    <span className="workflow-process-source-chip">
                                                        {isLinkSource ? <Link2 size={13} /> : <Upload size={13} />}
                                                        {isLinkSource ? 'Link source' : 'Uploaded file'}
                                                    </span>
                                                    <div className="workflow-process-source-timeline" aria-hidden="true">
                                                        <span />
                                                    </div>
                                                </div>
                                            </>
                                        ) : previewSrc && !processSceneShouldStayLight ? (
                                            <>
                                                <video
                                                    className="workflow-process-source-media"
                                                    src={previewSrc}
                                                    muted
                                                    playsInline
                                                    preload="metadata"
                                                />
                                                <div className="workflow-process-source-overlay">
                                                    <span className="workflow-process-source-chip">
                                                        {isLinkSource ? <Link2 size={13} /> : <Upload size={13} />}
                                                        {isLinkSource ? 'Link source' : 'Uploaded file'}
                                                    </span>
                                                    <div className="workflow-process-source-timeline" aria-hidden="true">
                                                        <span />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <span className="workflow-process-source-chip">
                                                    {isLinkSource ? <Link2 size={13} /> : <Upload size={13} />}
                                                    {isLinkSource ? 'Link source' : 'Uploaded file'}
                                                </span>
                                                <div className="workflow-process-source-bars" aria-hidden="true">
                                                    <span />
                                                    <span />
                                                    <span />
                                                </div>
                                                <div className="workflow-process-source-timeline" aria-hidden="true">
                                                    <span />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="workflow-process-source-copy">
                                    <span>Input Video</span>
                                    <strong>{project.name}</strong>
                                    <small>{sourceLabel}</small>
                                </div>
                            </div>

                            <div className="workflow-process-output">
                                {PROCESS_GRID.map((row) => (
                                    <div key={`row-${row[0].rowIndex}`} className="workflow-process-row">
                                        {row.map((clip) => {
                                            const isReady = clip.order < readyClipCount;
                                            const activationDelay = clip.rowIndex * 0.42 + clip.columnIndex * 0.18;
                                            const clipMedia = processClips[clip.order];
                                            const clipPreviewImage = clipMedia?.thumbnailUrl || project.thumbnailUrl;
                                            const shouldRenderVideoClip = Boolean(clipMedia?.videoUrl) && !processSceneShouldStayLight;

                                            return (
                                                <article
                                                    key={clip.id}
                                                    className={`workflow-process-clip ${isReady ? 'is-ready' : ''}`}
                                                    style={{ animationDelay: `${activationDelay}s` }}
                                                >
                                                    <span className="workflow-process-clip-badge">
                                                        {isReady ? 'Ready' : 'Processing'}
                                                    </span>
                                                    <div className="workflow-process-clip-frame">
                                                        {clipPreviewImage ? (
                                                            <img
                                                                className="workflow-process-clip-media workflow-process-clip-image"
                                                                src={clipPreviewImage}
                                                                alt={clipMedia?.hook || `Clip ${clip.order + 1}`}
                                                                loading="lazy"
                                                            />
                                                        ) : shouldRenderVideoClip ? (
                                                            <video
                                                                className="workflow-process-clip-media"
                                                                src={clipMedia.videoUrl}
                                                                muted
                                                                playsInline
                                                                preload="none"
                                                            />
                                                        ) : previewSrc ? (
                                                            <video
                                                                className="workflow-process-clip-media workflow-process-clip-media-preview"
                                                                src={previewSrc}
                                                                muted
                                                                playsInline
                                                                preload="none"
                                                            />
                                                        ) : null}
                                                    </div>
                                                    <div className="workflow-process-clip-copy">
                                                        <strong>Clip {clip.order + 1}</strong>
                                                        <span>{isReady ? 'Ranked draft' : 'Smart segment'}</span>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="workflow-process-footer">
                            <div className="workflow-process-progress">
                                <div className="workflow-process-progress-head">
                                    <span>Pipeline progress</span>
                                    <strong>{displayProgressPercent}%</strong>
                                </div>
                                <div className="workflow-transfer-bar">
                                    <div className="workflow-transfer-fill" style={{ width: `${displayProgressPercent}%` }} />
                                </div>
                                <small>{processSummary}</small>
                            </div>

                            <div className="workflow-process-stats">
                                <div className="workflow-process-stat">
                                    <span>Source length</span>
                                    <strong>{formatDuration(project.duration)}</strong>
                                </div>
                                <div className="workflow-process-stat">
                                    <span>Selected quality</span>
                                    <strong>{qualityLabel}</strong>
                                </div>
                                <div className="workflow-process-stat">
                                    <span>Draft target</span>
                                    <strong>{estimatedClipCount} clips</strong>
                                </div>
                                <div className="workflow-process-stat">
                                    <span>Ready now</span>
                                    <strong>{readyClipCount}</strong>
                                </div>
                                <div className="workflow-process-stat">
                                    <span>Source sync</span>
                                    <strong>{formatFileSize(downloadedBytes)} / {formatFileSize(project.fileSize)}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="workflow-process-footer-actions">
                            <button
                                type="button"
                                className="workflow-open-btn"
                                onClick={onOpenClipsList}
                                disabled={readyClipCount === 0}
                            >
                                View clips
                            </button>
                        </div>
                    </section>
                ) : (
                    <section className={`workflow-process-card workflow-subtitle-card ${animationStateClass}`}>
                        <div className="workflow-process-header">
                            <div className="workflow-process-copy">
                                <span className="workflow-stage-kicker">Adding Subtitles</span>
                                <h3>Syncing subtitles across each clipped video.</h3>
                                <p className="workflow-subtitle-flow">{subtitleFlowSummary}</p>
                                <p>{processSummary}</p>
                            </div>
                        </div>

                        <div className="workflow-subtitle-stage">
                            <div className="workflow-subtitle-hero">
                                <div className="workflow-subtitle-hero-copy">
                                    <span className="workflow-subtitle-pill">Subtitle pass</span>
                                    <strong>{subtitleHeroTitle}</strong>
                                    <p>{subtitleStatusText}</p>
                                    <div className="workflow-subtitle-stats">
                                        <div className="workflow-subtitle-stat">
                                            <span>Completed</span>
                                            <strong>{subtitleProgressCount}</strong>
                                        </div>
                                        <div className="workflow-subtitle-stat">
                                            <span>In progress</span>
                                            <strong>{subtitleActiveCount}</strong>
                                        </div>
                                        <div className="workflow-subtitle-stat">
                                            <span>Queued</span>
                                            <strong>{subtitleQueuedCount}</strong>
                                        </div>
                                        <div className="workflow-subtitle-stat">
                                            <span>Elapsed</span>
                                            <strong>{subtitleElapsedLabel}</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="workflow-subtitle-hero-progress">
                                    <div className={`workflow-transfer-bar ${subtitleProgressIsMeasured ? '' : 'is-indeterminate'}`}>
                                        <div className="workflow-transfer-fill" style={{ width: subtitleProgressIsMeasured ? `${subtitleProgressPercent}%` : '42%' }} />
                                    </div>
                                    <small>{subtitleProgressLabel}</small>
                                </div>
                            </div>

                            <div className="workflow-subtitle-grid">
                                {processClips.map((clip, index) => {
                                    const isDone = index < subtitleProgressCount;
                                    const isActive = index === subtitleProgressCount && subtitleProgressCount < subtitleTargetCount;

                                    return (
                                        <article
                                            key={clip.id}
                                            className={`workflow-subtitle-item ${isDone ? 'is-done' : ''} ${isActive ? 'is-active' : ''}`}
                                        >
                                            <div className="workflow-subtitle-thumb">
                                                {clip.thumbnailUrl ? (
                                                    <img src={clip.thumbnailUrl} alt={clip.hook || `Clip ${index + 1}`} loading="lazy" />
                                                ) : (
                                                    <div className="workflow-subtitle-thumb-fallback">
                                                        <Film size={18} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="workflow-subtitle-copy">
                                                <strong>{clip.hook || `Clip ${index + 1}`}</strong>
                                                <span className="workflow-subtitle-meta">
                                                    Source {formatPreviewClock(Math.max(0, Math.floor(clip.startMs / 1000)))}-{formatPreviewClock(Math.max(0, Math.ceil(clip.endMs / 1000)))}
                                                </span>
                                                <span>
                                                    {isDone
                                                        ? 'Subtitles added'
                                                        : isActive
                                                            ? 'Adding subtitles now...'
                                                            : 'Queued for subtitle pass'}
                                                </span>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
