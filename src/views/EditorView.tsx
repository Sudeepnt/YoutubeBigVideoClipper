import { useState, useRef, useEffect, useMemo, type CSSProperties } from 'react';
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
    Maximize,
    RotateCcw,
    Plus,
    PlayCircle,
    ChevronDown,
    Image as ImageIcon,
    FileText,
    Check,
    Wand2,
    PanelRightOpen,
} from 'lucide-react';
import { Project, ClipSuggestion, TranscriptSegment } from '../types';
import { formatMs, mockTranscript } from '../store';
import {
    CAPTION_PLACEMENTS,
    CAPTION_PRESETS,
    OPUS_FONT_FAMILIES,
    OPUS_TRANSITION_STYLES,
    CaptionPlacement,
    CaptionPreset,
    getCaptionPresetById
} from '../lib/captionPresets';

interface EditorViewProps {
    project: Project;
    activeClip: ClipSuggestion | null;
    onBack: () => void;
}

type EditorToolId =
    | 'captions'
    | 'transcript'
    | 'upload'
    | 'brand-template'
    | 'b-roll'
    | 'transitions'
    | 'text'
    | 'music'
    | 'ai-hook'
    | 'ai-enhance';

type TransitionStyleId = (typeof OPUS_TRANSITION_STYLES)[number]['id'];

type EditorDraft = {
    trimRange: [number, number];
    editingTranscript: TranscriptSegment[];
    captionPresetId: string;
    captionPlacement: CaptionPlacement;
    fontFamilyOverride: (typeof OPUS_FONT_FAMILIES)[number];
    transitionStyleId: TransitionStyleId;
    aspectRatio: '9:16' | '1:1' | '16:9' | '4:5';
    layoutMode: 'Fill' | 'Fit';
    trackerEnabled: boolean;
    transcriptOnly: boolean;
    showTimeline: boolean;
    activeTool: EditorToolId;
    highlightWordsInput: string;
    highlightColor: string;
    highlightUnderline: boolean;
    musicLevel: number;
};

const EDITOR_DRAFT_PREFIX = 'clipforge-editor-draft';
const DEFAULT_HIGHLIGHT_WORDS = 'viral, hook, money, growth';
const COMMON_STOPWORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'from', 'get', 'got',
    'has', 'have', 'he', 'her', 'his', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'me',
    'my', 'of', 'on', 'or', 'our', 'she', 'so', 'that', 'the', 'their', 'them', 'there',
    'they', 'this', 'to', 'up', 'was', 'we', 'were', 'what', 'when', 'who', 'with', 'you',
    'your'
]);

type CaptionWord = TranscriptSegment['words'][number];
type CaptionWordWithIndex = CaptionWord & { globalIndex: number };

function splitCaptionWords(words: CaptionWord[], maxLines = 1): CaptionWordWithIndex[][] {
    const indexedWords = words.map((word, globalIndex) => ({ ...word, globalIndex }));
    if (maxLines <= 1 || indexedWords.length <= 1) {
        return indexedWords.length ? [indexedWords] : [];
    }

    let runningLength = 0;
    const totalLength = indexedWords.reduce((sum, word) => sum + word.word.length, 0);
    const targetLength = totalLength / 2;
    let splitIndex = 1;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let index = 1; index < indexedWords.length; index += 1) {
        runningLength += indexedWords[index - 1].word.length;
        const remainingLength = totalLength - runningLength;
        const balanceScore = Math.abs(runningLength - targetLength) + Math.abs(remainingLength - targetLength);
        const lineCountPenalty = Math.abs(indexedWords.slice(0, index).length - indexedWords.slice(index).length) * 3;
        const score = balanceScore + lineCountPenalty;
        if (score < bestScore) {
            bestScore = score;
            splitIndex = index;
        }
    }

    return [indexedWords.slice(0, splitIndex), indexedWords.slice(splitIndex)].filter((line) => line.length > 0);
}

function findEmphasisWordIndex(words: CaptionWord[], normalizeWord: (value: string) => string) {
    let bestIndex = 0;
    let bestScore = -1;

    words.forEach((word, index) => {
        const normalized = normalizeWord(word.word);
        const weight = normalized.length - (COMMON_STOPWORDS.has(normalized) ? 4 : 0);
        if (weight > bestScore) {
            bestScore = weight;
            bestIndex = index;
        }
    });

    return bestIndex;
}

function buildClipTranscript(activeClip: ClipSuggestion | null) {
    const clipStart = activeClip?.startMs ?? 0;
    const clipEnd = activeClip?.endMs ?? clipStart + 15000;

    const clippedSegments = mockTranscript
        .map((segment) => {
            const words = segment.words
                .filter((word) => word.end > clipStart && word.start < clipEnd)
                .map((word) => ({
                    ...word,
                    start: Math.max(0, word.start - clipStart),
                    end: Math.max(0, word.end - clipStart),
                }));

            if (!words.length) return null;

            return {
                ...segment,
                words,
                start: words[0].start,
                end: words[words.length - 1].end,
                text: words.map((word) => word.word).join(' '),
            };
        })
        .filter(Boolean) as TranscriptSegment[];

    if (clippedSegments.length) {
        return clippedSegments;
    }

    return mockTranscript.slice(0, 3).map((segment) => ({
        ...segment,
        words: segment.words.map((word) => ({
            ...word,
            start: Math.max(0, word.start - segment.start),
            end: Math.max(0, word.end - segment.start),
        })),
        start: Math.max(0, segment.start - mockTranscript[0].start),
        end: Math.max(0, segment.end - mockTranscript[0].start),
    }));
}

