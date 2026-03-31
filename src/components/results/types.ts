import type { TranscriptSegment } from '../../types';

export type ClipItem = {
  id: string;
  clipId?: string;
  title: string;
  score: number;
  duration: string;
  thumbnailUrl: string;
  videoUrl?: string;
  isPlayable?: boolean;
  isSelected?: boolean;
  hasAutoHook?: boolean;
  showFavoriteAction?: boolean;
  showCommentAction?: boolean;
};

export type SidebarItem = 'home' | 'clips' | 'assets' | 'calendar' | 'analytics' | 'share';

export type CaptionStyleTone = 
  | 'no-captions'
  | 'karaoke'
  | 'beasty'
  | 'deep-diver'
  | 'youshaei'
  | 'pod-p'
  | 'mozi'
  | 'popline'
  | 'simple'
  | 'think-media'
  | 'glitch-infinite'
  | 'seamless-bounce'
  | 'baby-earthquake'
  | 'blur-switch';

export type AspectRatioOption = '9:16' | '1:1' | '16:9' | '4:5';

export type ClipDetails = {
  id: string;
  rank: number;
  title: string;
  score: number;
  duration: string;
  thumbnailUrl: string;
  videoUrl?: string;
  metrics: {
    hook: string;
    flow: string;
    value: string;
    trend: string;
  };
  transcript: TranscriptSegment[];
  summary: string[];
  captionStyle: CaptionStyleTone;
  aspectRatio: AspectRatioOption;
};
