import ClipActionsPanel from './ClipActionsPanel';
import ClipScorePanel from './ClipScorePanel';
import SceneAnalysisPanel from './SceneAnalysisPanel';
import VideoPreviewPlayer from './VideoPreviewPlayer';
import { ClipDetails, ClipItem } from './types';

interface ClipListViewProps {
  clips: ClipItem[];
  clipDetailsById: Record<string, ClipDetails>;
  onOpenClip: (id: string) => void;
  onViewerAspectRatioChange: (clipId: string, ratio: ClipDetails['aspectRatio']) => void;
  onEditClip?: (clipId: string) => void;
}

export default function ClipListView({
  clips,
  clipDetailsById,
  onOpenClip,
  onViewerAspectRatioChange,
  onEditClip,
}: ClipListViewProps) {
  return (
    <section className="results-list-view" aria-label="Generated clips list">
      {clips.map((clip, index) => {
        const details = clipDetailsById[clip.id];
        if (!details) return null;

        return (
          <article key={clip.id} className="results-list-item">
            <button
              type="button"
              className="results-list-title-btn"
              onClick={() => onOpenClip(clip.id)}
            >
              #{index + 1} {clip.title}
            </button>

            <div className="results-list-item-grid">
              <ClipScorePanel score={details.score} metrics={details.metrics} />
              <div
                className="results-list-player-btn"
                role="button"
                tabIndex={0}
                onClick={() => onOpenClip(clip.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpenClip(clip.id);
                  }
                }}
              >
                <VideoPreviewPlayer
                  clip={details}
                />
              </div>
              <SceneAnalysisPanel clip={details} />
              <ClipActionsPanel
                aspectRatio={details.aspectRatio}
                onAspectRatioChange={(ratio) => onViewerAspectRatioChange(clip.id, ratio)}
                onEditClip={() => onEditClip?.(clip.id)}
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}