export default function EditorView({ project, activeClip, onBack }: EditorViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const transcriptPanelRef = useRef<HTMLDivElement>(null);
    const ffmpegRef = useRef(new FFmpeg());

    const clipStartMs = activeClip?.startMs ?? 0;
    const clipEndMs = activeClip?.endMs ?? clipStartMs + 15000;
    const clipDurationMs = Math.max(1000, clipEndMs - clipStartMs);
    const clipVideoSrc = activeClip?.videoUrl ?? activeClip?.videoPath ?? project.filePath;
    const usesProjectSource = clipVideoSrc === project.filePath;
    const draftKey = useMemo(
        () => `${EDITOR_DRAFT_PREFIX}:${project.id}:${activeClip?.id ?? 'project'}`,
        [project.id, activeClip?.id]
    );
    const clipTranscript = useMemo(() => buildClipTranscript(activeClip), [activeClip]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(clipDurationMs);
    const [trimRange, setTrimRange] = useState<[number, number]>([0, clipDurationMs]);
    const [editingTranscript, setEditingTranscript] = useState<TranscriptSegment[]>(clipTranscript);
    const [captionPresetId, setCaptionPresetId] = useState(CAPTION_PRESETS[0].id);
    const [captionPlacement, setCaptionPlacement] = useState<CaptionPlacement>('bottom');
    const [fontFamilyOverride, setFontFamilyOverride] = useState<(typeof OPUS_FONT_FAMILIES)[number]>(OPUS_FONT_FAMILIES[4]);
    const [transitionStyleId, setTransitionStyleId] = useState<TransitionStyleId>(OPUS_TRANSITION_STYLES[0].id as TransitionStyleId);
    const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9' | '4:5'>('9:16');
    const [layoutMode, setLayoutMode] = useState<'Fill' | 'Fit'>('Fill');
    const [trackerEnabled, setTrackerEnabled] = useState(true);
    const [transcriptOnly, setTranscriptOnly] = useState(false);
    const [showTimeline, setShowTimeline] = useState(true);
    const [activeTool, setActiveTool] = useState<EditorToolId>('captions');
    const [highlightWordsInput, setHighlightWordsInput] = useState(DEFAULT_HIGHLIGHT_WORDS);
    const [highlightColor, setHighlightColor] = useState('#f5f5f5');
    const [highlightUnderline, setHighlightUnderline] = useState(true);
    const [musicLevel, setMusicLevel] = useState(60);
    const [isExporting, setIsExporting] = useState(false);
    const [ffmpegLoading, setFfmpegLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const captionPreset = useMemo(() => getCaptionPresetById(captionPresetId), [captionPresetId]);
    const previewAspectRatio = useMemo(() => {
        if (aspectRatio === '1:1') return '1 / 1';
        if (aspectRatio === '16:9') return '16 / 9';
        if (aspectRatio === '4:5') return '4 / 5';
        return '9 / 16';
    }, [aspectRatio]);
    const previewWidth = useMemo(() => {
        if (aspectRatio === '16:9') return 'min(780px, 92%)';
        if (aspectRatio === '1:1') return 'min(560px, 80%)';
        if (aspectRatio === '4:5') return 'min(470px, 74%)';
        return 'min(430px, 64%)';
    }, [aspectRatio]);
    const timelineThumbnails = useMemo(
        () => Array.from({ length: 26 }, (_, index) => ({
            id: index,
            src: activeClip?.thumbnailUrl ?? project.thumbnailUrl ?? '/opus-capture/public.cdn.opus.pro/clip-web/images/thumbnail/tutorial_qAdcMVbrIeM__1.png'
        })),
        [activeClip?.thumbnailUrl, project.thumbnailUrl]
    );
    const waveformBars = useMemo(
        () => Array.from({ length: 200 }, (_, index) => 8 + Math.round(Math.abs(Math.sin(index * 0.41)) * 24)),
        []
    );
    const normalizedHighlightWords = useMemo(
        () =>
            new Set(
                highlightWordsInput
                    .split(',')
                    .map((word) => word.trim().toLowerCase())
                    .filter(Boolean)
            ),
        [highlightWordsInput]
    );

    useEffect(() => {
        const fallbackPreset = getCaptionPresetById(CAPTION_PRESETS[0].id);
        const draftDefaults: EditorDraft = {
            trimRange: [0, clipDurationMs],
            editingTranscript: clipTranscript,
            captionPresetId: CAPTION_PRESETS[0].id,
            captionPlacement: 'bottom',
            fontFamilyOverride: fallbackPreset.fontFamily as (typeof OPUS_FONT_FAMILIES)[number],
            transitionStyleId: (fallbackPreset.transitionStyleId ?? OPUS_TRANSITION_STYLES[0].id) as TransitionStyleId,
            aspectRatio: '9:16',
            layoutMode: 'Fill',
            trackerEnabled: true,
            transcriptOnly: false,
            showTimeline: true,
            activeTool: 'captions',
            highlightWordsInput: DEFAULT_HIGHLIGHT_WORDS,
            highlightColor: '#f5f5f5',
            highlightUnderline: true,
            musicLevel: 60,
        };

        let nextState = draftDefaults;

        try {
            const saved = window.localStorage.getItem(draftKey);
            if (saved) {
                const parsed = JSON.parse(saved) as Partial<EditorDraft>;
                nextState = {
                    ...draftDefaults,
                    ...parsed,
                    trimRange: Array.isArray(parsed.trimRange) && parsed.trimRange.length === 2
                        ? [Math.max(0, parsed.trimRange[0]), Math.min(clipDurationMs, parsed.trimRange[1])]
                        : draftDefaults.trimRange,
                    editingTranscript: Array.isArray(parsed.editingTranscript) && parsed.editingTranscript.length
                        ? parsed.editingTranscript
                        : draftDefaults.editingTranscript,
                };
            }
        } catch (error) {
            console.warn('Failed to restore editor draft', error);
        }

        setTrimRange(nextState.trimRange[1] > nextState.trimRange[0] ? nextState.trimRange : [0, clipDurationMs]);
        setEditingTranscript(nextState.editingTranscript);
        setCaptionPresetId(nextState.captionPresetId);
        setCaptionPlacement(nextState.captionPlacement);
        setFontFamilyOverride(nextState.fontFamilyOverride);
        setTransitionStyleId(nextState.transitionStyleId);
        setAspectRatio(nextState.aspectRatio);
        setLayoutMode(nextState.layoutMode);
        setTrackerEnabled(nextState.trackerEnabled);
        setTranscriptOnly(nextState.transcriptOnly);
        setShowTimeline(nextState.showTimeline);
        setActiveTool(nextState.activeTool);
        setHighlightWordsInput(nextState.highlightWordsInput);
        setHighlightColor(nextState.highlightColor);
        setHighlightUnderline(nextState.highlightUnderline);
        setMusicLevel(nextState.musicLevel);
        setSaveMessage('');
    }, [clipDurationMs, clipTranscript, draftKey]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => {
            const relativeMs = video.currentTime * 1000 - (usesProjectSource ? clipStartMs : 0);
            const safeRelativeMs = Math.max(0, relativeMs);
            setCurrentTime(safeRelativeMs);

            if (safeRelativeMs >= trimRange[1] && !video.paused) {
                video.pause();
                setIsPlaying(false);
            }
        };

        const updateDuration = () => {
            const nextDuration = usesProjectSource ? clipDurationMs : (video.duration * 1000 || clipDurationMs);
            setDuration(nextDuration);

            if (usesProjectSource) {
                video.currentTime = clipStartMs / 1000;
                setCurrentTime(0);
            }
        };

        const handleEnded = () => setIsPlaying(false);

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);
        video.addEventListener('ended', handleEnded);

        if (video.readyState >= 1) {
            updateDuration();
        }

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
            video.removeEventListener('ended', handleEnded);
        };
    }, [clipDurationMs, clipStartMs, trimRange, usesProjectSource, clipVideoSrc]);

    useEffect(() => {
        const load = async () => {
            const ffmpeg = ffmpegRef.current;
            if (ffmpeg.loaded) return;
            setFfmpegLoading(true);
            try {
                const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
                await ffmpeg.load({
                    coreURL: `${baseURL}/ffmpeg-core.js`,
                    wasmURL: `${baseURL}/ffmpeg-core.wasm`,
                });
            } catch (err) {
                console.error('FFmpeg load failed:', err);
            } finally {
                setFfmpegLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!saveMessage) return;
        const timeout = window.setTimeout(() => setSaveMessage(''), 2200);
        return () => window.clearTimeout(timeout);
    }, [saveMessage]);

    const handleCaptionPresetChange = (nextPresetId: string) => {
        const nextPreset = getCaptionPresetById(nextPresetId);
        setCaptionPresetId(nextPresetId);
        setFontFamilyOverride(nextPreset.fontFamily as (typeof OPUS_FONT_FAMILIES)[number]);
        setTransitionStyleId((nextPreset.transitionStyleId ?? OPUS_TRANSITION_STYLES[0].id) as TransitionStyleId);
    };

    const togglePlay = async () => {
        const video = videoRef.current;
        if (!video) return;

        const startMs = usesProjectSource ? clipStartMs + trimRange[0] : trimRange[0];
        const endMs = usesProjectSource ? clipStartMs + trimRange[1] : trimRange[1];
        const relativeMs = video.currentTime * 1000 - (usesProjectSource ? clipStartMs : 0);

        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
            return;
        }

        if (relativeMs < trimRange[0] || relativeMs >= trimRange[1] - 40) {
            video.currentTime = startMs / 1000;
            setCurrentTime(trimRange[0]);
        }

        try {
            await video.play();
            setIsPlaying(true);
        } catch (error) {
            console.error('Failed to start preview playback', error);
            video.currentTime = endMs / 1000;
            setIsPlaying(false);
        }
    };

    const handleWordClick = (startMs: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = (usesProjectSource ? clipStartMs + startMs : startMs) / 1000;
        setCurrentTime(startMs);
    };

    const handleWordChange = (segmentId: number, wordIndex: number, newText: string) => {
        setEditingTranscript((prev) => prev.map((segment) => {
            if (segment.id !== segmentId) return segment;
            const words = [...segment.words];
            words[wordIndex] = { ...words[wordIndex], word: newText };
            return {
                ...segment,
                words,
                text: words.map((word) => word.word).join(' '),
            };
        }));
    };

    const normalizeWord = (value: string) => value.toLowerCase().replace(/[^\w]/g, '');
    const escapeAssText = (value: string) =>
        value.replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/\n/g, '\\N');
    const toAssColor = (hex: string) => {
        const safe = hex.replace('#', '');
        if (safe.length !== 6) return '&H00FFFFFF';
        const r = safe.slice(0, 2);
        const g = safe.slice(2, 4);
        const b = safe.slice(4, 6);
        return `&H00${b}${g}${r}`.toUpperCase();
    };
    const formatAssTime = (ms: number) => {
        const totalCentiseconds = Math.max(0, Math.floor(ms / 10));
        const cs = totalCentiseconds % 100;
        const totalSeconds = Math.floor(totalCentiseconds / 100);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
    };
    const placementToAlignment = (placement: CaptionPlacement) => {
        if (placement === 'top') return 8;
        if (placement === 'middle') return 5;
        return 2;
    };

    const generateAss = (preset: CaptionPreset) => {
        const alignment = placementToAlignment(captionPlacement);
        const letterSpacing = preset.letterSpacing ?? 0;
        const chosenFontFamily = fontFamilyOverride || preset.fontFamily;
        const primaryColor = toAssColor(preset.primaryColor);
        const secondaryColor = toAssColor(preset.secondaryColor);
        const outlineColor = toAssColor(preset.outlineColor);
        const backColor = toAssColor(preset.backColor);

        let ass = '';
        ass += '[Script Info]\n';
        ass += 'ScriptType: v4.00+\n';
        ass += 'PlayResX: 1080\n';
        ass += 'PlayResY: 1920\n';
        ass += 'ScaledBorderAndShadow: yes\n';
        ass += 'WrapStyle: 2\n\n';
        ass += '[V4+ Styles]\n';
        ass += 'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ';
        ass += 'ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n';
        ass += `Style: Base,${chosenFontFamily},${preset.fontSize},${primaryColor},${secondaryColor},${outlineColor},${backColor},${preset.bold ? -1 : 0},`;
        ass += `${preset.italic ? -1 : 0},0,0,100,100,${letterSpacing},0,${preset.borderStyle},${preset.outline},${preset.shadow},${alignment},70,70,${captionPlacement === 'middle' ? 0 : 90},1\n\n`;
        ass += '[Events]\n';
        ass += 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';

        if (preset.templateId === 'none') {
            return ass;
        }

        editingTranscript.forEach((segment) => {
            const emphasisWordIndex = preset.autoEmphasis === 'keyword'
                ? findEmphasisWordIndex(segment.words, normalizeWord)
                : -1;
            const emphasisAssColor = toAssColor(preset.emphasisColor ?? highlightColor);
            const emphasisScale = Math.round((preset.emphasisScale ?? 1) * 100);
            const styledLines = splitCaptionWords(segment.words, preset.maxLines ?? 1).map((line) => line.map((word) => {
                const normalized = normalizeWord(word.word);
                const shouldEmphasize = normalizedHighlightWords.has(normalized)
                    || word.globalIndex === emphasisWordIndex;
                const finalWord = preset.uppercase ? word.word.toUpperCase() : word.word;
                if (!shouldEmphasize) return escapeAssText(finalWord);
                const underlineStart = highlightUnderline && preset.autoEmphasis !== 'keyword' ? '\\u1' : '';
                const underlineEnd = highlightUnderline && preset.autoEmphasis !== 'keyword' ? '\\u0' : '';
                return `{\\c${emphasisAssColor}\\fscx${emphasisScale}\\fscy${emphasisScale}${underlineStart}}${escapeAssText(finalWord)}{\\r${underlineEnd}}`;
            }).join(' '));

            ass += `Dialogue: 0,${formatAssTime(segment.start)},${formatAssTime(segment.end)},Base,,0,0,0,,${styledLines.join('\\N')}\n`;
        });

        return ass;
    };

    const saveDraft = () => {
        const draft: EditorDraft = {
            trimRange,
            editingTranscript,
            captionPresetId,
            captionPlacement,
            fontFamilyOverride,
            transitionStyleId,
            aspectRatio,
            layoutMode,
            trackerEnabled,
            transcriptOnly,
            showTimeline,
            activeTool,
            highlightWordsInput,
            highlightColor,
            highlightUnderline,
            musicLevel,
        };

        window.localStorage.setItem(draftKey, JSON.stringify(draft));
        setSaveMessage('Changes saved');
    };

    const handleExport = async () => {
        const ffmpeg = ffmpegRef.current;
        if (!clipVideoSrc || !ffmpeg.loaded) {
            alert(ffmpeg.loaded ? 'No source video path found.' : 'FFmpeg is still loading...');
            return;
        }

        try {
            setIsExporting(true);
            const assContent = generateAss(captionPreset);
            const startMs = usesProjectSource ? clipStartMs + trimRange[0] : trimRange[0];
            const endMs = usesProjectSource ? clipStartMs + trimRange[1] : trimRange[1];
            const videoData = await fetchFile(clipVideoSrc);
            await ffmpeg.writeFile('input.mp4', videoData);
            await ffmpeg.writeFile('subs.ass', new TextEncoder().encode(assContent));

            await ffmpeg.exec([
                '-y',
                '-i', 'input.mp4',
                '-ss', (startMs / 1000).toString(),
                '-to', (endMs / 1000).toString(),
                '-vf', 'subtitles=subs.ass',
                '-c:v', 'libx264',
                '-preset', 'ultrafast',
                '-c:a', 'aac',
                'output.mp4'
            ]);

            const fileData = await ffmpeg.readFile('output.mp4');
            const blob = new Blob([fileData as BlobPart], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `${(activeClip?.hook || project.name).replace(/\s+/g, '_').slice(0, 48)}.mp4`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert(`Export failed: ${error}`);
        } finally {
            setIsExporting(false);
        }
    };

    const activeCaptionSegment = useMemo(
        () => editingTranscript.find((segment) => currentTime >= segment.start && currentTime < segment.end) ?? null,
        [currentTime, editingTranscript]
    );
    const previewCaptionLines = useMemo(
        () => activeCaptionSegment ? splitCaptionWords(activeCaptionSegment.words, captionPreset.maxLines ?? 1) : [],
        [activeCaptionSegment, captionPreset.maxLines]
    );
    const autoEmphasisWordIndex = useMemo(
        () => activeCaptionSegment && captionPreset.autoEmphasis === 'keyword'
            ? findEmphasisWordIndex(activeCaptionSegment.words, normalizeWord)
            : -1,
        [activeCaptionSegment, captionPreset.autoEmphasis]
    );

    const previewCaptionStyle: CSSProperties = useMemo(() => {
        const placementStyle: Record<CaptionPlacement, CSSProperties> = {
            top: { top: 24, bottom: 'auto', transform: 'none' },
            middle: { top: '50%', bottom: 'auto', transform: 'translateY(-50%)' },
            bottom: { top: 'auto', bottom: 24, transform: 'none' },
        };

        return {
            position: 'absolute',
            left: 16,
            right: 16,
            textAlign: 'center',
            fontFamily: fontFamilyOverride,
            fontSize: Math.max(16, Math.round(captionPreset.fontSize * 0.42)),
            fontWeight: captionPreset.bold ? 800 : 500,
            fontStyle: captionPreset.italic ? 'italic' : 'normal',
            color: captionPreset.primaryColor,
            textTransform: captionPreset.uppercase ? 'uppercase' : 'none',
            WebkitTextStroke: `${Math.max(1, captionPreset.outline)}px ${captionPreset.outlineColor}`,
            paintOrder: 'stroke fill',
            textShadow: `0 2px ${Math.max(1, captionPreset.shadow)}px rgba(0,0,0,0.9)`,
            background: captionPreset.borderStyle === 3 ? 'rgba(15, 16, 20, 0.72)' : 'transparent',
            borderRadius: 6,
            padding: captionPreset.borderStyle === 3 ? '8px 12px' : '0',
            lineHeight: 1.08,
            zIndex: 4,
            display: 'grid',
            gap: 6,
            ...placementStyle[captionPlacement],
        };
    }, [captionPlacement, captionPreset, fontFamilyOverride]);

    const selectedTransitionLabel = OPUS_TRANSITION_STYLES.find((styleOption) => styleOption.id === transitionStyleId)?.label ?? 'Bounce';
    const toolPanelTitle = {
        captions: 'Caption style',
        transcript: 'Transcript',
        upload: 'Upload',
        'brand-template': 'Brand template',
        'b-roll': 'B-Roll',
        transitions: 'Transitions',
        text: 'Text',
        music: 'Music',
        'ai-hook': 'AI hook',
        'ai-enhance': 'AI enhance',
    }[activeTool];

    const focusTranscriptPanel = () => transcriptPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const renderToolPanel = () => {
        const panelStyle: CSSProperties = {
            width: 304,
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            background: '#090909',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
        };
        const headerStyle: CSSProperties = {
            padding: '18px 18px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
        };
        const bodyStyle: CSSProperties = {
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            overflowY: 'auto',
            minHeight: 0,
        };
        const mutedStyle: CSSProperties = { fontSize: 12, lineHeight: 1.6, color: '#8f8f8f' };
        const buttonStyle: CSSProperties = {
            height: 36,
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.12)',
            background: '#121212',
            color: '#f5f5f5',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
        };

        if (activeTool === 'captions') {
            return (
                <div style={panelStyle}>
                    <div style={headerStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>Caption style</div>
                        <div style={mutedStyle}>Use the left panel to edit words, fonts, presets, placement, and effects.</div>
                    </div>
                    <div style={bodyStyle}>
                        <div style={{ display: 'grid', gap: 10 }}>
                            <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12 }}>
                                <div style={{ fontSize: 11, color: '#8f8f8f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Preset</div>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>{captionPreset.label}</div>
                            </div>
                            <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12 }}>
                                <div style={{ fontSize: 11, color: '#8f8f8f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Placement</div>
                                <div style={{ fontSize: 14, fontWeight: 700 }}>{CAPTION_PLACEMENTS.find((item) => item.id === captionPlacement)?.label ?? 'Bottom'}</div>
                            </div>
                        </div>
                        <button style={buttonStyle} onClick={focusTranscriptPanel}>Focus left settings panel</button>
                    </div>
                </div>
            );
        }

        if (activeTool === 'transcript') {
            return (
                <div style={panelStyle}>
                    <div style={headerStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>Transcript</div>
                        <div style={mutedStyle}>Click any word to edit, adjust, or instantly generate AI B-Roll.</div>
                    </div>
                    <div style={bodyStyle}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#d4d4d4' }}>
                            <input type="checkbox" checked={transcriptOnly} onChange={(event) => setTranscriptOnly(event.target.checked)} />
                            Transcript only
                        </label>
                        <button style={buttonStyle} onClick={focusTranscriptPanel}><Plus size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Add a section</button>
                    </div>
                </div>
            );
        }

        if (activeTool === 'transitions') {
            return (
                <div style={panelStyle}>
                    <div style={headerStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>Transitions</div>
                        <div style={mutedStyle}>Choose how highlighted words animate into the clip.</div>
                    </div>
                    <div style={bodyStyle}>
                        {OPUS_TRANSITION_STYLES.slice(0, 8).map((styleOption) => (
                            <button
                                key={styleOption.id}
                                onClick={() => setTransitionStyleId(styleOption.id)}
                                style={{
                                    ...buttonStyle,
                                    textAlign: 'left',
                                    padding: '0 12px',
                                    background: transitionStyleId === styleOption.id ? '#f3f4f6' : '#121212',
                                    color: transitionStyleId === styleOption.id ? '#050505' : '#f5f5f5',
                                }}
                            >
                                {styleOption.label}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (activeTool === 'music') {
            return (
                <div style={panelStyle}>
                    <div style={headerStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>Music</div>
                        <div style={mutedStyle}>Dial in background music level for the selected short.</div>
                    </div>
                    <div style={bodyStyle}>
                        <div style={{ fontSize: 12, color: '#8f8f8f' }}>Music level</div>
                        <input type="range" min={0} max={100} value={musicLevel} onChange={(event) => setMusicLevel(Number(event.target.value))} />
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{musicLevel}%</div>
                    </div>
                </div>
            );
        }

        if (activeTool === 'brand-template') {
            return (
                <div style={panelStyle}>
                    <div style={headerStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>Brand template</div>
                        <div style={mutedStyle}>Stand out with customizable templates for layouts, captions, and more.</div>
                    </div>
                    <div style={bodyStyle}>
                        <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12, display: 'grid', gap: 6 }}>
                            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8f8f8f' }}>Current layout</span>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>{layoutMode} · {aspectRatio}</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTool === 'upload') {
            return (
                <div style={panelStyle}>
                    <div style={headerStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>Upload</div>
                        <div style={mutedStyle}>Add or drag file here for intro, outro, overlays, or extra media.</div>
                    </div>
                    <div style={bodyStyle}>
                        <div style={{ border: '1px dashed rgba(255,255,255,0.18)', borderRadius: 8, padding: 16, fontSize: 12, color: '#a3a3a3' }}>
                            Current source: {project.fileName}
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTool === 'b-roll') {
            return (
                <div style={panelStyle}>
                    <div style={headerStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>B-Roll</div>
                        <div style={mutedStyle}>Generate B-Roll in just one click. You can also search in Stock B-Roll.</div>
                    </div>
                    <div style={bodyStyle}>
                        {[...normalizedHighlightWords].slice(0, 4).map((word) => (
                            <div key={word} style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 10, fontSize: 13, color: '#f3f4f6' }}>{word}</div>
                        ))}
                    </div>
                </div>
            );
        }

        if (activeTool === 'text') {
            return (
                <div style={panelStyle}>
                    <div style={headerStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>Text</div>
                        <div style={mutedStyle}>Overlay text layers for hooks, CTAs, and labels.</div>
                    </div>
                    <div style={bodyStyle}>
                        <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12, fontSize: 13 }}>Short-form growth hook</div>
                    </div>
                </div>
            );
        }

        if (activeTool === 'ai-hook') {
            return (
                <div style={panelStyle}>
                    <div style={headerStyle}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>AI hook</div>
                        <div style={mutedStyle}>Refine the opening line and make the first seconds stronger.</div>
                    </div>
                    <div style={bodyStyle}>
                        <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12, fontSize: 13, lineHeight: 1.6 }}>{activeClip?.hook ?? project.name}</div>
                    </div>
                </div>
            );
        }

        return (
            <div style={panelStyle}>
                <div style={headerStyle}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{toolPanelTitle}</div>
                    <div style={mutedStyle}>Find frequently used editor actions here, including caption styles, AI enhance, upload, and more.</div>
                </div>
                <div style={bodyStyle}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#d4d4d4' }}>
                        <input type="checkbox" checked={trackerEnabled} onChange={(event) => setTrackerEnabled(event.target.checked)} />
                        Keep smart tracking on
                    </label>
                </div>
            </div>
        );
    };

    const tools = [
        { id: 'ai-enhance' as const, icon: <Sparkles size={18} />, label: 'AI enhance' },
        { id: 'captions' as const, icon: <ClosedCaption size={18} />, label: 'Caption style' },
        { id: 'transcript' as const, icon: <FileText size={18} />, label: 'Transcript' },
        { id: 'upload' as const, icon: <Upload size={18} />, label: 'Upload' },
        { id: 'brand-template' as const, icon: <LayoutIcon size={18} />, label: 'Brand template' },
        { id: 'b-roll' as const, icon: <Play size={18} />, label: 'B-Roll' },
        { id: 'transitions' as const, icon: <Scissors size={18} />, label: 'Transitions' },
        { id: 'text' as const, icon: <Type size={18} />, label: 'Text' },
        { id: 'music' as const, icon: <Music size={18} />, label: 'Music' },
        { id: 'ai-hook' as const, icon: <RotateCcw size={18} />, label: 'AI hook' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#050505', color: 'white' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', background: '#050505', borderBottom: '1px solid rgba(255,255,255,0.08)', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                    <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                        <ChevronLeft size={18} />
                    </button>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7d7d7d', marginBottom: 2 }}>Edit saved clip</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f5', maxWidth: 460, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {activeClip?.hook ?? project.name}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, color: '#6b7280' }}>
                        <Undo2 size={16} style={{ cursor: 'pointer' }} />
                        <Redo2 size={16} style={{ cursor: 'pointer' }} />
                        <Monitor size={16} style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {saveMessage && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#d4d4d4', fontSize: 12, fontWeight: 600 }}>
                            <Check size={14} /> {saveMessage}
                        </div>
                    )}
                    <button onClick={saveDraft} style={{ background: '#111111', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.10)', padding: '8px 14px', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Save changes
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting || ffmpegLoading}
                        style={{
                            background: isExporting || ffmpegLoading ? '#6b7280' : '#ffffff',
                            color: '#050505',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: 4,
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: isExporting || ffmpegLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {ffmpegLoading ? 'Loading core...' : isExporting ? 'Exporting...' : 'Export'}
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                <aside ref={transcriptPanelRef} style={{ width: 368, borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', background: '#050505', minHeight: 0 }}>
                    <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: 11, color: '#7d7d7d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Edit captions</div>
                        <div style={{ fontSize: 13, color: '#b0b0b0', lineHeight: 1.6 }}>Click any word to edit, adjust, or instantly generate AI B-Roll.</div>
                    </div>

                    <div style={{ margin: '16px 18px 10px', border: '1px solid rgba(255,255,255,0.08)', background: '#0f1013', borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 11, color: '#7d7d7d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Caption settings</div>
                        <div style={{ display: 'grid', gap: 8 }}>
                            <select
                                value={captionPresetId}
                                onChange={(event) => handleCaptionPresetChange(event.target.value)}
                                style={{ background: '#090a0d', border: '1px solid #2a2c35', color: '#f3f4f6', borderRadius: 4, padding: '8px 10px', fontSize: 12 }}
                            >
                                {CAPTION_PRESETS.map((preset) => (
                                    <option key={preset.id} value={preset.id}>{preset.label}</option>
                                ))}
                            </select>
                            <select
                                value={fontFamilyOverride}
                                onChange={(event) => setFontFamilyOverride(event.target.value as typeof OPUS_FONT_FAMILIES[number])}
                                style={{ background: '#090a0d', border: '1px solid #2a2c35', color: '#f3f4f6', borderRadius: 4, padding: '8px 10px', fontSize: 12 }}
                            >
                                {OPUS_FONT_FAMILIES.map((fontFamily) => (
                                    <option key={fontFamily} value={fontFamily}>{fontFamily}</option>
                                ))}
                            </select>
                            <select
                                value={transitionStyleId}
                                onChange={(event) => setTransitionStyleId(event.target.value as (typeof OPUS_TRANSITION_STYLES)[number]['id'])}
                                style={{ background: '#090a0d', border: '1px solid #2a2c35', color: '#f3f4f6', borderRadius: 4, padding: '8px 10px', fontSize: 12 }}
                            >
                                {OPUS_TRANSITION_STYLES.map((styleOption) => (
                                    <option key={styleOption.id} value={styleOption.id}>{styleOption.label}</option>
                                ))}
                            </select>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                <select
                                    value={captionPlacement}
                                    onChange={(event) => setCaptionPlacement(event.target.value as CaptionPlacement)}
                                    style={{ background: '#090a0d', border: '1px solid #2a2c35', color: '#f3f4f6', borderRadius: 4, padding: '8px 10px', fontSize: 12 }}
                                >
                                    {CAPTION_PLACEMENTS.map((placement) => (
                                        <option key={placement.id} value={placement.id}>{placement.label}</option>
                                    ))}
                                </select>
                                <input
                                    value={highlightWordsInput}
                                    onChange={(event) => setHighlightWordsInput(event.target.value)}
                                    placeholder="Keywords to highlight"
                                    style={{ background: '#090a0d', border: '1px solid #2a2c35', color: '#f3f4f6', borderRadius: 4, padding: '8px 10px', fontSize: 12 }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <input type="color" value={highlightColor} onChange={(event) => setHighlightColor(event.target.value)} style={{ width: 32, height: 28, border: 0, background: 'transparent' }} />
                                    <span style={{ fontSize: 12, color: '#d1d5db' }}>Highlight color</span>
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d1d5db', fontSize: 12 }}>
                                    <input type="checkbox" checked={highlightUnderline} onChange={(event) => setHighlightUnderline(event.target.checked)} />
                                    Underline
                                </label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8f8f8f' }}>
                                <span>Transition</span>
                                <span style={{ color: '#f5f5f5' }}>{selectedTransitionLabel}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '0 18px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#9ca3af' }}>
                            <input type="checkbox" checked={transcriptOnly} onChange={(event) => setTranscriptOnly(event.target.checked)} style={{ width: 14, height: 14 }} />
                            Transcript only
                        </label>
                    </div>

                    <button style={{ margin: '0 18px 16px', background: '#101113', color: 'white', border: '1px solid rgba(255,255,255,0.08)', padding: '9px 10px', borderRadius: 4, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', cursor: 'pointer' }}>
                        <Plus size={14} /> Add a section
                    </button>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 18px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, lineHeight: 1.9 }}>
                            {editingTranscript.flatMap((segment) => segment.words.map((word, wordIndex) => ({ ...word, segmentId: segment.id, wordIndex }))).map((word, index) => {
                                const isCurrent = currentTime >= word.start && currentTime < word.end;
                                const isHighlighted = normalizedHighlightWords.has(normalizeWord(word.word));
                                return (
                                    <span
                                        key={`${word.segmentId}-${word.wordIndex}-${index}`}
                                        onClick={() => handleWordClick(word.start)}
                                        contentEditable
                                        onBlur={(event) => handleWordChange(word.segmentId, word.wordIndex, event.currentTarget.textContent || '')}
                                        suppressContentEditableWarning
                                        style={{
                                            fontSize: 15,
                                            padding: '2px 4px',
                                            borderRadius: 3,
                                            cursor: 'pointer',
                                            color: transcriptOnly ? '#d1d5db' : (isCurrent ? '#050505' : (isHighlighted ? '#f5f5f5' : '#9ca3af')),
                                            background: isCurrent ? '#f3f4f6' : 'transparent',
                                            transition: 'all 0.12s ease',
                                            borderBottom: !transcriptOnly && isHighlighted ? '1px solid rgba(255,255,255,0.72)' : 'none',
                                            outline: 'none'
                                        }}
                                    >
                                        {word.word}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: '#050505', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 24, padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13, color: '#9ca3af' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <LayoutIcon size={14} />
                            <select value={aspectRatio} onChange={(event) => setAspectRatio(event.target.value as '9:16' | '1:1' | '16:9' | '4:5')} style={{ background: '#090a0d', border: '1px solid #2a2c35', color: '#f3f4f6', borderRadius: 4, padding: '4px 8px', fontSize: 12 }}>
                                <option value="9:16">9:16</option>
                                <option value="1:1">1:1</option>
                                <option value="16:9">16:9</option>
                                <option value="4:5">4:5</option>
                            </select>
                        </div>
                        <button onClick={() => setLayoutMode((current) => current === 'Fill' ? 'Fit' : 'Fill')} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'transparent', border: 'none', color: '#9ca3af', padding: 0 }}>
                            <Maximize size={14} /> Layout: {layoutMode}
                        </button>
                        <button onClick={() => setTrackerEnabled((current) => !current)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'transparent', border: 'none', color: '#9ca3af', padding: 0 }}>
                            <Wand2 size={14} /> Tracker: {trackerEnabled ? 'ON' : 'OFF'}
                        </button>
                        <div style={{ marginLeft: 24, display: 'flex', alignItems: 'center', gap: 8, background: '#101113', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '6px 8px' }}>
                            <Monitor size={14} color="#d1d5db" />
                            <ImageIcon size={14} color="#9ca3af" />
                            <ChevronDown size={14} color="#9ca3af" />
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 40px', minHeight: 0 }}>
                        <div style={{ width: previewWidth, aspectRatio: previewAspectRatio, background: '#111214', borderRadius: 8, position: 'relative', boxShadow: '0 24px 50px rgba(0,0,0,0.45)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.10)' }}>
                            <video ref={videoRef} src={clipVideoSrc} style={{ width: '100%', height: '100%', objectFit: layoutMode === 'Fill' ? 'cover' : 'contain', background: '#000' }} playsInline />
                            {captionPreset.templateId !== 'none' && activeCaptionSegment && (
                                <div style={previewCaptionStyle}>
                                    {previewCaptionLines.map((line, lineIndex) => (
                                        <div key={`line-${lineIndex}`} style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                                            {line.map((word) => {
                                                const normalized = normalizeWord(word.word);
                                                const isHit = normalizedHighlightWords.has(normalized)
                                                    || word.globalIndex === autoEmphasisWordIndex;
                                                const shouldUnderline = isHit && highlightUnderline && captionPreset.autoEmphasis !== 'keyword';
                                                const baseFontSize = Math.max(16, Math.round(captionPreset.fontSize * 0.42));
                                                return (
                                                    <span
                                                        key={`${word.start}-${word.globalIndex}`}
                                                        style={{
                                                            display: 'inline-block',
                                                            color: isHit ? (captionPreset.emphasisColor ?? highlightColor) : captionPreset.primaryColor,
                                                            textDecoration: shouldUnderline ? 'underline' : 'none',
                                                            textDecorationThickness: shouldUnderline ? 2 : undefined,
                                                            fontSize: isHit ? Math.round(baseFontSize * (captionPreset.emphasisScale ?? 1)) : baseFontSize,
                                                            lineHeight: 1,
                                                        }}
                                                    >
                                                        {captionPreset.uppercase ? word.word.toUpperCase() : word.word}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!isPlaying && (
                                <div onClick={togglePlay} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 62, height: 62, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5 }}>
                                    <Play size={28} fill="black" stroke="none" style={{ marginLeft: 4 }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ width: activeTool ? 384 : 80, display: 'flex', minHeight: 0, borderLeft: '1px solid rgba(255,255,255,0.08)', background: '#050505' }}>
                    {activeTool && renderToolPanel()}
                    <div style={{ width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: 18, background: '#050505' }}>
                        {tools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTool((current) => current === tool.id ? tool.id : tool.id)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 5,
                                    cursor: 'pointer',
                                    opacity: activeTool === tool.id ? 1 : 0.64,
                                    background: 'transparent',
                                    border: 'none',
                                    color: activeTool === tool.id ? '#ffffff' : '#9ca3af',
                                    width: 72,
                                }}
                            >
                                <div style={{ width: 38, height: 38, borderRadius: 6, display: 'grid', placeItems: 'center', border: `1px solid ${activeTool === tool.id ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)'}`, background: activeTool === tool.id ? 'rgba(255,255,255,0.08)' : 'transparent', color: activeTool === tool.id ? '#f3f4f6' : '#9ca3af' }}>
                                    {tool.icon}
                                </div>
                                <span style={{ fontSize: 10, textAlign: 'center', width: 64, color: activeTool === tool.id ? '#f3f4f6' : '#9ca3af' }}>{tool.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ height: showTimeline ? 188 : 54, borderTop: '1px solid rgba(255,255,255,0.08)', background: '#050505', display: 'flex', flexDirection: 'column', transition: 'height 0.2s ease' }}>
                <div style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button onClick={() => setShowTimeline((current) => !current)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', cursor: 'pointer', background: 'transparent', border: 'none' }}>
                            <PlayCircle size={14} /> {showTimeline ? 'Hide timeline' : 'Show timeline'}
                        </button>
                        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.10)' }} />
                        <div style={{ display: 'flex', gap: 12, color: '#9ca3af' }}>
                            <PanelRightOpen size={14} style={{ cursor: 'pointer' }} />
                            <Trash2 size={14} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{formatMs(currentTime)} / {formatMs(duration)}</span>
                    </div>
                </div>

                {showTimeline && (
                    <div style={{ flex: 1, padding: '12px 20px 14px', position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af' }}>
                            <span>Trim Start: {formatMs(trimRange[0])}</span>
                            <span>Trim End: {formatMs(trimRange[1])}</span>
                        </div>
                        <div style={{ height: 60, background: '#111214', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', position: 'relative', padding: '0 10px' }}>
                            <div style={{ paddingTop: 20 }}>
                                <Slider
                                    range
                                    min={0}
                                    max={duration > 0 ? duration : clipDurationMs}
                                    value={trimRange}
                                    onChange={(value) => setTrimRange(value as [number, number])}
                                    trackStyle={[{ backgroundColor: '#f3f4f6', height: 8 }]}
                                    handleStyle={[
                                        { borderColor: '#fff', backgroundColor: '#f3f4f6', opacity: 1, width: 16, height: 16, marginTop: -4 },
                                        { borderColor: '#fff', backgroundColor: '#f3f4f6', opacity: 1, width: 16, height: 16, marginTop: -4 }
                                    ]}
                                    railStyle={{ backgroundColor: 'rgba(255,255,255,0.10)', height: 8 }}
                                />
                            </div>
                            <div style={{ position: 'absolute', left: `calc(10px + ${(currentTime / (duration || 1)) * 100}%)`, top: 0, height: '100%', width: 2, background: 'white', zIndex: 10, pointerEvents: 'none' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '34px 1fr 34px', gap: 8, alignItems: 'center' }}>
                            <button style={{ height: 34, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: '#101113', color: '#f3f4f6', fontSize: 20, cursor: 'pointer' }}>+</button>
                            <div style={{ height: 34, borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex', background: '#17181d' }}>
                                {timelineThumbnails.map((thumb) => (
                                    <img key={thumb.id} src={thumb.src} alt="timeline thumbnail" style={{ width: 32, height: 34, objectFit: 'cover', opacity: 0.95 }} />
                                ))}
                            </div>
                            <button style={{ height: 34, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: '#101113', color: '#f3f4f6', fontSize: 20, cursor: 'pointer' }}>+</button>
                        </div>

                        <div style={{ height: 26, borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: '#111214', display: 'flex', alignItems: 'center', padding: '0 8px', gap: 1 }}>
                            {waveformBars.map((height, index) => (
                                <span key={index} style={{ width: 1, height: Math.max(3, Math.min(24, height)), background: index % 6 === 0 ? '#6b7280' : '#4b5563', borderRadius: 1 }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
