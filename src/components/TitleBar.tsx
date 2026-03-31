import { Settings, Minimize2, Maximize2, X } from 'lucide-react';

interface TitleBarProps {
    onSettingsClick: () => void;
}

export default function TitleBar({ onSettingsClick }: TitleBarProps) {
    return (
        <div className="title-bar">
            <div className="title-bar-brand">
                <div className="title-bar-logo">CF</div>
                <span className="title-bar-title">ClipForge</span>
                <span className="title-bar-version">v0.1.0</span>
            </div>

            <div className="title-bar-actions">
                <button
                    className="btn btn-ghost btn-icon"
                    onClick={onSettingsClick}
                    title="Settings"
                >
                    <Settings size={16} />
                </button>
                <button className="btn btn-ghost btn-icon" title="Minimize">
                    <Minimize2 size={14} />
                </button>
                <button className="btn btn-ghost btn-icon" title="Maximize">
                    <Maximize2 size={14} />
                </button>
                <button className="btn btn-ghost btn-icon" title="Close">
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
