import { Heart, MessageCircle } from 'lucide-react';
import { ClipDetails } from './types';

interface ClipScorePanelProps {
  score: number;
  metrics: ClipDetails['metrics'];
}

export default function ClipScorePanel({ score, metrics }: ClipScorePanelProps) {
  return (
    <aside className="clip-score-panel" aria-label="Clip score details">
      <div className="clip-score-actions">
        <button type="button" className="clip-score-action-btn" aria-label="Like clip" title="Like clip">
          <Heart size={14} />
        </button>
        <button type="button" className="clip-score-action-btn" aria-label="Comment on clip" title="Comment on clip">
          <MessageCircle size={14} />
        </button>
      </div>

      <div className="clip-score-value-wrap">
        <span className="clip-score-value">{score}</span>
        <span className="clip-score-max">/ 100</span>
      </div>

      <dl className="clip-score-metrics">
        <div className="clip-score-metric-row">
          <dt>Hook</dt>
          <dd>{metrics.hook}</dd>
        </div>
        <div className="clip-score-metric-row">
          <dt>Flow</dt>
          <dd>{metrics.flow}</dd>
        </div>
        <div className="clip-score-metric-row">
          <dt>Value</dt>
          <dd>{metrics.value}</dd>
        </div>
        <div className="clip-score-metric-row">
          <dt>Trend</dt>
          <dd>{metrics.trend}</dd>
        </div>
      </dl>
    </aside>
  );
}
