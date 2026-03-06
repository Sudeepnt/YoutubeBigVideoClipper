import { useEffect, useState, type CSSProperties } from 'react';
import {
    Scissors,
    MoreVertical,
    CheckSquare,
    List,
    LayoutGrid,
    Filter,
    Download,
    X,
    LayoutTemplate,
    LoaderCircle,
    Trash2
} from 'lucide-react';
import { ClipSuggestion, Project } from '../types';
import { formatMs } from '../store';
import { generateClipNative } from '../lib/libraryApi';

interface ClipsListViewProps {
    project?: Project | null;
    clips: ClipSuggestion[];
    onClipsChange: (clips: ClipSuggestion[]) => void;
    onEditClip: (clip: ClipSuggestion) => void;
    onDeleteClip?: (clipId: string) => void;
    onClearProjectClips?: (projectId: string) => Promise<void>;
    onBack?: () => void;
}

const DEFAULT_CLIP_LENGTH_SEC = 30;
const DEFAULT_MAX_CLIPS = 8;

export default function ClipsListView({
    project,
    clips,
    onClipsChange,
    onEditClip,
    onDeleteClip,
    onClearProjectClips,
    onBack
}: ClipsListViewProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showAutoHook, setShowAutoHook] = useState(true);

    const [startSec, setStartSec] = useState(0);
    const [endSec, setEndSec] = useState(0);
    const [clipLengthSec, setClipLengthSec] = useState(DEFAULT_CLIP_LENGTH_SEC);
    const [maxClips, setMaxClips] = useState(DEFAULT_MAX_CLIPS);

    const [isGenerating, setIsGenerating] = useState(false);
    const [progressText, setProgressText] = useState('');
    const [progressPercent, setProgressPercent] = useState(0);
    const [elapsedSec, setElapsedSec] = useState(0);
    const [etaSec, setEtaSec] = useState<number | null>(null);
    const [completedInSec, setCompletedInSec] = useState<number | null>(null);
    const [lastMode, setLastMode] = useState<'copy' | 'reencode' | null>(null);

    useEffect(() => {
        if (project?.duration) {
            setEndSec(Math.max(1, Math.floor(project.duration)));
        }
    }, [project?.duration]);

    const handleGenerateClips = async () => {
        if (!project) {
            alert('Please upload or import a source first.');
            return;
        }
        if (clipLengthSec < 2) {
            alert('Clip duration must be at least 2 seconds.');
            return;
        }
        if (endSec <= startSec) {
            alert('End must be greater than start.');
            return;
        }

        const windowMs = (endSec - startSec) * 1000;
        const clipMs = clipLengthSec * 1000;
        if (windowMs < clipMs) {
            alert('Selected range is shorter than clip duration.');
            return;
        }

        try {
            setIsGenerating(true);
            setProgressText('Preparing source...');
            setProgressPercent(0);
            setElapsedSec(0);
            setEtaSec(null);
            setCompletedInSec(null);
            setLastMode(null);

            if (onClearProjectClips) {
                await onClearProjectClips(project.id);
            }
            onClipsChange([]);

            const generated: ClipSuggestion[] = [];
            const startMs = startSec * 1000;
            const endMs = endSec * 1000;
            const totalPossible = Math.floor((endMs - startMs) / clipMs);
            const totalToGenerate = Math.min(maxClips, totalPossible);
            const generationStartTs = performance.now();

            let currentStart = startMs;
            let idx = 0;

            while (currentStart + clipMs <= endMs && idx < totalToGenerate) {
                idx += 1;
                const currentEnd = currentStart + clipMs;
                setProgressText(`Cutting clip ${idx}/${totalToGenerate}...`);

                const hook = `Clip ${idx}: ${formatMs(currentStart)} to ${formatMs(currentEnd)}`;
                const reason = `Generated from ${clipLengthSec}s timeline window`;
                const score = Math.max(5, 10 - idx);
                const selected = idx <= 3;

                const persistedClip = await generateClipNative({
                    projectId: project.id,
                    startMs: currentStart,
                    endMs: currentEnd,
                    index: idx,
                    hook,
                    reason,
                    score,
                    selected
                });

                generated.push(persistedClip);
                setLastMode(persistedClip.processingMode ?? null);
                onClipsChange([...generated]);

                currentStart += clipMs;
                const elapsed = (performance.now() - generationStartTs) / 1000;
                const done = generated.length;
                const remaining = Math.max(totalToGenerate - done, 0);
                const avgPerClip = done > 0 ? elapsed / done : 0;

                setElapsedSec(elapsed);
                setEtaSec(remaining > 0 ? avgPerClip * remaining : 0);
                setProgressPercent(Math.round((done / totalToGenerate) * 100));
            }

            if (!generated.length) {
                alert('No clips were generated with the selected settings.');
                return;
            }

            const totalElapsed = (performance.now() - generationStartTs) / 1000;
            setCompletedInSec(totalElapsed);
            setProgressText(`Done: ${generated.length} clips generated in ${formatDurationLabel(totalElapsed)}.`);
            setProgressPercent(100);
            setEtaSec(0);
        } catch (err) {
            console.error(err);
            alert(`Clip generation failed: ${err}`);
            setProgressText('Failed to generate clips.');
            setEtaSec(null);
        } finally {
            setIsGenerating(false);
        }
    };

    const hasClips = clips.length > 0;

    return (
        <div className="clips-list-view" style={{
            padding: '24px 40px',
            background: '#0a0a0b',
            minHeight: '100%',
            color: 'white',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '13px' }}>
                    <LayoutTemplate size={16} />
                    <span>{project ? project.name : 'No project selected'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button style={{ background: '#ffffff1a', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <CheckSquare size={16} color="#3b82f6" />
                        Select
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                        <Filter size={18} />
                    </button>
                    <div style={{ display: 'flex', gap: '4px', background: '#ffffff0a', padding: '2px', borderRadius: '4px' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); setViewMode('list'); }}
                            style={{ background: viewMode === 'list' ? '#ffffff1a' : 'transparent', border: 'none', color: 'white', padding: '4px', borderRadius: '2px', cursor: 'pointer' }}
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setViewMode('grid'); }}
                            style={{ background: viewMode === 'grid' ? '#ffffff1a' : 'transparent', border: 'none', color: 'white', padding: '4px', borderRadius: '2px', cursor: 'pointer' }}
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>
                    <button style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                        <Download size={18} />
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                        <MoreVertical size={18} />
                    </button>
                    {onBack && (
                        <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div style={{
                background: '#101013',
                border: '1px solid #ffffff1a',
                borderRadius: 12,
                padding: 16,
                marginBottom: 24
            }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Clip Settings (timeline split)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))', gap: 12 }}>
                    <label style={{ fontSize: 12, color: '#9ca3af' }}>
                        Start (sec)
                        <input
                            type="number"
                            min={0}
                            value={startSec}
                            onChange={(e) => setStartSec(Number(e.target.value) || 0)}
                            style={inputStyle}
                        />
                    </label>
                    <label style={{ fontSize: 12, color: '#9ca3af' }}>
                        End (sec)
                        <input
                            type="number"
                            min={1}
                            value={endSec}
                            onChange={(e) => setEndSec(Number(e.target.value) || 0)}
                            style={inputStyle}
                        />
                    </label>
                    <label style={{ fontSize: 12, color: '#9ca3af' }}>
                        Clip Duration (sec)
                        <input
                            type="number"
                            min={2}
                            value={clipLengthSec}
                            onChange={(e) => setClipLengthSec(Number(e.target.value) || DEFAULT_CLIP_LENGTH_SEC)}
                            style={inputStyle}
                        />
                    </label>
                    <label style={{ fontSize: 12, color: '#9ca3af' }}>
                        Max Clips
                        <input
                            type="number"
                            min={1}
                            max={50}
                            value={maxClips}
                            onChange={(e) => setMaxClips(Number(e.target.value) || DEFAULT_MAX_CLIPS)}
                            style={inputStyle}
                        />
                    </label>
                </div>

                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                        onClick={handleGenerateClips}
                        disabled={isGenerating || !project}
                        style={{
                            border: 'none',
                            borderRadius: 8,
                            padding: '10px 16px',
                            fontWeight: 700,
                            cursor: isGenerating || !project ? 'not-allowed' : 'pointer',
                            background: isGenerating || !project ? '#6b7280' : '#2563eb',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        {isGenerating ? <LoaderCircle size={16} className="spin" /> : <Scissors size={16} />}
                        {isGenerating ? 'Cutting...' : 'Generate Clips'}
                    </button>
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>
                        {progressText}
                        {(isGenerating || progressPercent > 0) && ` • ${progressPercent}%`}
                        {(isGenerating || elapsedSec > 0) && ` • elapsed ${formatDurationLabel(elapsedSec)}`}
                        {etaSec !== null && (isGenerating || etaSec === 0) && ` • left ${formatDurationLabel(etaSec)}`}
                        {lastMode && ` • mode ${lastMode === 'copy' ? 'fast-copy' : 're-encode'}`}
                    </span>
                </div>
                {completedInSec !== null && !isGenerating && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#86efac' }}>
                        Completed in {formatDurationLabel(completedInSec)}.
                    </div>
                )}
                {(isGenerating || progressPercent > 0) && (
                    <div style={{ marginTop: 10, height: 8, borderRadius: 999, background: '#ffffff1a', overflow: 'hidden' }}>
                        <div
                            style={{
                                width: `${progressPercent}%`,
                                height: '100%',
                                background: '#2563eb',
                                transition: 'width 0.2s linear'
                            }}
                        />
                    </div>
                )}
            </div>

            {showAutoHook && (
                <div style={{
                    background: '#111113',
                    border: '1px solid #ffffff1a',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                    position: 'relative'
                }}>
                    <button
                        onClick={() => setShowAutoHook(false)}
                        style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#4b5563', cursor: 'pointer' }}
                    >
                        <X size={18} />
                    </button>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Saved clips</h3>
                    <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.6, maxWidth: '800px' }}>
                        Generated clips are now persisted in local database + disk storage, and shown in All projects.
                    </p>
                </div>
            )}

            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                Generated clips ({clips.length})
            </div>

            {!hasClips && (
                <div style={{
                    border: '1px dashed #ffffff2a',
                    borderRadius: 12,
                    padding: 24,
                    color: '#9ca3af',
                    fontSize: 14,
                    marginBottom: 20
                }}>
                    No clips yet. Set times above and click Generate Clips.
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '24px'
            }}>
                {clips.map((clip, i) => (
                    <div key={clip.id} className="clip-card" onClick={() => onEditClip(clip)} style={{ cursor: 'pointer' }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '9/16',
                            background: '#1a1a1c',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid #ffffff0a',
                            marginBottom: '12px'
                        }}>
                            <video
                                src={clip.videoUrl ?? `${project?.filePath}#t=${clip.startMs / 1000}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                preload="metadata"
                                controls
                            />

                            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.65)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
                                {formatMs(clip.endMs - clip.startMs)}
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!onDeleteClip) return;
                                    const ok = window.confirm('Delete this clip?');
                                    if (!ok) return;
                                    onDeleteClip(clip.id);
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    width: 26,
                                    height: 26,
                                    borderRadius: 8,
                                    border: '1px solid #ffffff24',
                                    background: 'rgba(0,0,0,0.6)',
                                    color: '#f87171',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                                aria-label="Delete clip"
                                title="Delete clip"
                            >
                                <Trash2 size={14} />
                            </button>

                            <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.65)', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>
                                {i + 1}
                            </div>
                        </div>

                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#e5e7eb', lineHeight: 1.4, marginBottom: 4 }}>
                            {clip.hook}
                        </div>
                        <div style={{ fontSize: 12, color: '#9ca3af' }}>
                            {formatMs(clip.startMs)} - {formatMs(clip.endMs)}
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .clip-card:hover { opacity: 0.95; }
                .spin { animation: spin 0.9s linear infinite; }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

const inputStyle: CSSProperties = {
    width: '100%',
    marginTop: 6,
    background: '#0b0b0e',
    border: '1px solid #ffffff1a',
    color: 'white',
    borderRadius: 8,
    padding: '9px 10px',
    fontSize: 13
};

function formatDurationLabel(totalSeconds: number): string {
    const safe = Math.max(0, Math.round(totalSeconds));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${seconds}s`;
}
