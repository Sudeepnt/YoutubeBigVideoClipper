import { useEffect, useMemo, useState } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { ArrowLeft, Loader2, Play, Video } from 'lucide-react';
import { processAiReframeVideo, type AiReframeResult } from '../lib/aiReframeApi';
import { Project } from '../types';

interface AiReframeViewProps {
    projects: Project[];
    activeProject: Project | null;
    onBack: () => void;
    embedded?: boolean;
    onContinue?: () => void;
    onResult?: (result: AiReframeResult | null) => void;
    backLabel?: string;
    continueLabel?: string;
}

const RESOLUTION_OPTIONS = [
    { id: '720x1280', width: 720, height: 1280, label: '720 x 1280 (Fast)' },
    { id: '1080x1920', width: 1080, height: 1920, label: '1080 x 1920 (High quality)' },
] as const;

const DETECTION_INTERVAL_OPTIONS = [1, 2, 3] as const;

function makeOutputPath(inputPath: string, width: number, height: number): string {
    const safeInput = inputPath.trim();
    if (!safeInput) return '';

    const extensionMatch = safeInput.match(/\.[^/.]+$/);
    const extension = extensionMatch ? extensionMatch[0] : '.mp4';
    const base = extensionMatch ? safeInput.slice(0, -extension.length) : safeInput;
    const baseName = base.split(/[\\/]/).pop() ?? 'reframed_video';
    return `/Users/sudeepnt/Desktop/output/${baseName}_ai_reframe_${width}x${height}.mp4`;
}

function toMediaUrl(path: string): string {
    return `http://127.0.0.1:14321/media?path=${encodeURIComponent(path)}`;
}

