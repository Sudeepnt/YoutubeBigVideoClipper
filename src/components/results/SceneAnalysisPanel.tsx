import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { ClipDetails } from './types';

interface SceneAnalysisPanelProps {
  clip: ClipDetails;
}

export default function SceneAnalysisPanel({ clip }: SceneAnalysisPanelProps) {
  const [transcriptOnly, setTranscriptOnly] = useState(false);
  const analysisTags = buildAnalysisTags(clip);

  useEffect(() => {
    setTranscriptOnly(false);
  }, [clip.id]);

  return (
    <section className="scene-analysis-panel" aria-label="Scene analysis">
      <header className="scene-analysis-header">
        <h3>Scene analysis</h3>

        <label className="scene-analysis-toggle">
          <input
            type="checkbox"
            checked={transcriptOnly}
            onChange={(event) => setTranscriptOnly(event.target.checked)}
          />
          <span>Transcript only</span>
        </label>
      </header>

      <div className="scene-analysis-body">
        <div className="scene-analysis-badges">
          {analysisTags.map((tag) => (
            <span key={tag} className="scene-analysis-badge">
              {tag}
            </span>
          ))}
        </div>

        {!transcriptOnly && (
          <div className="scene-analysis-summary">
            {clip.summary.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        )}

        <div className="scene-analysis-transcript">
          {clip.transcript.map((segment) => (
            <article key={segment.id} className="scene-analysis-segment">
              <div className="scene-analysis-time">
                [{formatTimestamp(segment.start)} - {formatTimestamp(segment.end)}]
              </div>
              <div className="scene-analysis-line">
                <FileText size={12} />
                <p>{segment.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildAnalysisTags(clip: ClipDetails): string[] {
  if (clip.score >= 90) {
    return ['Useful quote', 'High retention'];
  }

  if (clip.score >= 82) {
    return ['Bold opinion hook', 'Journey & tutorial'];
  }

  return ['Podcast insight', 'Share-worthy'];
}

function formatTimestamp(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
