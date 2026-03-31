import { useEffect, useRef } from 'react';
import { ViewType } from '../../types';
import AppSidebar from './AppSidebar';
import AutoHookNotice from './AutoHookNotice';
import ClipViewerOverlay from './ClipViewerOverlay';
import ClipRow from './ClipRow';
import ResultsToolbar from './ResultsToolbar';
import TopHeader from './TopHeader';
import { AspectRatioOption, CaptionStyleTone, ClipDetails, ClipItem, SidebarItem } from './types';
import './results-page.css';

interface ResultsPageProps {
  projectTitle: string;
  clips: ClipItem[];
  totalClipCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  showAutoHook: boolean;
  onDisableAutoHook: () => void;
  onCloseAutoHook: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  previewClipId: string | null;
  onPreviewClip: (id: string) => void;
  onOpenClip: (id: string) => void;
  onBack?: () => void;
  onNavigate?: (view: ViewType) => void;
  activeSidebarItem?: SidebarItem;
  viewerClip: ClipDetails | null;
  viewerCaptionText: string;
  onCloseViewer: () => void;
  onPreviousViewerClip: () => void;
  onNextViewerClip: () => void;
  onViewerAspectRatioChange: (ratio: AspectRatioOption) => void;
  onViewerCaptionStyleChange: (style: CaptionStyleTone) => void;
  onEditViewerClip?: () => void;
}

export default function ResultsPage({
  projectTitle,
  clips,
  totalClipCount,
  searchValue,
  onSearchChange,
  showAutoHook,
  onDisableAutoHook,
  onCloseAutoHook,
  viewMode,
  onViewModeChange,
  previewClipId,
  onPreviewClip,
  onOpenClip,
  onBack,
  onNavigate,
  activeSidebarItem = 'clips',
  viewerClip,
  viewerCaptionText,
  onCloseViewer,
  onPreviousViewerClip,
  onNextViewerClip,
  onViewerAspectRatioChange,
  onViewerCaptionStyleChange,
  onEditViewerClip,
}: ResultsPageProps) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const isViewerOpen = Boolean(viewerClip);

  useEffect(() => {
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (!isShortcut) return;
      event.preventDefault();
      searchInputRef.current?.focus();
    };

    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  return (
    <div className={`results-page ${isViewerOpen ? 'has-viewer-open' : ''}`}>
      <AppSidebar activeItem={activeSidebarItem} onBack={onBack} onNavigate={onNavigate} />

      <div className="results-main">
        <TopHeader
          projectTitle={projectTitle}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchInputRef={searchInputRef}
        />

        <main className="results-content" aria-label="AI output review">
          <section className="results-content-head">
            <p className="results-content-label">Original clips ({totalClipCount})</p>
            <ResultsToolbar viewMode={viewMode} onViewModeChange={onViewModeChange} />
          </section>

          {showAutoHook && <AutoHookNotice onDisable={onDisableAutoHook} onClose={onCloseAutoHook} />}

          <ClipRow
            clips={clips}
            previewClipId={previewClipId}
            onPreviewClip={onPreviewClip}
            onOpenClip={onOpenClip}
          />

          <div className="results-empty-canvas" aria-hidden="true" />
        </main>
      </div>

      <button type="button" className="results-support-btn">
        Questions?
      </button>

      {viewerClip && (
        <ClipViewerOverlay
          clip={viewerClip}
          captionText={viewerCaptionText}
          onClose={onCloseViewer}
          onPreviousClip={onPreviousViewerClip}
          onNextClip={onNextViewerClip}
          onAspectRatioChange={onViewerAspectRatioChange}
          onCaptionStyleChange={onViewerCaptionStyleChange}
          onEditClip={onEditViewerClip}
        />
      )}
    </div>
  );
}
