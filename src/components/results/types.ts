import type { SubtitleStylePreset } from './SubtitleOverlay';
import type { TranscriptSegment, TranscriptWord } from '../../types';

export type ClipItem = {
  id: string;
  clipId?: string;
  title: string;
  score: number;
  duration: string;
  thumbnailUrl: string;
  videoUrl?: string;
  videoPath?: string;
  aspectRatio?: AspectRatioOption;
  captionStyle?: CaptionStyleTone;
  transcriptWords?: TranscriptWord[];
  subtitleStatus?: 'idle' | 'loading' | 'ready';
  timelineLabel?: string;
  scheduledLabel?: string;
  categoryLabel?: string;
  editLabel?: string;
  badges?: Array<{
    label: string;
    tone?: 'gold' | 'emerald' | 'violet' | 'slate';
  }>;
  isPlayable?: boolean;
  isSelected?: boolean;
  hasAutoHook?: boolean;
  showFavoriteAction?: boolean;
  showCommentAction?: boolean;
};

export type SidebarItem = 'home' | 'clips' | 'assets' | 'calendar' | 'analytics' | 'share';

export type CaptionStyleTone = SubtitleStylePreset;

export type AspectRatioOption = '9:16' | '1:1' | '16:9' | '4:5';

export type ClipDetails = {
  id: string;
  rank: number;
  title: string;
  score: number;
  duration: string;
  thumbnailUrl: string;
  videoUrl?: string;
  videoPath?: string;
  metrics: {
    hook: string;
    flow: string;
    value: string;
    trend: string;
  };
  transcript: TranscriptSegment[];
  transcriptWords: TranscriptWord[];
  summary: string[];
  captionStyle: CaptionStyleTone;
  aspectRatio: AspectRatioOption;
};