export default function AiReframeView({
    projects,
    activeProject,
    onBack,
    embedded = false,
    onContinue,
    onResult,
    backLabel = 'Back',
    continueLabel = 'Continue to clipping',
}: AiReframeViewProps) {
    const runtimeIsTauri = isTauri();
    const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
        if (activeProject?.id) return activeProject.id;
        if (projects[0]?.id) return projects[0].id;
        return '';
    });
    const [selectedResolutionId, setSelectedResolutionId] = useState<(typeof RESOLUTION_OPTIONS)[number]['id']>('720x1280');
    const [detectionInterval, setDetectionInterval] = useState<(typeof DETECTION_INTERVAL_OPTIONS)[number]>(2);
    const [outputPath, setOutputPath] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<AiReframeResult | null>(null);

    const selectedProject = useMemo(
        () => projects.find((project) => project.id === selectedProjectId) ?? null,
        [projects, selectedProjectId],
    );

    useEffect(() => {
        if (projects.length === 0) {
            if (selectedProjectId) setSelectedProjectId('');
            return;
        }
        if (!selectedProjectId || !projects.some((project) => project.id === selectedProjectId)) {
            setSelectedProjectId(activeProject?.id && projects.some((project) => project.id === activeProject.id)
                ? activeProject.id
                : projects[0].id);
        }
    }, [activeProject?.id, projects, selectedProjectId]);

    const inputPath = selectedProject?.sourcePath || '';
    const selectedResolution = RESOLUTION_OPTIONS.find((item) => item.id === selectedResolutionId) ?? RESOLUTION_OPTIONS[0];
    const hasNativeSource = Boolean(inputPath.trim());

    useEffect(() => {
        setResult(null);
        setError(null);
        onResult?.(null);
        setOutputPath(makeOutputPath(inputPath, selectedResolution.width, selectedResolution.height));
    }, [inputPath, onResult, selectedResolution.height, selectedResolution.width]);

    const canRun = Boolean(runtimeIsTauri && selectedProject && inputPath && outputPath && !isProcessing);

    const handleRun = async () => {
        if (!canRun) return;

        setIsProcessing(true);
        setError(null);
        setResult(null);

        try {
            const processed = await processAiReframeVideo({
                inputPath,
                outputPath,
                outputWidth: selectedResolution.width,
                outputHeight: selectedResolution.height,
                detectionInterval,
            });
            setResult(processed);
            onResult?.(processed);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        } finally {
            setIsProcessing(false);
        }
    };

    const panel = (
        <>
            <div className="glass-panel" style={{ padding: 18, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: 24 }}>
                        {embedded ? 'Find The Speaker' : 'AI Reframe'}
                    </h2>
                    <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)' }}>
                        {embedded
                            ? 'Find the active speaker, crop around them, and build a portrait working source for Shorts and clips.'
                            : 'Convert horizontal video into stable 9:16 shorts using local face detection and tracking.'}
                    </p>
                </div>
                <button className="workflow-secondary-btn" type="button" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ArrowLeft size={14} /> {backLabel}
                </button>
            </div>

            <div className="glass-panel" style={{ padding: 18, borderRadius: 20, display: 'grid', gap: 16 }}>
                {!embedded && !runtimeIsTauri && (
                    <div style={{ color: '#fda4af', fontSize: 13 }}>
                        AI Reframe runs only in desktop mode because it uses local Python + FFmpeg.
                    </div>
                )}

                {projects.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                        Import a source video from Home first, then open AI Reframe.
                    </div>
                ) : (
                    <>
                        {embedded && (
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                    gap: 12,
                                }}
                            >
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--border-base)',
                                        borderRadius: 14,
                                        padding: '14px 16px',
                                        display: 'grid',
                                        gap: 4,
                                    }}
                                >
                                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Source</span>
                                    <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>{selectedProject?.name ?? 'No source selected'}</strong>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                                        {hasNativeSource ? 'Ready for speaker tracking' : 'Waiting for a local source file'}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--border-base)',
                                        borderRadius: 14,
                                        padding: '14px 16px',
                                        display: 'grid',
                                        gap: 4,
                                    }}
                                >
                                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Output</span>
                                    <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>9:16 speaker crop</strong>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                                        Built for Shorts, Reels, and portrait clip drafts
                                    </span>
                                </div>
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--border-base)',
                                        borderRadius: 14,
                                        padding: '14px 16px',
                                        display: 'grid',
                                        gap: 4,
                                    }}
                                >
                                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Tracking</span>
                                    <strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>Active speaker</strong>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                                        Keeps the crop locked onto the person talking
                                    </span>
                                </div>
                            </div>
                        )}

                        {embedded && !runtimeIsTauri && (
                            <div style={{ color: '#fda4af', fontSize: 13 }}>
                                Speaker crop is only available in the desktop app runtime.
                            </div>
                        )}

                        {embedded && runtimeIsTauri && !hasNativeSource && (
                            <div style={{ color: '#fda4af', fontSize: 13 }}>
                                This source is not fully available on disk yet, so ClipForge cannot run speaker crop on it.
                            </div>
                        )}

                        {!embedded && (
                            <label style={{ display: 'grid', gap: 6 }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Source Project</span>
                                <select
                                    value={selectedProjectId}
                                    onChange={(event) => setSelectedProjectId(event.target.value)}
                                    style={{
                                        background: 'var(--bg-input)',
                                        border: '1px solid var(--border-base)',
                                        color: 'var(--text-primary)',
                                        borderRadius: 10,
                                        padding: '10px 12px',
                                    }}
                                >
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}

                        <label style={{ display: 'grid', gap: 6 }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Output Resolution</span>
                            <select
                                value={selectedResolutionId}
                                onChange={(event) => setSelectedResolutionId(event.target.value as (typeof RESOLUTION_OPTIONS)[number]['id'])}
                                style={{
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-base)',
                                    color: 'var(--text-primary)',
                                    borderRadius: 10,
                                    padding: '10px 12px',
                                }}
                            >
                                {RESOLUTION_OPTIONS.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label style={{ display: 'grid', gap: 6 }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Detection Interval</span>
                            <select
                                value={detectionInterval}
                                onChange={(event) => setDetectionInterval(Number(event.target.value) as (typeof DETECTION_INTERVAL_OPTIONS)[number])}
                                style={{
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-base)',
                                    color: 'var(--text-primary)',
                                    borderRadius: 10,
                                    padding: '10px 12px',
                                }}
                            >
                                {DETECTION_INTERVAL_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        Every {option} frames
                                    </option>
                                ))}
                            </select>
                        </label>

                        {!embedded && (
                            <>
                                <label style={{ display: 'grid', gap: 6 }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Input Path</span>
                                    <input
                                        value={inputPath}
                                        readOnly
                                        style={{
                                            background: 'var(--bg-input)',
                                            border: '1px solid var(--border-base)',
                                            color: 'var(--text-secondary)',
                                            borderRadius: 10,
                                            padding: '10px 12px',
                                        }}
                                    />
                                </label>

                                <label style={{ display: 'grid', gap: 6 }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Output Path</span>
                                    <input
                                        value={outputPath}
                                        onChange={(event) => setOutputPath(event.target.value)}
                                        style={{
                                            background: 'var(--bg-input)',
                                            border: '1px solid var(--border-base)',
                                            color: 'var(--text-primary)',
                                            borderRadius: 10,
                                            padding: '10px 12px',
                                        }}
                                    />
                                </label>
                            </>
                        )}

                        <button
                            type="button"
                            disabled={!canRun}
                            onClick={handleRun}
                            className="workflow-open-btn"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: 220, height: 42 }}
                        >
                            {isProcessing ? <Loader2 size={14} className="spinner-inline" /> : <Play size={14} />}
                            {isProcessing
                                ? 'Finding speaker...'
                                : embedded
                                    ? `Find speaker and crop to ${selectedResolution.width}x${selectedResolution.height}`
                                    : 'Run AI Reframe'}
                        </button>

                        {embedded && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 460 }}>
                                    {result
                                        ? 'Speaker crop is ready. ClipForge will use this framed portrait source for the next clipping step.'
                                        : 'Run speaker tracking first if you want ClipForge to lock onto the person talking before clip generation.'}
                                </div>
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    <button
                                        type="button"
                                        className="workflow-secondary-btn"
                                        onClick={onContinue}
                                        style={{ minWidth: 220, height: 42 }}
                                    >
                                        Use original framing
                                    </button>
                                    {result && (
                                        <button
                                            type="button"
                                            className="workflow-open-btn"
                                            onClick={onContinue}
                                            style={{ minWidth: 220, height: 42 }}
                                        >
                                            {continueLabel}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {error && (
                    <div style={{ color: '#fda4af', fontSize: 13 }}>
                        {error}
                    </div>
                )}

                {result && (
                    <div className="glass-panel" style={{ padding: 14, borderRadius: 14, display: 'grid', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
                            <Video size={16} /> Reframe complete
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                            Output: {result.width}x{result.height} at {result.fps.toFixed(2)} FPS ({result.processedFrames} frames)
                        </div>
                        <input
                            value={result.outputPath}
                            readOnly
                            style={{
                                background: 'var(--bg-input)',
                                border: '1px solid var(--border-base)',
                                color: 'var(--text-secondary)',
                                borderRadius: 10,
                                padding: '10px 12px',
                            }}
                        />
                        <video
                            src={toMediaUrl(result.outputPath)}
                            controls
                            style={{ width: 280, maxWidth: '100%', borderRadius: 14, border: '1px solid var(--border-base)' }}
                        />
                    </div>
                )}
            </div>
        </>
    );

    if (embedded) {
        return <div style={{ display: 'grid', gap: 18 }}>{panel}</div>;
    }

    return (
        <div className="workflow-page" style={{ padding: 24, display: 'grid', gap: 18 }}>
            {panel}
        </div>
    );
}
