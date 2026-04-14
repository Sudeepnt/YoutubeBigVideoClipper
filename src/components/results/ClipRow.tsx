import ClipCard from './ClipCard';
import ClipListView from './ClipListView';
import type { ClipActionType } from './ClipActionModal';
import { ClipDetails, ClipItem } from './types';

interface ClipRowProps {
  clips: ClipItem[];
  viewMode: 'grid' | 'list';
  clipDetailsById: Record<string, ClipDetails>;
  previewClipId: string | null;
  onPreviewClip: (id: string) => void;
  onOpenClip: (id: string) => void;
  onAction: (action: ClipActionType, clip: ClipItem) => void;
  onViewerAspectRatioChange: (clipId: string, ratio: ClipDetails['aspectRatio']) => void;
  onEditClip?: (clipId: string) => void;
}

export default function ClipRow({
  clips,
  viewMode,
  clipDetailsById,
  previewClipId,
  onPreviewClip,
  onOpenClip,
  onAction,
  onViewerAspectRatioChange,
  onEditClip,
}: ClipRowProps) {
  if (!clips.length) {
    return (
      <div className="results-empty-state">
        No clips match this filter.
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <ClipListView
        clips={clips}
        clipDetailsById={clipDetailsById}
        onOpenClip={onOpenClip}
        onViewerAspectRatioChange={onViewerAspectRatioChange}
        onEditClip={onEditClip}
      />
    );
  }

  return (
    <section className="results-clip-row" aria-label="Generated clips grid">
      {clips.map((clip) => (
        <ClipCard
          key={clip.id}
          clip={{
            ...clip,
            transcriptWords: clipDetailsById[clip.id]?.transcriptWords ?? [],
            subtitleStatus: clipDetailsById[clip.id]?.transcriptWords?.length ? 'ready' : 'idle',
          }}
          isPreviewing={previewClipId === clip.id}
          onPreview={onPreviewClip}
          onOpenClip={onOpenClip}
          onAction={onAction}
        />
      ))}
    </section>
  );
}
