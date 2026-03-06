import { useState } from 'react';
import { Search, Copy, Download } from 'lucide-react';
import { TranscriptSegment, ClipSuggestion } from '../types';
import { formatMs } from '../store';

interface TranscriptViewerProps {
    segments: TranscriptSegment[];
    clips: ClipSuggestion[];
    onWordClick: (timestamp: number) => void;
}

export default function TranscriptViewer({ segments, clips, onWordClick }: TranscriptViewerProps) {
    const [search, setSearch] = useState('');

    const isWordInClip = (wordStart: number, wordEnd: number): boolean => {
        return clips.some(
            (clip) => clip.selected && wordStart >= clip.startMs && wordEnd <= clip.endMs
        );
    };

    const isWordHighlighted = (word: string): boolean => {
        if (!search) return false;
        return word.toLowerCase().includes(search.toLowerCase());
    };

    const handleCopyTranscript = () => {
        const text = segments.map((s) => s.text).join('\n\n');
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="transcript-panel">
            <div className="transcript-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600 }}>Transcript</h3>
                    <span className="badge badge-green">{segments.length} segments</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div className="transcript-search">
                        <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                        <input
                            type="text"
                            placeholder="Search transcript..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-ghost btn-icon" title="Copy transcript" onClick={handleCopyTranscript}>
                        <Copy size={14} />
                    </button>
                    <button className="btn btn-ghost btn-icon" title="Export SRT">
                        <Download size={14} />
                    </button>
                </div>
            </div>

            <div className="transcript-body">
                {segments.map((segment) => (
                    <div key={segment.id} style={{ marginBottom: 'var(--space-4)' }}>
                        <span
                            className="transcript-timestamp"
                            onClick={() => onWordClick(segment.start)}
                        >
                            [{formatMs(segment.start)}]
                        </span>
                        {segment.words.map((word, i) => (
                            <span
                                key={`${segment.id}-${i}`}
                                className={`transcript-word ${isWordInClip(word.start, word.end) ? 'in-clip' : ''
                                    } ${isWordHighlighted(word.word) ? 'highlighted' : ''}`}
                                onClick={() => onWordClick(word.start)}
                                title={`${formatMs(word.start)} (${Math.round(word.confidence * 100)}%)`}
                            >
                                {word.word}{' '}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
