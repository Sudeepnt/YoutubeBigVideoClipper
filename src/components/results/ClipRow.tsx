import ClipCard from './ClipCard';
import { ClipItem } from './types';

interface ClipRowProps {
  clips: ClipItem[];
  previewClipId: string | null;
  onPreviewClip: (id: string) => void;
  onOpenClip: (id: string) => void;
}

export default function ClipRow({ clips, previewClipId, onPreviewClip, onOpenClip }: ClipRowProps) {
  if (!clips.length) {
    return (
      <div className="results-empty-state">
        No clips match this filter.
      </div>
    );
  }

  return (
    <section className="results-clip-row" aria-label="Generated clips row">
      {clips.map((clip) => (
        <ClipCard
          key={clip.id}
          clip={clip}
          isPreviewing={previewClipId === clip.id}
          onPreview={onPreviewClip}
          onOpenClip={onOpenClip}
        />
      ))}
    </section>
  );
}
