import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { ChevronDown, ChevronLeft, ChevronRight, CircleCheckBig, Download, Film, Link2, Monitor, Pause, PenLine, Play, RectangleHorizontal, Smartphone, Square, Trash2, Upload } from 'lucide-react';
import { ClipSuggestion, Project } from '../types';
import { clearProjectClips, generateClipNative } from '../lib/libraryApi';
import { OPUS_CAPTION_TEMPLATES, formatOpusTemplateLabel } from '../lib/opusBrandTemplates';
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
        id: 'review',
        title: 'Review',
        caption: 'Open results board'
    }
] as const;

const PROCESS_GRID_ROWS = 3;
const PROCESS_GRID_COLUMNS = 4;
const PROCESS_ROW_PATHS = [
    'M 26 50 C 30 50 30 18 38 18 L 46 18',
    'M 26 50 C 30 50 31 50 38 50 L 46 50',
    'M 26 50 C 30 50 30 82 38 82 L 46 82'
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

const CLIP_MODELS = ['ClipBasic', 'ClipBoost', 'ClipNarrative'] as const;
const GENRE_OPTIONS = ['Auto', 'Podcast', 'Reaction', 'Education'] as const;
const LENGTH_OPTIONS = ['Auto (0m-3m)', '30s-60s', '60s-90s', '90s-180s'] as const;
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

const getCaptionTemplateDisplayLabel = (templateId: string, fallbackName: string) => {
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

function formatPreviewClock(totalSeconds: number): string {
    const safe = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
    const [workflowStage, setWorkflowStage] = useState<'setup' | 'processing'>(() => (
        autoStart || sourcePreparing ? 'processing' : 'setup'
    ));
    const [isGenerating, setIsGenerating] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [progressText, setProgressText] = useState('Waiting to start');
    const [readyClipCount, setReadyClipCount] = useState(0);
    const [sourcePrepareProgress, setSourcePrepareProgress] = useState(12);
    const [previewState, setPreviewState] = useState<'idle' | 'ready' | 'error'>('idle');
    const [previewDurationSec, setPreviewDurationSec] = useState(0);
    const [previewCurrentSec, setPreviewCurrentSec] = useState(0);
    const [previewPlaying, setPreviewPlaying] = useState(false);
    const [clippingMode, setClippingMode] = useState<'clip' | 'skip'>('clip');
    const [clipModel, setClipModel] = useState<(typeof CLIP_MODELS)[number]>('ClipBasic');
    const [clipGenre, setClipGenre] = useState<(typeof GENRE_OPTIONS)[number]>('Auto');
    const [clipLength, setClipLength] = useState<(typeof LENGTH_OPTIONS)[number]>('Auto (0m-3m)');
    const [autoHookEnabled, setAutoHookEnabled] = useState(true);
    const [momentsPrompt, setMomentsPrompt] = useState('');
    const [presetTab, setPresetTab] = useState<'quick' | 'templates'>('quick');
    const [aspectRatio, setAspectRatio] = useState<(typeof ASPECT_RATIOS)[number]>('9:16');
    const [selectedWorkflowCaptionId, setSelectedWorkflowCaptionId] = useState<string>(
        WORKFLOW_VISIBLE_CAPTION_TEMPLATES.find((template) => template.templateId !== 'none')?.templateId
            ?? WORKFLOW_VISIBLE_CAPTION_TEMPLATES[0]?.templateId
            ?? 'none'
    );
    const autoRunRef = useRef<string | null>(null);
    const previewVideoRef = useRef<HTMLVideoElement | null>(null);

    const maxDurationSec = useMemo(() => {
        if (!project?.duration || !Number.isFinite(project.duration) || project.duration <= 0) return 180;
        return Math.max(30, Math.floor(project.duration));
    }, [project?.duration]);

    const estimatedClipCount = useMemo(() => {
        return Math.max(1, Math.min(6, Math.floor(maxDurationSec / 45) || 1));
    }, [maxDurationSec]);

    const qualityLabel = useMemo(() => {
        if (project.resolution?.height) return `${project.resolution.height}p`;
        if (project.sourceType === 'link') return 'Auto';
        return 'Original';
    }, [project.resolution?.height, project.sourceType]);

    const sourceLabel = project.sourceType === 'link'
        ? (project.sourceUrl || project.fileName || project.name)
        : (project.fileName || project.name);
    const isLinkSource = project.sourceType === 'link';
    const previewSrc = project.filePath || '';
    const displayProgressPercent = sourcePreparing ? sourcePrepareProgress : progressPercent;
    const animationStateClass = sourcePreparing || isGenerating
        ? 'is-animating'
        : readyClipCount > 0
            ? 'is-complete'
            : 'is-idle';

    const activeStepIndex = useMemo(() => {
        if (workflowStage === 'setup') return 0;
        if (workflowStage === 'processing') return 1;
        if (readyClipCount > 0 && !isGenerating && displayProgressPercent >= 100) return 4;
        if (displayProgressPercent >= 78) return 3;
        if (displayProgressPercent >= 52) return 2;
        if (displayProgressPercent >= 24) return 1;
        return 0;
    }, [displayProgressPercent, isGenerating, readyClipCount, workflowStage]);

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
        if (sourcePreparing) return 'Locking in the source and getting the clipping graph ready.';
        if (isGenerating) return progressText;
        if (readyClipCount > 0) return `${readyClipCount} clips are ready for review.`;
        return 'Queued to split one long source into short, ranked clip drafts.';
    }, [isGenerating, progressText, readyClipCount, sourcePreparing]);

    const selectedAspectOption = useMemo(() => {
        return ASPECT_RATIO_OPTIONS.find((option) => option.id === aspectRatio) ?? ASPECT_RATIO_OPTIONS[0];
    }, [aspectRatio]);

    const previewCropResolutionLabel = useMemo(() => {
        const width = project.resolution?.width ?? 0;
        const height = project.resolution?.height ?? 0;
        if (!width || !height) return 'Auto';

        const [ratioWidth, ratioHeight] = aspectRatio.split(':').map(Number);
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
    }, [aspectRatio, project.resolution?.height, project.resolution?.width]);

    useEffect(() => {
        setWorkflowStage(autoStart || sourcePreparing ? 'processing' : 'setup');
        setIsGenerating(false);
        setProgressPercent(0);
        setProgressText('Waiting to start');
        setReadyClipCount(0);
        setSourcePrepareProgress(12);
        setPreviewState(previewSrc ? 'idle' : 'error');
        setPreviewDurationSec(0);
        setPreviewCurrentSec(0);
        setPreviewPlaying(false);
        autoRunRef.current = null;
    }, [autoStart, previewSrc, project.id, sourcePreparing]);

    useEffect(() => {
        if (!sourcePreparing) return;
        const interval = window.setInterval(() => {
            setSourcePrepareProgress((current) => Math.min(86, current + Math.max(3, (86 - current) * 0.14)));
        }, 180);
        return () => window.clearInterval(interval);
    }, [sourcePreparing]);

    const handleRemoveSource = () => {
        const ok = window.confirm(`Delete "${project.name}" and all generated clips?`);
        if (!ok) return;
        onProjectDeleted(project.id);
    };

    const handlePreviewLoaded = () => {
        const video = previewVideoRef.current;
        if (!video) return;
        setPreviewState('ready');
        setPreviewDurationSec(Number.isFinite(video.duration) ? video.duration : 0);
        setPreviewCurrentSec(video.currentTime || 0);
    };

    const handlePreviewTimeUpdate = () => {
        const video = previewVideoRef.current;
        if (!video) return;
        setPreviewCurrentSec(video.currentTime || 0);
    };

    const togglePreviewPlayback = async () => {
        const video = previewVideoRef.current;
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

        const sourcePathForGeneration = project.sourcePath ?? project.filePath;

        try {
            setIsGenerating(true);
            setProgressPercent(8);
            setProgressText(isLinkSource ? 'Downloading source and locking selected quality...' : 'Reading upload metadata and indexing frames...');
            setReadyClipCount(0);

            await clearProjectClips(project.id);
            onClipsReady([]);
            await pause(isLinkSource ? 550 : 320);

            setProgressPercent(28);
            setProgressText('Building crop map and scene rhythm...');
            await pause(420);

            setProgressPercent(54);
            setProgressText('Scanning hooks, topic shifts, and standout moments...');
            await pause(420);

            const generated: ClipSuggestion[] = [];
            const clipDurationSec = Math.max(24, Math.min(70, Math.round(maxDurationSec / estimatedClipCount)));
            const clipMs = clipDurationSec * 1000;
            const totalToGenerate = estimatedClipCount;
            let cursor = 0;

            for (let i = 1; i <= totalToGenerate; i += 1) {
                const clipStart = cursor;
                const clipEnd = Math.min(clipStart + clipMs, maxDurationSec * 1000);
                if (clipEnd <= clipStart) break;

                setProgressText(`Drafting clip ${i}/${totalToGenerate} and scoring it for review...`);

                const persisted = await generateClipNative({
                    projectId: project.id,
                    sourcePath: sourcePathForGeneration,
                    startMs: clipStart,
                    endMs: clipEnd,
                    index: i,
                    hook: `${project.name} moment ${i}`,
                    reason: 'Smart crop map • hook scan • review ready',
                    score: Math.max(6, 10 - i),
                    selected: i <= 3
                });

                generated.push(persisted);
                onClipsReady([...generated]);
                setReadyClipCount(generated.length);

                cursor += clipMs;
                setProgressPercent(72 + Math.round((generated.length / totalToGenerate) * 24));
            }

            if (!generated.length) {
                alert('No clips were generated from this source.');
                setProgressPercent(0);
                setProgressText('No draft clips were created.');
                return;
            }

            setProgressPercent(100);
            setProgressText(`Done. ${generated.length} clips prepared.`);
        } catch (err) {
            console.error(err);
            alert(`Workflow failed: ${err}`);
            setProgressText('The run stopped before clips were ready.');
        } finally {
            setIsGenerating(false);
        }
    }, [canStartProcessing, estimatedClipCount, isGenerating, isLinkSource, maxDurationSec, onClipsReady, project.filePath, project.id, project.name, project.sourcePath, sourcePreparing]);

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
            <div className={`workflow-shell ${workflowStage === 'processing' ? 'workflow-shell-processing' : ''}`}>
                <section className="workflow-stepper-card">
                    <div className="workflow-stepper-head">
                        <div>
                            <span className="workflow-stepper-kicker">
                                {workflowStage === 'setup' ? 'ClipForge Flow' : 'AI Processing'}
                            </span>
                            <h2>
                                {workflowStage === 'setup'
                                    ? 'Fresh workflow, not an Opus clone'
                                    : 'Watch the source break into clips in real time'}
                            </h2>
                        </div>
                        <div className="workflow-stepper-meta">
                            <span>{displayProgressPercent}% complete</span>
                            <span>
                                {workflowStage === 'setup'
                                    ? 'Queued for generation'
                                    : processSummary}
                            </span>
                        </div>
                    </div>

                    <div className="workflow-stepper-track">
                        {PROCESS_STEPS.map((step, index) => {
                            const status = index < activeStepIndex ? 'complete' : index === activeStepIndex ? 'active' : 'pending';
                            return (
                                <div key={step.id} className="workflow-stepper-item">
                                    <div className={`workflow-stepper-node ${status}`}>
                                        {status === 'complete' ? <CircleCheckBig size={14} /> : <span>{index + 1}</span>}
                                    </div>
                                    {index < PROCESS_STEPS.length - 1 && (
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

                {workflowStage === 'setup' ? (
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
                                    title="Delete this imported source and any clips already generated from it."
                                >
                                    <Trash2 size={14} />
                                    Remove
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
                                {previewSrc && !sourcePreparing ? (
                                    <>
                                        <div className="workflow-preview-stage" data-ratio={aspectRatio}>
                                            <video
                                                key={previewSrc}
                                                ref={previewVideoRef}
                                                src={previewSrc}
                                                playsInline
                                                preload="auto"
                                                onLoadedMetadata={handlePreviewLoaded}
                                                onTimeUpdate={handlePreviewTimeUpdate}
                                                onPlay={() => setPreviewPlaying(true)}
                                                onPause={() => setPreviewPlaying(false)}
                                                onError={() => setPreviewState('error')}
                                            />
                                        </div>
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
                                        </div>
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
                                    AI clipping
                                </button>
                                <button
                                    type="button"
                                    className={`workflow-config-tab ${clippingMode === 'skip' ? 'active' : ''}`}
                                    onClick={() => setClippingMode('skip')}
                                >
                                    Don&apos;t clip
                                </button>
                            </div>

                            <div className="workflow-timeframe-card">
                                <div className="workflow-timeframe-head">
                                    <span>Processing timeframe</span>
                                    <span className="workflow-credit-pill">Credit saver</span>
                                </div>
                                <div className="workflow-timeframe-rail">
                                    <div className="workflow-timeframe-fill" />
                                    <span className="workflow-timeframe-handle left" />
                                    <span className="workflow-timeframe-handle right" />
                                </div>
                                <div className="workflow-timeframe-values">
                                    <strong>0:00:00</strong>
                                    <strong>{formatDuration(project.duration)}</strong>
                                </div>
                            </div>

                            <div className="workflow-config-toolbar">
                                <label>
                                    <span>Clip model</span>
                                    <div className="workflow-select-shell">
                                        <select value={clipModel} onChange={(event) => setClipModel(event.target.value as (typeof CLIP_MODELS)[number])}>
                                            {CLIP_MODELS.map((option) => <option key={option}>{option}</option>)}
                                        </select>
                                        <ChevronDown size={14} />
                                    </div>
                                </label>
                                <label>
                                    <span>Genre</span>
                                    <div className="workflow-select-shell">
                                        <select value={clipGenre} onChange={(event) => setClipGenre(event.target.value as (typeof GENRE_OPTIONS)[number])}>
                                            {GENRE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                                        </select>
                                        <ChevronDown size={14} />
                                    </div>
                                </label>
                                <label>
                                    <span>Clip length</span>
                                    <div className="workflow-select-shell">
                                        <select value={clipLength} onChange={(event) => setClipLength(event.target.value as (typeof LENGTH_OPTIONS)[number])}>
                                            {LENGTH_OPTIONS.map((option) => <option key={option}>{option}</option>)}
                                        </select>
                                        <ChevronDown size={14} />
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

                            <div className="workflow-config-presets">
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

                                {presetTab === 'quick' ? (
                                    <div className="workflow-preset-surface">
                                        <div className="workflow-preset-label">Caption</div>
                                        <div className="workflow-preset-grid">
                                            {WORKFLOW_VISIBLE_CAPTION_TEMPLATES.map((template) => {
                                                const label = getCaptionTemplateDisplayLabel(template.templateId, template.name);
                                                const previewThumb = template.imgUrl || template.gifUrl || '';
                                                const isSelected = template.templateId === selectedWorkflowCaptionId;

                                                return (
                                                    <button
                                                        key={template.templateId}
                                                        type="button"
                                                        className={`workflow-preset-card ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => setSelectedWorkflowCaptionId(template.templateId)}
                                                    >
                                                        {template.needNewTag && <span className="workflow-preset-badge">New</span>}
                                                        <div className="workflow-preset-thumb">
                                                            {template.templateId === 'none' ? (
                                                                <span className="workflow-no-caption-icon">⊘</span>
                                                            ) : (
                                                                <img
                                                                    src={previewThumb}
                                                                    alt={label}
                                                                    className="workflow-preset-image"
                                                                    loading="lazy"
                                                                />
                                                            )}
                                                        </div>
                                                        <span>{label}</span>
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

                            <div className="workflow-setup-config-footer">
                                <button type="button" className="workflow-save-default-btn">
                                    Save settings above as default
                                </button>
                                <button
                                    type="button"
                                    className="workflow-open-btn"
                                    onClick={() => {
                                        if (!canStartProcessing()) return;
                                        setWorkflowStage('processing');
                                        void handleGenerate();
                                    }}
                                >
                                    Start clipping
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <section className={`workflow-process-card ${animationStateClass}`}>
                        <div className="workflow-process-header">
                            <div className="workflow-process-copy">
                                <span className="workflow-stage-kicker">Clipping Graph</span>
                                <h3>One long source in, multiple short clips out.</h3>
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

                                            return (
                                                <article
                                                    key={clip.id}
                                                    className={`workflow-process-clip ${isReady ? 'is-ready' : ''}`}
                                                    style={{ animationDelay: `${activationDelay}s` }}
                                                >
                                                    <span className="workflow-process-clip-badge">
                                                        {isReady ? 'Ready' : 'Processing'}
                                                    </span>
                                                    <div className="workflow-process-clip-frame" />
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
                )}
            </div>
        </div>
    );
}
