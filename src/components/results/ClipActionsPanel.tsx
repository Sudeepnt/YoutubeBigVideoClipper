import {
  Share2,
  FileText,
  Download,
  Scissors,
  Sparkles,
  AudioLines,
  ImagePlus,
} from 'lucide-react';
import AspectRatioSelector from './AspectRatioSelector';
import { AspectRatioOption } from './types';

interface ClipActionsPanelProps {
  aspectRatio: AspectRatioOption;
  onAspectRatioChange: (ratio: AspectRatioOption) => void;
  onEditClip?: () => void;
}

export default function ClipActionsPanel({ aspectRatio, onAspectRatioChange, onEditClip }: ClipActionsPanelProps) {
  return (
    <aside className="clip-actions-panel" aria-label="Clip actions">
      <button type="button" className="clip-action-btn">
        <Share2 size={14} />
        Publish on Social
      </button>
      <button type="button" className="clip-action-btn">
        <FileText size={14} />
        Export XML
      </button>
      <button type="button" className="clip-action-btn">
        <Download size={14} />
        Download HD
      </button>
      <button type="button" className="clip-action-btn" onClick={onEditClip}>
        <Scissors size={14} />
        Edit clip
      </button>
      <button type="button" className="clip-action-btn">
        <Sparkles size={14} />
        AI hook
      </button>
      <button type="button" className="clip-action-btn">
        <AudioLines size={14} />
        Enhance speech
      </button>
      <button type="button" className="clip-action-btn">
        <ImagePlus size={14} />
        Add B-Roll
      </button>

      <div className="clip-actions-ratio-quick">
        <AspectRatioSelector value={aspectRatio} onChange={onAspectRatioChange} compact />
      </div>
    </aside>
  );
}
