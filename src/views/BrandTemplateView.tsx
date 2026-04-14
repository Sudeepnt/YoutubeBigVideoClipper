import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
    Undo, Redo, LayoutTemplate, Type, Image as ImageIcon, Video, Music,
    Scissors, Pause, Highlighter, Smile, Film, ArrowRightLeft,
    ChevronDown, Maximize, Target, Grid3X3, Grid2X2, Columns, MonitorUp,
    Gamepad2, Info, ChevronRight, Play
} from 'lucide-react';
import {
    OPUS_CAPTION_TEMPLATES,
    OPUS_FONT_FAMILIES,
    OPUS_TRANSITION_STYLES,
    formatOpusFontLabel,
    formatOpusTemplateLabel
} from '../lib/opusBrandTemplates';
import { CAPTION_STYLE_OPTIONS, CaptionStylePreview } from '../components/results/CaptionSelector';
import type { CaptionStyleTone } from '../components/results/types';
import './BrandTemplateView.css';

type ActivePanel = 'none' | 'layout' | 'caption';
type CaptionTab = 'presets' | 'font' | 'effects';

type PreviewCaptionWord = {
    text: string;
    colorSlot: 0 | 1 | 2;
};

type PreviewCaptionLine = {
    text: string;
    words: PreviewCaptionWord[];
};

type CaptionPresetCardOption = {
    templateId: string;
    name: string;
    desc: string;
    styleId: CaptionStyleTone | null;
};

const PREVIEW_DURATION_SECONDS = 60;
const PREVIEW_CYCLE_SECONDS = 3;
const PREVIEW_DEMO_EMOJI = '🥰';
const PREVIEW_ONE_LINE_WORDS: PreviewCaptionWord[] = [
    { text: 'THIS', colorSlot: 0 },
    { text: 'IS', colorSlot: 0 },
    { text: 'INCREDIBLY', colorSlot: 1 },
    { text: 'GOOD', colorSlot: 2 }
];
const PREVIEW_MULTI_LINE_LINES: PreviewCaptionLine[] = [
    {
        text: 'THIS IS',
        words: [
            { text: 'THIS', colorSlot: 0 },
            { text: 'IS', colorSlot: 0 }
        ]
    },
    {
        text: 'INCREDIBLY GOOD',
        words: [
            { text: 'INCREDIBLY', colorSlot: 1 },
            { text: 'GOOD', colorSlot: 2 }
        ]
    }
];

const BACKDROP_ANIMATION_IDS = [
    'word-level_karaoke_bg-highlight',
    'word-level_simple_bg-highlight',
    'highlighter-box-around',
    'simple-words-pop'
];

const NUMBERED_CAPTION_TEMPLATES = OPUS_CAPTION_TEMPLATES.filter((template) => template.templateId !== 'none');
const HIDDEN_CAPTION_SERIALS = new Set([2, 4, 7, 9, 10, 11, 13, 14, 16, 18, 19, 20, 21, 22]);
const VISIBLE_CAPTION_TEMPLATES = OPUS_CAPTION_TEMPLATES.filter((template) => {
    if (template.templateId === 'none') return true;
    const templateIndex = NUMBERED_CAPTION_TEMPLATES.findIndex((item) => item.templateId === template.templateId);
    return !HIDDEN_CAPTION_SERIALS.has(templateIndex + 1);
});
const VISIBLE_NON_NONE_CAPTION_TEMPLATES = VISIBLE_CAPTION_TEMPLATES.filter((template) => template.templateId !== 'none');
const BRAND_CAPTION_PRESET_OPTIONS: CaptionPresetCardOption[] = [
    {
        templateId: 'none',
        name: 'No captions',
        desc: 'Hide caption overlay',
        styleId: null
    },
    ...CAPTION_STYLE_OPTIONS
        .slice(0, VISIBLE_NON_NONE_CAPTION_TEMPLATES.length)
        .map((styleOption, index) => ({
            templateId: VISIBLE_NON_NONE_CAPTION_TEMPLATES[index].templateId,
            name: styleOption.name,
            desc: styleOption.desc,
            styleId: styleOption.id
        }))
];

const getCaptionTemplateDisplayLabel = (templateId: string, fallbackName: string) => {
    const mappedPreset = BRAND_CAPTION_PRESET_OPTIONS.find((option) => option.templateId === templateId);
    if (mappedPreset) return mappedPreset.name;
    if (templateId === 'none') return 'No captions';
    const templateIndex = NUMBERED_CAPTION_TEMPLATES.findIndex((template) => template.templateId === templateId);
    if (templateIndex >= 0) {
        return `Caption ${templateIndex + 1}`;
    }
    return formatOpusTemplateLabel(templateId, fallbackName);
};

const clampNumber = (value: number, min: number, max: number) => {
    return Math.min(max, Math.max(min, value));
};

const toScaledStroke = (
    stroke: { enabled?: boolean; width?: number; color?: string } | undefined,
    scale: number,
    maxWidth: number
) => {
    if (!stroke?.enabled) return undefined;
    const raw = typeof stroke.width === 'number' ? stroke.width : 0;
    const scaled = clampNumber(raw * scale, 0.5, maxWidth);
    return `${scaled}px ${stroke.color ?? '#000000'}`;
};

const toScaledShadow = (
    shadow: { enabled?: boolean; x?: number; y?: number; blur?: number; color?: string } | undefined,
    scale: number,
    maxOffset: number,
    maxBlur: number
) => {
    if (!shadow?.enabled) return undefined;
    const x = clampNumber((shadow.x ?? 0) * scale, 0, maxOffset);
    const y = clampNumber((shadow.y ?? 0) * scale, 0, maxOffset);
    const blur = clampNumber((shadow.blur ?? 0) * scale, 0, maxBlur);
    return `${x}px ${y}px ${blur}px ${shadow.color ?? '#000000'}`;
};

