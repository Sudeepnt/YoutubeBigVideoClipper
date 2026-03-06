// ═══════════════════════════════════════════════════════
// ClipForge Type Definitions
// ═══════════════════════════════════════════════════════

export interface Project {
  id: string;
  name: string;
  filePath: string; // Displayable URL (blob:// or tauri asset://)
  sourcePath?: string; // Absolute persisted path on disk
  fileName: string;
  sourceFile?: File;
  sourceType?: SourceType;
  sourceUrl?: string;
  duration: number; // seconds
  fileSize: number; // bytes
  resolution: { width: number; height: number };
  createdAt: string;
  status: ProjectStatus;
  thumbnailUrl?: string;
  clipCount?: number;
}

export type SourceType = 'upload' | 'link';

export type ProjectStatus = 'imported' | 'transcribing' | 'analyzing' | 'clipping' | 'ready' | 'exporting' | 'complete';

export interface TranscriptWord {
  word: string;
  start: number; // milliseconds
  end: number; // milliseconds
  confidence: number;
}

export interface TranscriptSegment {
  id: number;
  words: TranscriptWord[];
  start: number;
  end: number;
  text: string;
}

export interface ClipSuggestion {
  id: string;
  projectId?: string;
  startMs: number;
  endMs: number;
  hook: string;
  reason: string;
  score: number; // 1-10
  selected: boolean;
  thumbnailUrl?: string;
  videoUrl?: string;
  videoPath?: string;
  createdAt?: string;
  processingMode?: 'copy' | 'reencode';
}

export interface ExportSettings {
  format: 'mp4' | 'webm' | 'mov';
  codec: 'h264' | 'h265' | 'vp9';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  aspectRatio: AspectRatio;
  platform: Platform;
  captions: CaptionSettings;
  outputDir: string;
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5';

export type Platform = 'tiktok' | 'youtube-shorts' | 'instagram-reels' | 'twitter' | 'custom';

export interface CaptionSettings {
  enabled: boolean;
  style: CaptionStyle;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  position: 'top' | 'center' | 'bottom';
  animation: 'none' | 'word-by-word' | 'karaoke' | 'bounce';
}

export type CaptionStyle = 'tiktok' | 'minimal' | 'bold' | 'outline' | 'shadow' | 'custom';

export interface PipelineStage {
  id: string;
  label: string;
  icon: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  progress: number; // 0-100
  message?: string;
}

export interface SystemStatus {
  ollamaRunning: boolean;
  ollamaModel: string;
  whisperReady: boolean;
  ffmpegReady: boolean;
  gpuDetected: boolean;
  gpuName?: string;
}

export interface AppState {
  currentView: ViewType;
  projects: Project[];
  activeProject: Project | null;
  transcript: TranscriptSegment[];
  clips: ClipSuggestion[];
  pipeline: PipelineStage[];
  exportSettings: ExportSettings;
  systemStatus: SystemStatus;
  activeClip: ClipSuggestion | null;
}

export type ViewType = 'home' | 'projects' | 'editor' | 'export' | 'settings' | 'folder' | 'calendar' | 'analytics' | 'link' | 'notify' | 'workflow' | 'clips-list';
