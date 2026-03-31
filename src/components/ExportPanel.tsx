import { useState } from 'react';
import { Download, Smartphone, Monitor, Square, RectangleHorizontal, Type, Wand2 } from 'lucide-react';
import { ExportSettings, AspectRatio, Platform } from '../types';
import { CAPTION_PRESETS } from '../lib/captionPresets';

interface ExportPanelProps {
    settings: ExportSettings;
    onSettingsChange: (settings: ExportSettings) => void;
    selectedClipCount: number;
    onExport: () => void;
}

const platforms: { id: Platform; label: string; icon: string; ratio: AspectRatio }[] = [
    { id: 'tiktok', label: 'TikTok', icon: 'TT', ratio: '9:16' },
    { id: 'youtube-shorts', label: 'YT Shorts', icon: 'YS', ratio: '9:16' },
    { id: 'instagram-reels', label: 'IG Reels', icon: 'IG', ratio: '9:16' },
    { id: 'twitter', label: 'Twitter/X', icon: 'X', ratio: '16:9' },
];

const aspectRatios: { id: AspectRatio; label: string; icon: React.ReactNode }[] = [
    { id: '9:16', label: 'Vertical', icon: <Smartphone size={20} /> },
    { id: '16:9', label: 'Landscape', icon: <Monitor size={20} /> },
    { id: '1:1', label: 'Square', icon: <Square size={18} /> },
    { id: '4:5', label: 'Portrait', icon: <RectangleHorizontal size={18} style={{ transform: 'rotate(90deg)' }} /> },
];

const captionStyles = CAPTION_PRESETS.map((preset) => ({
    id: preset.id,
    label: preset.label,
    preview: `${preset.fontFamily} • ${preset.bold ? 'bold' : 'regular'} • ${preset.outline > 0 ? 'outline' : 'flat'}`,
}));

export default function ExportPanel({ settings, onSettingsChange, selectedClipCount, onExport }: ExportPanelProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        onExport();
        // Simulate export
        setTimeout(() => setIsExporting(false), 3000);
    };

    return (
        <div className="export-panel animate-fadeInUp">
            {/* Platform Presets */}
            <div className="export-section">
                <div className="export-section-title">
                    <Wand2 size={16} style={{ color: 'var(--accent-primary)' }} />
                    
                    Platform Preset
                </div>
                <div className="export-presets">
                    {platforms.map((platform) => (
                        <div
                            key={platform.id}
                            className={`export-preset ${settings.platform === platform.id ? 'selected' : ''}`}
                            onClick={() =>
                                onSettingsChange({
                                    ...settings,
                                    platform: platform.id,
                                    aspectRatio: platform.ratio,
                                })
                            }
                        >
                            <span className="export-preset-icon">{platform.icon}</span>
                            <span className="export-preset-name">{platform.label}</span>
                            <span className="export-preset-ratio">{platform.ratio}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Aspect Ratio */}
            <div className="export-section">
                <div className="export-section-title">
                    <Monitor size={16} />
                    Aspect Ratio
                </div>
                <div className="export-presets">
                    {aspectRatios.map((ratio) => (
                        <div
                            key={ratio.id}
                            className={`export-preset ${settings.aspectRatio === ratio.id ? 'selected' : ''}`}
                            onClick={() => onSettingsChange({ ...settings, aspectRatio: ratio.id })}
                        >
                            <span style={{ color: settings.aspectRatio === ratio.id ? 'currentColor' : 'var(--text-tertiary)' }}>
                                {ratio.icon}
                            </span>
                            <span className="export-preset-name">{ratio.label}</span>
                            <span className="export-preset-ratio">{ratio.id}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quality & Format */}
            <div className="export-section">
                <div className="export-section-title">
                    <Download size={16} />
                    Output Settings
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-group">
                        <label className="form-label">Format</label>
                        <select
                            className="form-select"
                            value={settings.format}
                            onChange={(e) => onSettingsChange({ ...settings, format: e.target.value as ExportSettings['format'] })}
                        >
                            <option value="mp4">MP4 (H.264)</option>
                            <option value="webm">WebM (VP9)</option>
                            <option value="mov">MOV (ProRes)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Quality</label>
                        <select
                            className="form-select"
                            value={settings.quality}
                            onChange={(e) => onSettingsChange({ ...settings, quality: e.target.value as ExportSettings['quality'] })}
                        >
                            <option value="low">Low (720p)</option>
                            <option value="medium">Medium (1080p)</option>
                            <option value="high">High (1080p HQ)</option>
                            <option value="ultra">Ultra (4K)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Captions */}
            <div className="export-section">
                <div className="export-section-title">
                    <Type size={16} />
                    Caption Style
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Enable auto-captions</span>
                    <button
                        className={`toggle ${settings.captions.enabled ? 'active' : ''}`}
                        onClick={() =>
                            onSettingsChange({
                                ...settings,
                                captions: { ...settings.captions, enabled: !settings.captions.enabled },
                            })
                        }
                    >
                        <div className="toggle-knob" />
                    </button>
                </div>

                {settings.captions.enabled && (
                    <div className="stagger-animation" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {captionStyles.map((style) => (
                            <div
                                key={style.id}
                                className={`export-preset ${settings.captions.style === style.id ? 'selected' : ''}`}
                                style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)' }}
                                onClick={() =>
                                    onSettingsChange({
                                        ...settings,
                                        captions: { ...settings.captions, style: style.id as ExportSettings['captions']['style'] },
                                    })
                                }
                            >
                                <span className="export-preset-name">{style.label}</span>
                                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{style.preview}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Export Button */}
            <div style={{ padding: 'var(--space-2) 0' }}>
                <button
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', justifyContent: 'center', padding: 'var(--space-4)' }}
                    onClick={handleExport}
                    disabled={selectedClipCount === 0 || isExporting}
                >
                    {isExporting ? (
                        <>
                            <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                            Exporting {selectedClipCount} clips...
                        </>
                    ) : (
                        <>
                            <Download size={18} />
                            Export {selectedClipCount} Clip{selectedClipCount !== 1 ? 's' : ''}
                        </>
                    )}
                </button>
                {selectedClipCount === 0 && (
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 'var(--space-2)' }}>
                        Select clips from the editor to export
                    </p>
                )}
            </div>
        </div>
    );
}