export default function BrandTemplateView() {
    const [activePanel, setActivePanel] = useState<ActivePanel>('none');
    const [captionTab, setCaptionTab] = useState<CaptionTab>('presets');

    // Toggles state
    const [toggles, setToggles] = useState({
        fillerWords: false,
        pauses: false,
        keywords: true,
        emojis: true,
        broll: false,
        transitions: false,
        uppercase: true,
        shadows: true,
    });

    const [aspectRatio, setAspectRatio] = useState('9:16');
    const [layoutStyle, setLayoutStyle] = useState('Fill');
    const [cropRatio, setCropRatio] = useState('Original ratio');

    // Caption Effects state
    const [captionPosition, setCaptionPosition] = useState('Auto');
    const [captionAnimation, setCaptionAnimation] = useState<string>(OPUS_TRANSITION_STYLES[0]?.id ?? 'pop');
    const [captionLines, setCaptionLines] = useState('One line');
    const [highlightColor, setHighlightColor] = useState('#f5f5f5');
    const [selectedCaptionTemplateId, setSelectedCaptionTemplateId] = useState<string>(
        BRAND_CAPTION_PRESET_OPTIONS[1]?.templateId ?? BRAND_CAPTION_PRESET_OPTIONS[0]?.templateId ?? 'none'
    );
    const [fontFamily, setFontFamily] = useState<(typeof OPUS_FONT_FAMILIES)[number]>(
        OPUS_FONT_FAMILIES[0] ?? 'Montserrat'
    );
    const [previewTime, setPreviewTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [videoDuration, setVideoDuration] = useState(0);
    const previewVideoRef = useRef<HTMLVideoElement | null>(null);
    const previewTickerRef = useRef<number | null>(null);

    const selectedCaptionTemplate = useMemo(() => {
        return OPUS_CAPTION_TEMPLATES.find((template) => template.templateId === selectedCaptionTemplateId)
            ?? OPUS_CAPTION_TEMPLATES[0];
    }, [selectedCaptionTemplateId]);

    const selectedTemplateLabel = selectedCaptionTemplate
        ? getCaptionTemplateDisplayLabel(selectedCaptionTemplate.templateId, selectedCaptionTemplate.name)
        : 'No captions';
    const selectedTemplateFont = formatOpusFontLabel(selectedCaptionTemplate?.preferences?.font?.family ?? 'Montserrat');

    useEffect(() => {
        if (selectedTemplateFont && OPUS_FONT_FAMILIES.includes(selectedTemplateFont as (typeof OPUS_FONT_FAMILIES)[number])) {
            setFontFamily(selectedTemplateFont as (typeof OPUS_FONT_FAMILIES)[number]);
        }
        const newHighlight = selectedCaptionTemplate?.preferences?.highlightColor?.primary;
        if (newHighlight) {
            setHighlightColor(newHighlight);
        }
        const newAnimation = selectedCaptionTemplate?.preferences?.captionAnimation?.name;
        if (newAnimation) {
            setCaptionAnimation(newAnimation);
        }
    }, [selectedCaptionTemplate, selectedTemplateFont]);

    const toggleSetting = (key: keyof typeof toggles) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const previewFont = selectedCaptionTemplate?.preferences?.font;
    const previewAnimation = selectedCaptionTemplate?.preferences?.captionAnimation?.name ?? '';
    const previewAnimationHighlight = selectedCaptionTemplate?.preferences?.captionAnimation?.highlightColor
        ?? selectedCaptionTemplate?.preferences?.highlightColor?.primary
        ?? previewFont?.color
        ?? '#FFFFFF';
    const previewAnimationBackground = selectedCaptionTemplate?.preferences?.captionAnimation?.bgColor ?? 'transparent';
    const previewEnableHighlight = selectedCaptionTemplate?.preferences?.enableHighlight ?? false;
    const previewEnableAnimation = selectedCaptionTemplate?.preferences?.enableCaptionAnimation ?? false;
    const previewTemplatePosition = selectedCaptionTemplate?.preferences?.captionPosition ?? 'auto';
    const previewStroke = previewFont?.stroke;
    const previewShadow = previewFont?.shadow;
    const previewPrimary = previewFont?.color ?? '#FFFFFF';
    const previewHighlightPrimary = selectedCaptionTemplate?.preferences?.highlightColor?.primary ?? previewPrimary;
    const previewSecondary = selectedCaptionTemplate?.preferences?.highlightColor?.secondary ?? previewHighlightPrimary;
    const previewUppercase = selectedCaptionTemplate?.preferences?.enableUppercase ?? false;
    const previewStrokeStyle = toScaledStroke(previewStroke, 0.16, 2.6);
    const previewShadowStyle = toScaledShadow(previewShadow, 0.18, 3.2, 4.5);
    const previewFontWeight = (() => {
        const numericWeight = previewFont?.style
            ?.map((style) => Number.parseInt(style, 10))
            .find((weight) => Number.isFinite(weight));
        if (numericWeight) return numericWeight;
        if (previewFont?.style?.some((style) => ['black', 'bold'].includes(style.toLowerCase()))) return 800;
        if (previewFont?.style?.some((style) => ['semibold', '600'].includes(style.toLowerCase()))) return 600;
        return 400;
    })();
    const previewFontSize = clampNumber((previewFont?.numericalSize ?? 48) * 0.62, 22, 56);
    const previewIsBackdropStyle = BACKDROP_ANIMATION_IDS.some((token) => previewAnimation.includes(token));
    const previewCaptionBaseStyle: CSSProperties = {
        fontFamily,
        textTransform: previewUppercase ? 'uppercase' : 'none',
        WebkitTextStroke: previewStrokeStyle,
        textShadow: previewShadowStyle,
        textDecoration: previewFont?.textDecoration || undefined,
        fontStyle: previewFont?.style?.some((style) => style.toLowerCase() === 'italic') ? 'italic' : 'normal'
    };
    const previewLineStyle: CSSProperties = {
        ...previewCaptionBaseStyle,
        fontWeight: previewFontWeight,
        fontSize: `${previewFontSize}px`
    };

    const previewVideoSrc = '/caption_ref.mp4';
    const previewPoster =
        selectedCaptionTemplate?.imgUrl
        || selectedCaptionTemplate?.gifUrl
        || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop';

    useEffect(() => {
        const previewVideo = previewVideoRef.current;
        if (!previewVideo) return;
        previewVideo.currentTime = 0;
        setPreviewTime(0);
        const playPromise = previewVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => undefined);
        }
    }, [selectedCaptionTemplateId]);

    useEffect(() => {
        const tick = () => {
            const previewVideo = previewVideoRef.current;
            if (!previewVideo) return;
            if (previewVideo.currentTime >= PREVIEW_DURATION_SECONDS) {
                previewVideo.currentTime = 0;
                previewVideo.play().catch(() => undefined);
                setPreviewTime(0);
                return;
            }
            setPreviewTime(previewVideo.currentTime);
        };

        window.clearInterval(previewTickerRef.current ?? undefined);
        previewTickerRef.current = window.setInterval(tick, 90);

        return () => {
            window.clearInterval(previewTickerRef.current ?? undefined);
            previewTickerRef.current = null;
        };
    }, [selectedCaptionTemplateId]);

    const previewCycleTime = useMemo(() => previewTime % PREVIEW_CYCLE_SECONDS, [previewTime]);
    const previewOverlayPositionStyle = useMemo<CSSProperties>(() => {
        if (previewTemplatePosition === 'top') {
            return { top: '18%', bottom: 'auto', transform: 'translateY(0)' };
        }
        if (previewTemplatePosition === 'middle') {
            return { top: '50%', bottom: 'auto', transform: 'translateY(-50%)' };
        }
        if (previewTemplatePosition === 'bottom') {
            return { bottom: '10%', top: 'auto', transform: 'translateY(0)' };
        }
        return { bottom: '20%', top: 'auto', transform: 'translateY(-50%)' };
    }, [previewTemplatePosition]);
    const activeCaptionLines = useMemo<PreviewCaptionLine[]>(() => {
        if (selectedCaptionTemplate?.preferences?.captionStyle === 'one-line') {
            const combinedWords = PREVIEW_ONE_LINE_WORDS;
            return [{
                text: combinedWords.map((word) => word.text).join(' '),
                words: combinedWords
            }];
        }
        return PREVIEW_MULTI_LINE_LINES;
    }, [selectedCaptionTemplate]);

    const totalCaptionWords = activeCaptionLines.reduce((count, line) => count + line.words.length, 0);
    const segmentProgress = clampNumber(
        previewCycleTime / PREVIEW_CYCLE_SECONDS,
        0,
        0.999
    );
    const activeWordIndex = totalCaptionWords > 0
        ? Math.min(totalCaptionWords - 1, Math.floor(segmentProgress * totalCaptionWords))
        : 0;
    const previewUsesWordBackdrop = [
        'word-level_karaoke_bg-highlight',
        'word-level_simple_bg-highlight',
        'simple-words-pop'
    ].includes(previewAnimation) && previewEnableAnimation;
    const previewUsesFrameBackground = previewAnimation === 'deep-diver' && previewEnableAnimation;
    const previewIsWholeFrameAnimated = ['pop', 'scale', 'glitch-infinite-zoom', 'seamless-bounce', 'baby-earthquake'].includes(previewAnimation) && previewEnableAnimation;

    const getPreviewWordStyle = (word: PreviewCaptionWord, wordIndex: number): CSSProperties => {
        const isActiveWord = wordIndex === activeWordIndex;
        const slotColor = !previewEnableHighlight
            ? previewPrimary
            : word.colorSlot === 1
                ? previewHighlightPrimary
                : word.colorSlot === 2
                    ? previewSecondary
                    : previewPrimary;
        const baseStyle: CSSProperties = {
            ...previewLineStyle,
            color: slotColor,
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
            filter: 'none'
        };

        if (!previewEnableAnimation) {
            return baseStyle;
        }

        if (!isActiveWord) {
            if (previewAnimation === 'individual-focus') {
                baseStyle.opacity = 0.42;
            }
            if (previewAnimation === 'blur-switch') {
                baseStyle.filter = 'blur(2px)';
                baseStyle.opacity = 0.55;
            }
            if (previewAnimation === 'blur-in' && wordIndex > activeWordIndex) {
                baseStyle.filter = 'blur(4px)';
                baseStyle.opacity = 0.28;
            }
            return baseStyle;
        }

        if (previewAnimation === 'word-level_karaoke_fill-pop') {
            baseStyle.color = previewAnimationHighlight;
            baseStyle.transform = 'scale(1.24)';
        } else if (previewAnimation === 'word-level_karaoke_bg-highlight' || previewAnimation === 'word-level_simple_bg-highlight') {
            baseStyle.color = previewPrimary;
            baseStyle.backgroundColor = previewAnimationHighlight;
            baseStyle.borderRadius = '0.34em';
            baseStyle.padding = '0.04em 0.18em';
            baseStyle.transform = previewAnimation === 'word-level_karaoke_bg-highlight' ? 'scale(1.18)' : 'scale(1.1)';
        } else if (previewAnimation === 'deep-diver') {
            baseStyle.color = previewAnimationHighlight;
        } else if (previewAnimation === 'glitch-infinite-zoom') {
            baseStyle.transform = 'scale(1.08)';
        } else if (previewAnimation === 'seamless-bounce') {
            baseStyle.transform = 'translateY(-0.08em) scale(1.08)';
        } else if (previewAnimation === 'baby-earthquake') {
            baseStyle.color = previewAnimationHighlight;
        } else if (previewAnimation === 'blur-switch') {
            baseStyle.color = previewAnimationHighlight;
            baseStyle.filter = 'none';
            baseStyle.transform = 'scale(1.06)';
        } else if (previewAnimation === 'individual-focus') {
            baseStyle.color = previewAnimationHighlight;
            baseStyle.transform = 'scale(1.18)';
        } else if (previewAnimation === 'blur-in') {
            baseStyle.color = previewAnimationHighlight;
            baseStyle.filter = 'none';
        } else if (previewAnimation === 'simple-words-pop') {
            baseStyle.backgroundColor = previewAnimationBackground;
            baseStyle.color = previewAnimationHighlight;
            baseStyle.borderRadius = '0.34em';
            baseStyle.padding = '0.02em 0.16em';
            baseStyle.transform = 'scale(1.12)';
        } else if (previewAnimation === 'slide-in-from-top') {
            baseStyle.color = previewAnimationHighlight;
            baseStyle.transform = 'translateY(-0.18em)';
        } else if (previewAnimation === 'hover') {
            baseStyle.color = previewAnimationHighlight;
            baseStyle.transform = 'translateY(-0.12em)';
        } else if (previewAnimation === 'scale-in') {
            baseStyle.color = previewAnimationHighlight;
            baseStyle.transform = 'scale(1.2)';
        } else if (previewAnimation === 'breathe-scale-wiggle') {
            baseStyle.color = previewAnimationHighlight;
            baseStyle.transform = 'scale(1.12) rotate(-2deg)';
        }

        return baseStyle;
    };

    const previewMediaObjectFit = layoutStyle === 'Fit' ? 'contain' : 'cover';

    const handlePrimaryPreviewLoaded = () => {
        const previewVideo = previewVideoRef.current;
        if (!previewVideo) return;
        previewVideo.currentTime = 0;
        setVideoDuration(previewVideo.duration || 0);
    };

    const handlePrimaryPreviewTimeUpdate = () => {
        const previewVideo = previewVideoRef.current;
        if (!previewVideo) return;
        if (previewVideo.currentTime >= PREVIEW_DURATION_SECONDS) {
            previewVideo.currentTime = 0;
            previewVideo.play().catch(() => undefined);
            setPreviewTime(0);
            return;
        }
        setPreviewTime(previewVideo.currentTime);
        if (!videoDuration && previewVideo.duration) {
            setVideoDuration(previewVideo.duration);
        }
    };

    const handlePlayPause = () => {
        const previewVideo = previewVideoRef.current;
        if (!previewVideo) return;
        if (previewVideo.paused) {
            previewVideo.play().catch(() => undefined);
            setIsPlaying(true);
        } else {
            previewVideo.pause();
            setIsPlaying(false);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const previewVideo = previewVideoRef.current;
        if (!previewVideo) return;
        const t = Number(e.target.value);
        previewVideo.currentTime = t;
        setPreviewTime(t);
    };

    const effectiveDuration = videoDuration || PREVIEW_DURATION_SECONDS;

    const renderPreviewTile = (
        primary = false,
        objectFit: CSSProperties['objectFit'] = 'cover'
    ) => {
        if (previewVideoSrc) {
            return (
                <video
                    ref={primary ? previewVideoRef : undefined}
                    className="bt-preview-video"
                    src={previewVideoSrc}
                    poster={previewPoster}
                    muted
                    autoPlay
                    loop={!primary}
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={primary ? handlePrimaryPreviewLoaded : undefined}
                    onTimeUpdate={primary ? handlePrimaryPreviewTimeUpdate : undefined}
                    style={{ objectFit }}
                />
            );
        }

        return (
            <img
                src={previewPoster}
                alt="Preview"
                className="bt-preview-img"
                style={{ objectFit }}
            />
        );
    };

    const renderPreviewLayout = () => {
        if (layoutStyle === 'Three') {
            return (
                <div className="bt-video-stage layout-three">
                    <div className="bt-video-tile tile-primary">{renderPreviewTile(true, 'cover')}</div>
                    <div className="bt-video-tile tile-secondary">{renderPreviewTile()}</div>
                    <div className="bt-video-tile tile-secondary">{renderPreviewTile()}</div>
                </div>
            );
        }

        if (layoutStyle === 'Four') {
            return (
                <div className="bt-video-stage layout-four">
                    <div className="bt-video-tile tile-primary">{renderPreviewTile(true)}</div>
                    <div className="bt-video-tile tile-secondary">{renderPreviewTile()}</div>
                    <div className="bt-video-tile tile-secondary">{renderPreviewTile()}</div>
                    <div className="bt-video-tile tile-secondary">{renderPreviewTile()}</div>
                </div>
            );
        }

        if (layoutStyle === 'Split') {
            return (
                <div className="bt-video-stage layout-split">
                    <div className="bt-video-tile tile-primary">{renderPreviewTile(true)}</div>
                    <div className="bt-video-tile tile-secondary">{renderPreviewTile()}</div>
                </div>
            );
        }

        if (layoutStyle === 'ScreenShare') {
            return (
                <div className="bt-video-stage layout-screenshare">
                    <div className="bt-video-tile tile-secondary tile-speaker">{renderPreviewTile()}</div>
                    <div className="bt-video-tile tile-primary tile-screen">{renderPreviewTile(true, 'contain')}</div>
                </div>
            );
        }

        if (layoutStyle === 'Gameplay') {
            return (
                <div className="bt-video-stage layout-gameplay">
                    <div className="bt-video-tile tile-background">{renderPreviewTile(true)}</div>
                    <div className="bt-video-tile tile-primary tile-pip">{renderPreviewTile()}</div>
                </div>
            );
        }

        return (
            <div className={`bt-video-stage ${layoutStyle === 'Fit' ? 'layout-fit' : 'layout-fill'}`}>
                <div className={`bt-video-tile tile-primary ${layoutStyle === 'Fit' ? 'is-fit' : ''}`}>
                    {renderPreviewTile(true, previewMediaObjectFit)}
                </div>
            </div>
        );
    };

    return (
        <div className="brand-template-container">
            {/* Header */}
            <header className="bt-header">
                <div className="bt-header-left">
                    <h1>Brand template</h1>
                    <span>Quickly setup your video template</span>
                </div>
                <div className="bt-header-center">
                    <button className="preset-selector">
                        Preset template 1 <ChevronDown size={16} />
                    </button>
                </div>
                <div className="bt-header-right">
                    <button className="icon-btn" title="Undo"><Undo size={18} /></button>
                    <button className="icon-btn" title="Redo"><Redo size={18} /></button>
                    <button className="save-btn">Save template</button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="bt-content">

                {/* Primary Settings Sidebar */}
                <aside className="bt-sidebar">
                    <h2 className="bt-panel-title">Setting</h2>

                    <div className="bt-section">
                        <h3 className="bt-section-title">Style</h3>
                        <button
                            className={`bt-menu-btn ${activePanel === 'layout' ? 'active' : ''}`}
                            onClick={() => setActivePanel(activePanel === 'layout' ? 'none' : 'layout')}
                        >
                            <div className="bt-menu-icon"><LayoutTemplate size={18} /></div>
                            <span className="bt-menu-label">Clip layout settings</span>
                            <span className="bt-menu-value">{aspectRatio} fill {layoutStyle.toLowerCase()} t...</span>
                            <ChevronRight size={16} className="bt-menu-arrow" />
                        </button>
                        <button
                            className={`bt-menu-btn ${activePanel === 'caption' ? 'active' : ''}`}
                            onClick={() => setActivePanel(activePanel === 'caption' ? 'none' : 'caption')}
                        >
                            <div className="bt-menu-icon"><Type size={18} /></div>
                            <span className="bt-menu-label">Caption</span>
                            <span className="bt-menu-value">{selectedTemplateLabel} · {fontFamily}</span>
                            <ChevronRight size={16} className="bt-menu-arrow" />
                        </button>
                    </div>

                    <div className="bt-section">
                        <h3 className="bt-section-title">Brand</h3>
                        <button className="bt-menu-btn">
                            <div className="bt-menu-icon"><ImageIcon size={18} /></div>
                            <span className="bt-menu-label">Overlay (logo, CTA)</span>
                            <ChevronRight size={16} className="bt-menu-arrow" />
                        </button>
                        <button className="bt-menu-btn">
                            <div className="bt-menu-icon"><Video size={18} /></div>
                            <span className="bt-menu-label">Intro/outro</span>
                            <ChevronRight size={16} className="bt-menu-arrow" />
                        </button>
                        <button className="bt-menu-btn">
                            <div className="bt-menu-icon"><Music size={18} /></div>
                            <span className="bt-menu-label">Music</span>
                            <ChevronRight size={16} className="bt-menu-arrow" />
                        </button>
                    </div>

                    <div className="bt-section">
                        <h3 className="bt-section-title">AI</h3>
                        <div className="bt-toggle-row bt-has-tooltip">
                            <div className="bt-toggle-label"><Scissors size={18} /> Remove filler words</div>
                            <div className={`bt-toggle ${toggles.fillerWords ? 'on' : ''}`} onClick={() => toggleSetting('fillerWords')}>
                                <div className="bt-toggle-thumb" />
                            </div>

                            {/* Tooltip Content */}
                            <div className="bt-tooltip">
                                <div className="bt-tooltip-image-placeholder">
                                    <div className="ttp-line">
                                        <div className="ttp-dash" style={{ width: 20 }}></div>
                                        <div className="ttp-word crossed">um, uh</div>
                                        <div className="ttp-dash" style={{ width: 12 }}></div>
                                        <div className="ttp-dash" style={{ width: 24 }}></div>
                                        <div className="ttp-word crossed">um</div>
                                        <div className="ttp-dash" style={{ width: 12 }}></div>
                                    </div>
                                    <div className="ttp-line">
                                        <div className="ttp-dash" style={{ width: 24 }}></div>
                                        <div className="ttp-word crossed">um</div>
                                        <div className="ttp-dash" style={{ width: 8 }}></div>
                                        <div className="ttp-dash" style={{ width: 16 }}></div>
                                    </div>
                                    <div className="ttp-line">
                                        <div className="ttp-dash" style={{ width: 16 }}></div>
                                        <div className="ttp-word crossed">um</div>
                                        <div className="ttp-dash" style={{ width: 20 }}></div>
                                        <div className="ttp-word crossed">uh</div>
                                        <div className="ttp-dash" style={{ width: 32 }}></div>
                                        <div className="ttp-dash" style={{ width: 16 }}></div>
                                    </div>
                                </div>
                                <div className="bt-tooltip-text">
                                    <h4>Remove filler words</h4>
                                    <p>Turn on this toggle to auto-remove filler words (like um, uh) when using this template</p>
                                </div>
                            </div>
                        </div>
                        <div className="bt-toggle-row">
                            <div className="bt-toggle-label"><Pause size={18} /> Remove pauses</div>
                            <div className={`bt-toggle ${toggles.pauses ? 'on' : ''}`} onClick={() => toggleSetting('pauses')}>
                                <div className="bt-toggle-thumb" />
                            </div>
                        </div>
                        <div className="bt-toggle-row">
                            <div className="bt-toggle-label"><Highlighter size={18} /> AI keywords highlighter</div>
                            <div className={`bt-toggle ${toggles.keywords ? 'on' : ''}`} onClick={() => toggleSetting('keywords')}>
                                <div className="bt-toggle-thumb" />
                            </div>
                        </div>
                        <div className="bt-toggle-row">
                            <div className="bt-toggle-label"><Smile size={18} /> AI emojis</div>
                            <div className={`bt-toggle ${toggles.emojis ? 'on' : ''}`} onClick={() => toggleSetting('emojis')}>
                                <div className="bt-toggle-thumb" />
                            </div>
                        </div>
                        <div className="bt-toggle-row">
                            <div className="bt-toggle-label"><Film size={18} /> Auto generate stock B-Roll</div>
                            <div className={`bt-toggle ${toggles.broll ? 'on' : ''}`} onClick={() => toggleSetting('broll')}>
                                <div className="bt-toggle-thumb" />
                            </div>
                        </div>
                        <div className="bt-toggle-row">
                            <div className="bt-toggle-label"><ArrowRightLeft size={18} /> Auto transitions</div>
                            <div className={`bt-toggle ${toggles.transitions ? 'on' : ''}`} onClick={() => toggleSetting('transitions')}>
                                <div className="bt-toggle-thumb" />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Secondary Panel (Layout or Caption) */}
                {activePanel === 'layout' && (
                    <aside className="bt-subpanel bt-floating-panel">
                        <h2 className="bt-panel-title">Layout</h2>

                        <div className="bt-sub-section" style={{ paddingBottom: '32px' }}>
                            <h4 className="bt-control-label">Aspect ratio:</h4>
                            <div className="bt-btn-group">
                                <button className={`bt-opt-btn ${aspectRatio === '9:16' ? 'active' : ''}`} onClick={() => setAspectRatio('9:16')}><div className="ar-icon p916" /> 9:16</button>
                                <button className={`bt-opt-btn ${aspectRatio === '1:1' ? 'active' : ''}`} onClick={() => setAspectRatio('1:1')}><div className="ar-icon p11" /> 1:1</button>
                                <button className={`bt-opt-btn ${aspectRatio === '16:9' ? 'active' : ''}`} onClick={() => setAspectRatio('16:9')}><div className="ar-icon p169" /> 16:9</button>
                                <button className={`bt-opt-btn ${aspectRatio === '4:5' ? 'active' : ''}`} onClick={() => setAspectRatio('4:5')}><div className="ar-icon p45" /> 4:5</button>
                            </div>
                        </div>

                        <div className="bt-sub-section">
                            <div className="bt-label-row">
                                <h4 className="bt-control-label">Layout</h4>
                                <Info size={14} color="#6b7280" />
                            </div>
                            <div className="bt-layout-grid">
                                <button className={`bt-opt-btn bt-has-layout-tooltip ${layoutStyle === 'Fill' ? 'active' : ''}`} onClick={() => setLayoutStyle('Fill')}>
                                    <Maximize size={16} /> Fill
                                    <div className="bt-layout-tooltip">
                                        <div className="ly-img-box layout-fill">
                                            <div className="ly-part ly-img1 p1"></div>
                                        </div>
                                    </div>
                                </button>
                                <button className={`bt-opt-btn bt-has-layout-tooltip ${layoutStyle === 'Fit' ? 'active' : ''}`} onClick={() => setLayoutStyle('Fit')}>
                                    <Target size={16} /> Fit
                                    <div className="bt-layout-tooltip">
                                        <div className="ly-img-box layout-fit">
                                            <div className="ly-part ly-img1 p1"></div>
                                        </div>
                                    </div>
                                </button>
                                <button className={`bt-opt-btn bt-has-layout-tooltip ${layoutStyle === 'Three' ? 'active' : ''}`} onClick={() => setLayoutStyle('Three')}>
                                    <Columns size={16} /> Three
                                    <div className="bt-layout-tooltip">
                                        <div className="ly-img-box layout-three">
                                            <div className="ly-part ly-img1 p1"></div>
                                            <div className="bottom-row">
                                                <div className="ly-part ly-img2 p2"></div>
                                                <div className="ly-part ly-img3 p3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                <button className={`bt-opt-btn bt-has-layout-tooltip ${layoutStyle === 'Four' ? 'active' : ''}`} onClick={() => setLayoutStyle('Four')}>
                                    <Grid2X2 size={16} /> Four
                                    <div className="bt-layout-tooltip">
                                        <div className="ly-img-box layout-four">
                                            <div className="row">
                                                <div className="ly-part ly-img1"></div>
                                                <div className="ly-part ly-img2"></div>
                                            </div>
                                            <div className="row">
                                                <div className="ly-part ly-img3"></div>
                                                <div className="ly-part ly-img4"></div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                <button className={`bt-opt-btn bt-has-layout-tooltip ${layoutStyle === 'Split' ? 'active' : ''}`} onClick={() => setLayoutStyle('Split')}>
                                    <Grid3X3 size={16} /> Split
                                    <div className="bt-layout-tooltip">
                                        <div className="ly-img-box layout-split">
                                            <div className="ly-part ly-img1 p1"></div>
                                            <div className="ly-part ly-img2 p2"></div>
                                        </div>
                                    </div>
                                </button>
                                <button className={`bt-opt-btn bt-has-layout-tooltip ${layoutStyle === 'ScreenShare' ? 'active' : ''}`} onClick={() => setLayoutStyle('ScreenShare')}>
                                    <MonitorUp size={16} /> ScreenShare
                                    <div className="bt-layout-tooltip">
                                        <div className="ly-img-box layout-screenshare">
                                            <div className="ly-part ly-img1 p1"></div>
                                            <div className="ly-part ly-img-bg p2">
                                                <div className="ly-ss-mock"></div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                <button className={`bt-opt-btn bt-has-layout-tooltip ${layoutStyle === 'Gameplay' ? 'active' : ''}`} onClick={() => setLayoutStyle('Gameplay')}>
                                    <Gamepad2 size={16} /> Gameplay
                                    <div className="bt-layout-tooltip">
                                        <div className="ly-img-box layout-gameplay">
                                            <div className="ly-part ly-img-bg p2"></div>
                                            <div className="ly-part ly-img1 p1"></div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="bt-sub-section border-none">
                            <h4 className="bt-control-label">Fit layout crop aspect ratio</h4>
                            <div className="bt-btn-group">
                                <button className={`bt-opt-btn ${cropRatio === 'Original ratio' ? 'active' : ''}`} onClick={() => setCropRatio('Original ratio')}>Original ratio</button>
                                <button className={`bt-opt-btn ${cropRatio === '4:3' ? 'active' : ''}`} onClick={() => setCropRatio('4:3')}>4:3</button>
                                <button className={`bt-opt-btn ${cropRatio === '1:1' ? 'active' : ''}`} onClick={() => setCropRatio('1:1')}>1:1</button>
                            </div>
                        </div>
                    </aside>
                )}

                {activePanel === 'caption' && (
                    <aside className="bt-subpanel bt-floating-panel no-padding">
                        <div className="bt-panel-header-padded">
                            <h2 className="bt-panel-title">Caption</h2>
                        </div>

                        <div className="bt-tabs">
                            <button
                                className={`bt-tab ${captionTab === 'presets' ? 'active' : ''}`}
                                onClick={() => setCaptionTab('presets')}
                            >Presets</button>
                            <button
                                className={`bt-tab ${captionTab === 'font' ? 'active' : ''}`}
                                onClick={() => setCaptionTab('font')}
                            >Font</button>
                            <button
                                className={`bt-tab ${captionTab === 'effects' ? 'active' : ''}`}
                                onClick={() => setCaptionTab('effects')}
                            >Effects</button>
                        </div>

                        <div className="bt-tab-content">
                            {captionTab === 'presets' && (
                                <div className="bt-presets-grid">
                                    {BRAND_CAPTION_PRESET_OPTIONS.map((option) => {
                                        const isSelected = option.templateId === selectedCaptionTemplateId;

                                        return (
                                            <button
                                                key={option.templateId}
                                                type="button"
                                                className={`bt-preset-card ${isSelected ? 'selected' : ''}`}
                                                onClick={() => setSelectedCaptionTemplateId(option.templateId)}
                                                aria-pressed={isSelected}
                                                title={option.desc}
                                            >
                                                <div className="bt-preset-preview">
                                                    {option.styleId === null ? (
                                                        <span className="bt-no-caption-icon">⊘</span>
                                                    ) : (
                                                        <CaptionStylePreview styleId={option.styleId} compact />
                                                    )}
                                                </div>
                                                <div className="bt-preset-meta">
                                                    <span className="bt-preset-name">{option.name}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {captionTab === 'font' && (
                                <div className="bt-font-controls">
                                    <div className="bt-sub-section">
                                        <div className="bt-label-row">
                                            <h4 className="bt-control-label">Font settings</h4>
                                            <ChevronDown size={16} />
                                        </div>
                                        <div className="bt-input-group mt-2">
                                            <select
                                                className="bt-select full-width"
                                                value={fontFamily}
                                                onChange={(event) => setFontFamily(event.target.value as (typeof OPUS_FONT_FAMILIES)[number])}
                                            >
                                                {OPUS_FONT_FAMILIES.map((family) => (
                                                    <option key={family} value={family}>{family}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="bt-font-props mt-3">
                                            <div className="bt-color-picker"></div>
                                            <div className="bt-input-with-suffix">
                                                <input type="number" defaultValue={40} className="bt-input" />
                                                <span className="bt-suffix">px</span>
                                            </div>
                                            <select className="bt-select flex-grow">
                                                <option>Black</option>
                                                <option>Bold</option>
                                                <option>Regular</option>
                                            </select>
                                        </div>

                                        <div className="bt-settings-row mt-4">
                                            <span className="bt-control-label">Decoration</span>
                                            <div className="bt-decoration-btns">
                                                <button className="bt-icon-btn italic-btn">I</button>
                                                <button className="bt-icon-btn underline-btn">U</button>
                                            </div>
                                        </div>

                                        <div className="bt-settings-row mt-4">
                                            <span className="bt-control-label">Uppercase</span>
                                            <div className={`bt-toggle ${toggles.uppercase ? 'on' : ''}`} onClick={() => toggleSetting('uppercase')}>
                                                <div className="bt-toggle-thumb" />
                                            </div>
                                        </div>

                                        <div className="bt-settings-row mt-4">
                                            <span className="bt-control-label">Font stroke</span>
                                            <div className="bt-flex-row">
                                                <div className="bt-color-picker black"></div>
                                                <div className="bt-input-with-suffix">
                                                    <input type="number" defaultValue={8} className="bt-input" />
                                                    <span className="bt-suffix">px</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bt-settings-row mt-4">
                                            <span className="bt-control-label">Font shadows</span>
                                            <div className={`bt-toggle ${toggles.shadows ? 'on' : ''}`} onClick={() => toggleSetting('shadows')}>
                                                <div className="bt-toggle-thumb" />
                                            </div>
                                        </div>

                                        {toggles.shadows && (
                                            <div className="bt-shadow-controls mt-2">
                                                <div className="bt-color-picker black"></div>
                                                <div className="bt-input-with-suffix tiny">
                                                    <input type="number" defaultValue={2} className="bt-input" />
                                                    <span className="bt-suffix">x</span>
                                                </div>
                                                <div className="bt-input-with-suffix tiny">
                                                    <input type="number" defaultValue={2} className="bt-input" />
                                                    <span className="bt-suffix">y</span>
                                                </div>
                                                <div className="bt-input-with-suffix tiny">
                                                    <input type="number" defaultValue={2} className="bt-input" />
                                                    <span className="bt-suffix">blur</span>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}
                            {captionTab === 'effects' && (
                                <div className="bt-font-controls">
                                    <div className="bt-sub-section">
                                        <h4 className="bt-control-label">Position</h4>
                                        <div className="bt-btn-group">
                                            <button className={`bt-opt-btn ${captionPosition === 'Auto' ? 'active' : ''}`} onClick={() => setCaptionPosition('Auto')} style={{ color: captionPosition === 'Auto' ? 'black' : '', backgroundColor: captionPosition === 'Auto' ? 'white' : '' }}>Auto</button>
                                            <button className={`bt-opt-btn ${captionPosition === 'Top' ? 'active' : ''}`} onClick={() => setCaptionPosition('Top')}>Top</button>
                                            <button className={`bt-opt-btn ${captionPosition === 'Middle' ? 'active' : ''}`} onClick={() => setCaptionPosition('Middle')}>Middle</button>
                                            <button className={`bt-opt-btn ${captionPosition === 'Bottom' ? 'active' : ''}`} onClick={() => setCaptionPosition('Bottom')}>Bottom</button>
                                            <button className={`bt-opt-btn ${captionPosition === 'Custom' ? 'active' : ''}`} onClick={() => setCaptionPosition('Custom')}>Custom</button>
                                        </div>
                                    </div>

                                    <div className="bt-sub-section">
                                        <h4 className="bt-control-label">Animation</h4>
                                        <div className="bt-input-group mt-2">
                                            <select className="bt-select full-width" value={captionAnimation} onChange={(e) => setCaptionAnimation(e.target.value)}>
                                                {OPUS_TRANSITION_STYLES.map((style) => (
                                                    <option key={style.id} value={style.id}>{style.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="bt-sub-section border-none" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 className="bt-control-label" style={{ margin: 0 }}>Lines</h4>
                                        <div className="bt-btn-group" style={{ width: 'auto' }}>
                                            <button className={`bt-opt-btn ${captionLines === 'Three lines' ? 'active' : ''}`} onClick={() => setCaptionLines('Three lines')} style={{ color: captionLines === 'Three lines' ? 'black' : '', backgroundColor: captionLines === 'Three lines' ? 'white' : '' }}>Three lines</button>
                                            <button className={`bt-opt-btn ${captionLines === 'One line' ? 'active' : ''}`} onClick={() => setCaptionLines('One line')} style={{ color: captionLines === 'One line' ? 'black' : '', backgroundColor: captionLines === 'One line' ? 'white' : '' }}>One line</button>
                                        </div>
                                    </div>

                                    <div className="bt-sub-section border-none" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 0 }}>
                                        <h4 className="bt-control-label" style={{ margin: 0 }}>Highlighted word color</h4>
                                        <div className="bt-color-picker" style={{ backgroundColor: highlightColor }} onClick={() => setHighlightColor(prev => prev === '#f5f5f5' ? '#d4d4d4' : prev === '#d4d4d4' ? '#8a8a8a' : '#f5f5f5')}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                )}

                {/* Video Preview Area */}
                <main className="bt-preview-area">
                    <div className="bt-video-container" style={{
                        aspectRatio: aspectRatio.replace(':', '/'),
                        height: aspectRatio === '16:9' ? 'auto' : '100%',
                        width: aspectRatio === '16:9' ? '100%' : 'auto',
                        maxHeight: '720px',
                        maxWidth: '1000px',
                    }}>
                        <div className="bt-video-placeholder">
                            {renderPreviewLayout()}
                            <div className="bt-caption-overlay" style={previewOverlayPositionStyle}>
                                {selectedCaptionTemplate?.templateId === 'none' ? (
                                    <span className="cap-line1" style={{ ...previewLineStyle, color: '#A1A1AA' }}>No captions</span>
                                ) : (
                                    <div
                                        key={`${selectedCaptionTemplateId}-${activeWordIndex}`}
                                        className={[
                                            'bt-preview-caption-wrap',
                                            previewUsesFrameBackground ? 'with-frame-background' : '',
                                            previewUsesWordBackdrop || previewIsBackdropStyle ? 'with-backdrop' : '',
                                            previewIsWholeFrameAnimated ? 'is-frame-animated' : '',
                                            previewAnimation === 'glitch-infinite-zoom' ? 'is-glitch' : '',
                                            previewAnimation === 'baby-earthquake' ? 'is-earthquake' : ''
                                        ].filter(Boolean).join(' ')}
                                        style={previewUsesFrameBackground ? {
                                            backgroundColor: previewAnimationBackground === 'transparent' ? 'rgba(10, 10, 11, 0.72)' : previewAnimationBackground
                                        } : undefined}
                                    >
                                        {(() => {
                                            let globalWordCursor = 0;
                                            return activeCaptionLines.map((line, lineIndex) => {
                                                const lineWords = line.words.map((word, wordIndex) => {
                                                    const currentWordIndex = globalWordCursor;
                                                    globalWordCursor += 1;
                                                    const wordStyle = getPreviewWordStyle(word, currentWordIndex);
                                                    const wordClassName = [
                                                        'bt-caption-word',
                                                        currentWordIndex === activeWordIndex ? 'is-active' : '',
                                                        previewAnimation === 'glitch-infinite-zoom' && currentWordIndex === activeWordIndex ? 'is-glitch' : '',
                                                        previewAnimation === 'seamless-bounce' && currentWordIndex === activeWordIndex ? 'is-bounce' : '',
                                                        previewAnimation === 'slide-in-from-top' && currentWordIndex === activeWordIndex ? 'is-slide-down' : '',
                                                        previewAnimation === 'hover' && currentWordIndex === activeWordIndex ? 'is-hover' : '',
                                                        previewAnimation === 'scale-in' && currentWordIndex === activeWordIndex ? 'is-scale-in' : '',
                                                        previewAnimation === 'breathe-scale-wiggle' && currentWordIndex === activeWordIndex ? 'is-wiggle' : ''
                                                    ].filter(Boolean).join(' ');

                                                    return (
                                                        <span key={`${lineIndex}-${wordIndex}-${currentWordIndex}`} className={wordClassName} style={wordStyle}>
                                                            {previewUppercase ? word.text.toUpperCase() : word.text}
                                                            {wordIndex < line.words.length - 1 ? ' ' : ''}
                                                        </span>
                                                    );
                                                });

                                                return (
                                                    <span
                                                        key={`${lineIndex}-${line.text}`}
                                                        className={lineIndex === 0 ? 'cap-line1 bt-caption-line' : 'cap-line2 bt-caption-line'}
                                                        style={previewLineStyle}
                                                    >
                                                        {lineWords}
                                                    </span>
                                                );
                                            });
                                        })()}
                                        <span className="cap-emoji">{PREVIEW_DEMO_EMOJI}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                            {/* Overlay Video Controls */}
                            <div className="bt-video-controls">
                                <button className="bt-play-pause-btn" onClick={handlePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
                                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                </button>
                                <div className="bt-seek-track">
                                    <div
                                        className="bt-seek-fill"
                                        style={{ width: `${(previewTime / effectiveDuration) * 100}%` }}
                                    />
                                    <input
                                        className="bt-seek-input"
                                        type="range"
                                        min={0}
                                        max={effectiveDuration}
                                        step={0.05}
                                        value={previewTime}
                                        onChange={handleSeek}
                                    />
                                </div>
                            </div>
                    </div>
                </main>

            </div>
        </div>
    );
}
