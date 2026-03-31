import { useEffect, useMemo, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { isTauri } from '@tauri-apps/api/core';
import {
    ChevronDown,
    Info,
    Link2,
    Pencil,
    Sparkles,
    Trash2
} from 'lucide-react';
import { ClipSuggestion, Project } from '../types';
import { clearProjectClips, generateClipNative } from '../lib/libraryApi';
import { formatMs } from '../store';

type WorkflowTab = 'ai' | 'dont';
type DropdownType = 'clipModel' | 'genre' | 'clipLength' | null;

interface WorkflowViewProps {
    project: Project;
    onProjectDeleted: (projectId: string) => void;
    onClipsReady: (clips: ClipSuggestion[]) => void;
    onOpenClipsList: () => void;
}

const CLIP_MODELS = [
    {
        value: 'Auto',
        label: 'Auto',
        description: 'Let AI choose the optimal model'
    },
    {
        value: 'ClipAnything',
        label: 'ClipAnything',
        description: 'Our smartest model. Great for any videos'
    },
    {
        value: 'ClipBasic',
        label: 'ClipBasic',
        description: 'Great for clipping talking videos'
    }
];

const GENRES = [
    'Auto',
    'Q&A',
    'Commentary',
    'Marketing',
    'Webinar',
    'Motivational speech',
    'Podcast'
];

const CLIP_LENGTHS = [
    'Auto (0m-3m)',
    '<30s',
    '30s~59s',
    '60s~89s',
    '90s~3m',
    '3m~5m',
    '5m~10m'
];

const QUICK_TEMPLATES = [
    { id: 'tpl-1', name: 'Preset template 1' },
    { id: 'tpl-2', name: 'Preset template 2' }
];

function clipLengthToSeconds(label: string): number {
    switch (label) {
        case '<30s':
            return 25;
        case '30s~59s':
            return 45;
        case '60s~89s':
            return 75;
        case '90s~3m':
            return 120;
        case '3m~5m':
            return 240;
        case '5m~10m':
            return 420;
        default:
            return 30;
    }
}

function formatDurationLabel(totalSeconds: number): string {
    const safe = Math.max(0, Math.round(totalSeconds));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    if (minutes === 0) return `${seconds}s`;
    return `${minutes}m ${seconds}s`;
}

export default function WorkflowView({ project, onProjectDeleted, onClipsReady, onOpenClipsList }: WorkflowViewProps) {
    const [activeTab, setActiveTab] = useState<WorkflowTab>('ai');
    const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
    const [clipModel, setClipModel] = useState('ClipBasic');
    const [genre, setGenre] = useState('Auto');
    const [clipLength, setClipLength] = useState('Auto (0m-3m)');
    const [autoHook, setAutoHook] = useState(false);
    const [specificMoments, setSpecificMoments] = useState('');
    const [timeframe, setTimeframe] = useState<[number, number]>([0, 180]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [progressText, setProgressText] = useState('');
    const [etaSec, setEtaSec] = useState<number | null>(null);
    const [elapsedSec, setElapsedSec] = useState(0);
    const [readyClipCount, setReadyClipCount] = useState(0);

    const maxDurationSec = useMemo(() => {
        if (!project?.duration || !Number.isFinite(project.duration) || project.duration <= 0) return 300;
        return Math.max(2, Math.floor(project.duration));
    }, [project?.duration]);

    useEffect(() => {
        setTimeframe([0, maxDurationSec]);
    }, [maxDurationSec, project?.id]);

    const startLabel = formatMs(timeframe[0] * 1000);
    const endLabel = formatMs(timeframe[1] * 1000);

    const handleRemoveSource = () => {
        const ok = window.confirm(`Delete "${project.name}" and all generated clips?`);
        if (!ok) return;
        onProjectDeleted(project.id);
    };

    const handleGenerate = async () => {
        if (activeTab === 'dont') {
            alert('Switch to "AI clipping" to generate clips.');
            return;
        }

        const sourcePathForGeneration = project.sourcePath ?? project.filePath;
        if (!isTauri() && (!sourcePathForGeneration || sourcePathForGeneration.startsWith('blob:'))) {
            alert('Web workflow clipping supports imported links or persisted files only. Upload a local file in desktop mode or import from link first.');
            return;
        }

        try {
            setIsGenerating(true);
            setProgressPercent(0);
            setProgressText('Preparing workflow...');
            setElapsedSec(0);
            setEtaSec(null);
            setReadyClipCount(0);

            await clearProjectClips(project.id);
            onClipsReady([]);

            const startMs = timeframe[0] * 1000;
            const endMs = timeframe[1] * 1000;
            const clipDurationSec = clipLengthToSeconds(clipLength);
            const clipMs = clipDurationSec * 1000;
            const totalPossible = Math.floor((endMs - startMs) / clipMs);
            const totalToGenerate = Math.max(1, Math.min(8, totalPossible));

            const generated: ClipSuggestion[] = [];
            const startedAt = performance.now();
            let cursor = startMs;

            for (let i = 1; i <= totalToGenerate; i += 1) {
                const clipStart = cursor;
                const clipEnd = Math.min(clipStart + clipMs, endMs);
                if (clipEnd <= clipStart) break;

                setProgressText(`Cutting clip ${i}/${totalToGenerate}...`);

                const hookPrefix = specificMoments.trim() ? specificMoments.trim() : `${genre} highlight`;
                const hook = `${hookPrefix} ${i}`;
                const reason = `${clipModel} • ${clipLength} • ${autoHook ? 'Auto hook on' : 'Auto hook off'}`;

                const persisted = await generateClipNative({
                    projectId: project.id,
                    sourcePath: sourcePathForGeneration,
                    startMs: clipStart,
                    endMs: clipEnd,
                    index: i,
                    hook,
                    reason,
                    score: Math.max(5, 10 - i),
                    selected: i <= 3
                });

                generated.push(persisted);
                onClipsReady([...generated]);
                setReadyClipCount(generated.length);

                cursor += clipMs;

                const elapsed = (performance.now() - startedAt) / 1000;
                const avgPerClip = generated.length > 0 ? elapsed / generated.length : 0;
                const remaining = totalToGenerate - generated.length;
                setElapsedSec(elapsed);
                setEtaSec(remaining > 0 ? avgPerClip * remaining : 0);
                setProgressPercent(Math.round((generated.length / totalToGenerate) * 100));
            }

            if (!generated.length) {
                alert('No clips generated in selected timeframe.');
                return;
            }

            const totalElapsed = (performance.now() - startedAt) / 1000;
            setElapsedSec(totalElapsed);
            setProgressText(`Done: ${generated.length} clips generated in ${formatDurationLabel(totalElapsed)}.`);
            setProgressPercent(100);
        } catch (err) {
            console.error(err);
            alert(`Workflow failed: ${err}`);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="workflow-page" onClick={() => setOpenDropdown(null)}>
            <div className="workflow-shell">
                <div className="workflow-source-row">
                    <div className="workflow-source-file">
                        <Link2 size={16} />
                        <span>{project.fileName || project.name}</span>
                        <button onClick={handleRemoveSource} className="workflow-remove-btn">
                            <Trash2 size={14} />
                            Remove
                        </button>
                    </div>
                    <button className="workflow-main-btn" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? 'Clipping...' : 'Get clips in 1 click'}
                    </button>

                    <div className="workflow-meta-row">
                        <span>Speech language: <b>Auto</b> <ChevronDown size={14} /></span>
                        <span className="workflow-link-text">Upload .SRT (optional)</span>
                        <span>Credit usage: <Sparkles size={13} /> 5 <Info size={13} /></span>
                    </div>
                </div>

                <div className="workflow-preview">
                    <div className="workflow-preview-badge">{project.resolution?.height ? `${project.resolution.height}p` : '360p'}</div>
                    <video
                        ref={(el) => {
                            if (el) {
                                el.onclick = () => {
                                    if (el.paused) el.play();
                                    else el.pause();
                                };
                            }
                        }}
                        src={`${project.filePath}#t=1`}
                        playsInline
                        controls={false}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <div className="workflow-panel-wrap">
                    <div className="workflow-tabs">
                        <button className={activeTab === 'ai' ? 'active' : ''} onClick={() => setActiveTab('ai')}>AI clipping</button>
                        <button className={activeTab === 'dont' ? 'active' : ''} onClick={() => setActiveTab('dont')}>Don't clip</button>
                    </div>

                    <div className="workflow-panel">
                        <div className="workflow-controls">
                            <div className="workflow-dropdown">
                                <span className="workflow-label">Clip model</span>
                                <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'clipModel' ? null : 'clipModel'); }}>
                                    {clipModel}
                                    <ChevronDown size={14} />
                                </button>
                                {openDropdown === 'clipModel' && (
                                    <div className="workflow-menu wide" onClick={(e) => e.stopPropagation()}>
                                        {CLIP_MODELS.map((model) => (
                                            <button
                                                key={model.value}
                                                className={clipModel === model.value ? 'selected' : ''}
                                                onClick={() => {
                                                    setClipModel(model.value);
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                <div>{model.label}</div>
                                                <small>{model.description}</small>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="workflow-dropdown">
                                <span className="workflow-label">Genre</span>
                                <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'genre' ? null : 'genre'); }}>
                                    {genre}
                                    <ChevronDown size={14} />
                                </button>
                                {openDropdown === 'genre' && (
                                    <div className="workflow-menu" onClick={(e) => e.stopPropagation()}>
                                        {GENRES.map((item) => (
                                            <button
                                                key={item}
                                                className={genre === item ? 'selected' : ''}
                                                onClick={() => {
                                                    setGenre(item);
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="workflow-dropdown">
                                <span className="workflow-label">Clip Length</span>
                                <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === 'clipLength' ? null : 'clipLength'); }}>
                                    {clipLength}
                                    <ChevronDown size={14} />
                                </button>
                                {openDropdown === 'clipLength' && (
                                    <div className="workflow-menu" onClick={(e) => e.stopPropagation()}>
                                        {CLIP_LENGTHS.map((item) => (
                                            <button
                                                key={item}
                                                className={clipLength === item ? 'selected' : ''}
                                                onClick={() => {
                                                    setClipLength(item);
                                                    setOpenDropdown(null);
                                                }}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="workflow-toggle-row">
                                <span className="workflow-label">Auto hook</span>
                                <button
                                    className={`workflow-toggle ${autoHook ? 'on' : ''}`}
                                    onClick={() => setAutoHook((v) => !v)}
                                >
                                    <span />
                                </button>
                            </div>
                        </div>

                        <div className="workflow-prompt-row">
                            <span className="workflow-label">Include specific moments</span>
                            <a href="https://intercom.help/opusclip/en/" target="_blank" rel="noreferrer">Not sure how to prompt? learn more</a>
                        </div>
                        <input
                            className="workflow-prompt-input"
                            value={specificMoments}
                            onChange={(e) => setSpecificMoments(e.target.value)}
                            placeholder="Example: find moments when we talked about the playoffs"
                        />

                        <div className="workflow-timeframe-head">
                            <span>Processing timeframe</span>
                            <span className="workflow-credit-saver">Credit saver</span>
                        </div>

                        <div className="workflow-slider-wrap">
                            <Slider
                                range
                                value={timeframe}
                                min={0}
                                max={maxDurationSec}
                                onChange={(values) => {
                                    const asRange = values as number[];
                                    setTimeframe([asRange[0], asRange[1]]);
                                }}
                                trackStyle={[{ backgroundColor: '#f5f5f5', height: 6 }]}
                                railStyle={{ backgroundColor: '#4a4d55', height: 6 }}
                                handleStyle={[
                                    { borderColor: '#a3a8b2', backgroundColor: '#040507', opacity: 1 },
                                    { borderColor: '#a3a8b2', backgroundColor: '#040507', opacity: 1 }
                                ]}
                            />
                            <div className="workflow-time-labels">
                                <span>{startLabel}</span>
                                <span>{endLabel}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {(isGenerating || progressPercent > 0) && (
                    <div className="workflow-progress-row">
                        <span>{progressText || 'Preparing...'}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                            {progressPercent}% • elapsed {formatDurationLabel(elapsedSec)}{etaSec !== null ? ` • left ${formatDurationLabel(etaSec)}` : ''}
                            {readyClipCount > 0 && !isGenerating && (
                                <button
                                    onClick={onOpenClipsList}
                                    style={{
                                        border: '1px solid #ffffff24',
                                        background: '#1f2430',
                                        color: '#e5e7eb',
                                        borderRadius: 7,
                                        height: 30,
                                        padding: '0 10px',
                                        fontSize: 12,
                                        cursor: 'pointer'
                                    }}
                                >
                                    View clips
                                </button>
                            )}
                        </span>
                    </div>
                )}

                <div className="workflow-template-wrap">
                    <div className="workflow-tabs alt">
                        <button>Quick presets</button>
                        <button className="active">My templates</button>
                    </div>
                    <div className="workflow-template-panel">
                        <button className="workflow-arrow-btn">←</button>
                        {QUICK_TEMPLATES.map((item, i) => (
                            <div key={item.id} className={`workflow-template-card ${i === 0 ? 'active' : ''}`}>
                                <div className="workflow-template-thumb">
                                    {i === 0 && (
                                        <button className="workflow-edit-btn">
                                            <Pencil size={12} />
                                            Edit
                                        </button>
                                    )}
                                </div>
                                <div className="workflow-template-name">{item.name}</div>
                            </div>
                        ))}
                        <button className="workflow-arrow-btn">→</button>
                    </div>
                </div>

                <button className="workflow-save-default-btn">Save settings above as default</button>
            </div>
        </div>
    );
}
