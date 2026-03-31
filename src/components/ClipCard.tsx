import { Play, Check, Clock, Zap } from 'lucide-react';
import { ClipSuggestion } from '../types';
import { formatMs, getScoreClass } from '../store';

interface ClipCardProps {
    clip: ClipSuggestion;
    index: number;
    onSelect: (id: string) => void;
    onPreview: (id: string) => void;
}

export default function ClipCard({ clip, index, onSelect, onPreview }: ClipCardProps) {
    const scoreClass = getScoreClass(clip.score);
    const duration = (clip.endMs - clip.startMs) / 1000;

    return (
        <div
            className={`clip-card ${clip.selected ? 'selected' : ''}`}
            onClick={() => onSelect(clip.id)}
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className="clip-card-preview" onClick={(e) => { e.stopPropagation(); onPreview(clip.id); }}>
                {/* Gradient placeholder for video thumbnail */}
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(180deg, rgba(30,30,30,0.96) 0%, rgba(8,8,8,0.98) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <span style={{ fontSize: 28, opacity: 0.4 }}>🎬</span>
                </div>
                <div className="clip-card-play">
                    <Play size={24} fill="white" color="white" />
                </div>
                <div className="project-card-duration">{formatMs(clip.endMs - clip.startMs)}</div>
            </div>

            <div className="clip-card-body">
                <div className="clip-card-header">
                    <div className="clip-card-title">Clip {index + 1}</div>
                    <div className={`clip-card-score ${scoreClass}`}>
                        <Zap size={12} />
                        {clip.score}/10
                    </div>
                </div>

                <div className="clip-card-hook">"{clip.hook}"</div>

                <div className="clip-card-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} />
                        {formatMs(clip.startMs)} — {formatMs(clip.endMs)}
                    </span>
                    <span>{Math.round(duration)}s</span>
                </div>

                <div className="clip-card-reason">{clip.reason}</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                    <button
                        className={`btn btn-sm ${clip.selected ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(clip.id);
                        }}
                    >
                        {clip.selected ? <><Check size={12} /> Selected</> : 'Select'}
                    </button>
                    <button
                        className="btn btn-sm btn-ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPreview(clip.id);
                        }}
                    >
                        <Play size={12} />
                        Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
