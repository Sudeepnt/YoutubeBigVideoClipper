import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {
    Play,
    Trash2,
    ChevronLeft,
    Undo2,
    Redo2,
    Monitor,
    Sparkles,
    ClosedCaption,
    Upload,
    Layout as LayoutIcon,
    Scissors,
    Type,
    Music,
    Zap,
    Maximize,
    RotateCcw,
    Plus,
    PlayCircle
} from 'lucide-react';
import { Project, ClipSuggestion } from '../types';
import { formatMs, mockTranscript } from '../store';

interface EditorViewProps {
    project: Project;
    activeClip: ClipSuggestion | null;
    onBack: () => void;
}

export default function EditorView({ project, activeClip, onBack }: EditorViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [trimRange, setTrimRange] = useState<[number, number]>([
        activeClip ? activeClip.startMs : 0,
        activeClip ? activeClip.endMs : 15000
    ]);

    const [editingTranscript, setEditingTranscript] = useState(mockTranscript);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => setCurrentTime(video.currentTime * 1000);
        const updateDuration = () => setDuration(video.duration * 1000);

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleWordClick = (startMs: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = startMs / 1000;
        }
    };

    const handleWordChange = (segmentId: number, wordIndex: number, newText: string) => {
        setEditingTranscript(prev => prev.map(s => {
            if (s.id === segmentId) {
                const newWords = [...s.words];
                newWords[wordIndex] = { ...newWords[wordIndex], word: newText };
                return { ...s, words: newWords };
            }
            return s;
        }));
    };

    const [isExporting, setIsExporting] = useState(false);

    const generateSRT = () => {
        // Simple SRT generator from our transcript structure
        let srt = '';
        let counter = 1;

        const formatSrtTime = (seconds: number) => {
            const date = new Date(seconds * 1000);
            const hh = date.getUTCHours().toString().padStart(2, '0');
            const mm = date.getUTCMinutes().toString().padStart(2, '0');
            const ss = date.getUTCSeconds().toString().padStart(2, '0');
            const ms = date.getUTCMilliseconds().toString().padStart(3, '0');
            return `${hh}:${mm}:${ss},${ms}`;
        };

        editingTranscript.forEach(segment => {
            // Group words into chunks of roughly 4-5 words or by punctuation, for now we just dump the segment
            const text = segment.words.map(w => w.word).join(' ');
            const tStart = formatSrtTime(segment.start);
            const tEnd = formatSrtTime(segment.end);

            srt += `${counter}\n`;
            srt += `${tStart} --> ${tEnd}\n`;
            // Add rudimentary styling tags (yellow uppercase for example, testing basic burn-in)
            srt += `<font color="yellow">${text}</font>\n\n`;
            counter++;
        });

        return srt;
    };

    const [ffmpegLoading, setFfmpegLoading] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());

    useEffect(() => {
        const load = async () => {
            const ffmpeg = ffmpegRef.current;
            if (ffmpeg.loaded) return;
            setFfmpegLoading(true);
            try {
                // @node_modules resolving is tricky in some Vite setups, we can load from Unpkg for now to guarantee it works.
                const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
                await ffmpeg.load({
                    coreURL: `${baseURL}/ffmpeg-core.js`,
                    wasmURL: `${baseURL}/ffmpeg-core.wasm`,
                });
                console.log("FFmpeg loaded!");
            } catch (err) {
                console.error("FFmpeg load failed:", err);
            } finally {
                setFfmpegLoading(false);
            }
        };
        load();
    }, []);

    const handleExport = async () => {
        const ffmpeg = ffmpegRef.current;
        if (!project.filePath || !ffmpeg.loaded) {
            alert(ffmpeg.loaded ? "No source video path found." : "FFmpeg is still loading...");
            return;
        }

        try {
            setIsExporting(true);
            const srtContent = generateSRT();

            // By default let's use the activeClip bounds if available, else first 15s
            const startMs = trimRange[0];
            const endMs = trimRange[1];

            console.log("Exporting in Browser...", { start_ms: startMs, end_ms: endMs, srt: srtContent });

            // Write files to FFmpeg memory
            const videoData = await fetchFile(project.filePath);
            await ffmpeg.writeFile('input.mp4', videoData);

            const encoder = new TextEncoder();
            const srtData = encoder.encode(srtContent);
            await ffmpeg.writeFile('subs.srt', srtData);

            const startSec = (startMs / 1000).toString();
            const endSec = (endMs / 1000).toString();

            // Run FFmpeg
            // Note: Since we're using a generic built WASM of ffmpeg-full or standard, 
            // the subtitles filter requires libass. The standard unpkg @ffmpeg/core includes it!
            await ffmpeg.exec([
                '-y',
                '-i', 'input.mp4',
                '-ss', startSec,
                '-to', endSec,
                '-vf', 'subtitles=subs.srt',
                '-c:v', 'libx264',
                '-preset', 'ultrafast',
                '-c:a', 'aac',
                'output.mp4'
            ]);

            console.log("FFmpeg execution finished!");

            // Read the result
            const fileData = await ffmpeg.readFile('output.mp4');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const blob = new Blob([fileData as any], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);

            // Trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = `clipforge_${Math.floor(Math.random() * 10000)}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            alert("Export completed and downloaded!");
        } catch (error) {
            console.error(error);
            alert(`Export failed: ${error}`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="editor-view" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: '#0a0a0b',
            color: 'white',
            fontFamily: 'var(--font-primary)'
        }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 20px',
                background: '#0a0a0b',
                borderBottom: '1px solid #ffffff1a',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 4 }}>
                        <ChevronLeft size={20} />
                    </button>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#e5e7eb', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {activeClip ? activeClip.hook : project.name}
                    </span>
                    <div style={{ display: 'flex', gap: '12px', color: '#6b7280', marginLeft: '12px' }}>
                        <Undo2 size={16} style={{ cursor: 'pointer' }} />
                        <Redo2 size={16} style={{ cursor: 'pointer' }} />
                        <Monitor size={16} style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button style={{ background: '#1f1f23', color: '#e5e7eb', border: '1px solid #ffffff1a', padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                        Save changes
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting || ffmpegLoading}
                        style={{
                            background: isExporting || ffmpegLoading ? '#9ca3af' : 'white',
                            color: 'black', border: 'none', padding: '6px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 600,
                            cursor: isExporting || ffmpegLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {ffmpegLoading ? 'Loading Core...' : isExporting ? 'Exporting...' : 'Export'}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#facc15', fontSize: '14px', fontWeight: 600 }}>
                        <Zap size={14} fill="#facc15" /> 4
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                        S
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Left Column - Transcript */}
                <div style={{ width: '380px', borderRight: '1px solid #ffffff1a', display: 'flex', flexDirection: 'column', background: '#0a0a0b' }}>
                    <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#9ca3af' }}>
                            <div style={{ width: 14, height: 14, border: '1px solid #4b5563', borderRadius: '2px' }} />
                            Transcript only
                        </div>
                    </div>
                    <button style={{ margin: '0 20px 16px', background: '#ffffff0a', color: 'white', border: '1px solid #ffffff1a', padding: '8px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', cursor: 'pointer' }}>
                        <Plus size={14} /> Add a section
                    </button>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', lineHeight: '1.8' }}>
                            {editingTranscript.flatMap(s => s.words.map((w, i) => ({ ...w, segmentId: s.id, wordIndex: i }))).map((w, i) => {
                                const isCurrent = currentTime >= w.start && currentTime < w.end;
                                const isHighlighted = ["dive", "master's", "certificate", "scuba", "diving", "places", "marine", "protect"].includes(w.word.toLowerCase().replace(/[^\w]/g, ''));

                                return (
                                    <span
                                        key={`${w.segmentId}-${w.wordIndex}-${i}`}
                                        onClick={() => handleWordClick(w.start)}
                                        contentEditable
                                        onBlur={(e) => handleWordChange(w.segmentId, w.wordIndex, e.currentTarget.textContent || '')}
                                        suppressContentEditableWarning
                                        style={{
                                            fontSize: '15px',
                                            padding: '2px 4px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            color: isCurrent ? 'white' : (isHighlighted ? '#22c55e' : '#9ca3af'),
                                            background: isCurrent ? '#3b82f6' : 'transparent',
                                            transition: 'all 0.1s',
                                            borderBottom: isHighlighted ? '1px solid #22c55e' : 'none',
                                            outline: 'none'
                                        }}
                                    >
                                        {w.word}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Center Column - Video */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0a0a0b', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', padding: '12px', borderBottom: '1px solid #ffffff0a', fontSize: '13px', color: '#9ca3af' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <LayoutIcon size={14} /> 9:16
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <Maximize size={14} /> Layout: Fill
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <Sparkles size={14} /> Tracker: ON
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                        <div style={{
                            height: '100%',
                            aspectRatio: '9/16',
                            background: '#141415',
                            borderRadius: '12px',
                            position: 'relative',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            overflow: 'hidden',
                            border: '1px solid #ffffff1a'
                        }}>
                            <video
                                ref={videoRef}
                                src={project.filePath}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                playsInline
                            />
                            {!isPlaying && (
                                <div onClick={togglePlay} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 64, height: 64, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5 }}>
                                    <Play size={28} fill="black" stroke="none" style={{ marginLeft: 4 }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Icons */}
                <div style={{ width: '80px', borderLeft: '1px solid #ffffff1a', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '24px', background: '#0a0a0b' }}>
                    {[
                        { icon: <Sparkles size={20} />, label: 'AI enhance' },
                        { icon: <ClosedCaption size={20} />, label: 'Captions' },
                        { icon: <Upload size={20} />, label: 'Upload' },
                        { icon: <LayoutIcon size={20} />, label: 'Brand template' },
                        { icon: <Play size={20} />, label: 'B-Roll' },
                        { icon: <Scissors size={20} />, label: 'Transitions' },
                        { icon: <Type size={20} />, label: 'Text' },
                        { icon: <Music size={20} />, label: 'Music' },
                        { icon: <RotateCcw size={20} />, label: 'AI hook' }
                    ].map((tool, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', opacity: 0.6 }}>
                            <div style={{ color: '#9ca3af' }}>{tool.icon}</div>
                            <span style={{ fontSize: '10px', textAlign: 'center', width: '60px', color: '#9ca3af' }}>{tool.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Timeline */}
            <div style={{ height: '180px', borderTop: '1px solid #ffffff1a', background: '#0a0a0b', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ffffff0a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9ca3af', cursor: 'pointer' }}>
                            <PlayCircle size={14} /> Hide timeline
                        </div>
                        <div style={{ width: '1px', height: '14px', background: '#ffffff1a' }} />
                        <div style={{ display: 'flex', gap: '12px', color: '#9ca3af' }}>
                            <Maximize size={14} style={{ cursor: 'pointer' }} />
                            <Trash2 size={14} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{formatMs(currentTime)} / {formatMs(duration)}</span>
                    </div>
                </div>
                <div style={{ flex: 1, padding: '20px', position: 'relative' }}>
                    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
                        <span>Trim Start: {formatMs(trimRange[0])}</span>
                        <span>Trim End: {formatMs(trimRange[1])}</span>
                    </div>
                    <div style={{ height: '60px', background: '#121214', borderRadius: '6px', border: '1px solid #ffffff1a', position: 'relative', padding: '0 10px' }}>

                        <div style={{ paddingTop: '20px' }}>
                            <Slider
                                range
                                min={0}
                                max={duration > 0 ? duration : 60000}
                                value={trimRange}
                                onChange={(val) => setTrimRange(val as [number, number])}
                                trackStyle={[{ backgroundColor: '#3b82f6', height: 8 }]}
                                handleStyle={[
                                    { borderColor: '#fff', backgroundColor: '#3b82f6', opacity: 1, width: 16, height: 16, marginTop: -4 },
                                    { borderColor: '#fff', backgroundColor: '#3b82f6', opacity: 1, width: 16, height: 16, marginTop: -4 }
                                ]}
                                railStyle={{ backgroundColor: '#ffffff1a', height: 8 }}
                            />
                        </div>

                        <div style={{ position: 'absolute', left: `calc(10px + ${(currentTime / (duration || 1)) * 100}%)`, top: 0, height: '100%', width: '2px', background: 'white', zIndex: 10, pointerEvents: 'none' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
