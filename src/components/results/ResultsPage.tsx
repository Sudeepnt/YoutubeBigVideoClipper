import { useEffect, useRef, useState } from 'react';
import { ViewType } from '../../types';
import AppSidebar from './AppSidebar';
import AutoHookNotice from './AutoHookNotice';
import ClipActionModal, { type ClipActionType } from './ClipActionModal';
import ClipViewerOverlay from './ClipViewerOverlay';
import ClipRow from './ClipRow';
import ResultsToolbar from './ResultsToolbar';
import TopHeader from './TopHeader';
import { AspectRatioOption, CaptionStyleTone, ClipDetails, ClipItem, SidebarItem } from './types';
import './results-page.css';

interface ResultsPageProps {
  projectTitle: string;
  clips: ClipItem[];
  clipDetailsById: Record<string, ClipDetails>;
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
  onCloseViewer: () => void;
  onPreviousViewerClip: () => void;
  onNextViewerClip: () => void;
  onViewerAspectRatioChange: (ratio: AspectRatioOption) => void;
  onClipAspectRatioChange: (clipId: string, ratio: AspectRatioOption) => void;
  onViewerCaptionStyleChange: (style: CaptionStyleTone) => void;
  onEditViewerClip?: () => void;
  onEditClipFromList?: (clipId: string) => void;
}

export default function ResultsPage({
  projectTitle,
  clips,
  clipDetailsById,
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
  onCloseViewer,
  onPreviousViewerClip,
  onNextViewerClip,
  onViewerAspectRatioChange,
  onClipAspectRatioChange,
  onViewerCaptionStyleChange,
  onEditViewerClip,
  onEditClipFromList,
}: ResultsPageProps) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const isViewerOpen = Boolean(viewerClip);
  const [activeAction, setActiveAction] = useState<{ action: ClipActionType; clip: ClipItem } | null>(null);

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
            <div className="results-page-title-block">
              <p className="results-page-kicker">Clips Result Page</p>
              <h1 className="results-page-title">Original clips ({totalClipCount})</h1>
            </div>
            <ResultsToolbar viewMode={viewMode} onViewModeChange={onViewModeChange} />
          </section>

          {showAutoHook && <AutoHookNotice onDisable={onDisableAutoHook} onClose={onCloseAutoHook} />}

          <ClipRow
            clips={clips}
            viewMode={viewMode}
            clipDetailsById={clipDetailsById}
            previewClipId={previewClipId}
            onPreviewClip={onPreviewClip}
            onOpenClip={onOpenClip}
            onAction={(action, clip) => {
              if (action === 'edit') {
                onEditClipFromList?.(clip.id);
                return;
              }

              setActiveAction({ action, clip });
            }}
            onViewerAspectRatioChange={onClipAspectRatioChange}
            onEditClip={onEditClipFromList}
          />
        </main>
      </div>

      <button type="button" className="results-support-btn">
        Questions?
      </button>

      {viewerClip && (
        <ClipViewerOverlay
          clip={viewerClip}
          onClose={onCloseViewer}
          onPreviousClip={onPreviousViewerClip}
          onNextClip={onNextViewerClip}
          onAspectRatioChange={onViewerAspectRatioChange}
          onCaptionStyleChange={onViewerCaptionStyleChange}
          onEditClip={onEditViewerClip}
        />
      )}

      {activeAction && (
        <ClipActionModal
          clip={activeAction.clip}
          action={activeAction.action}
          onClose={() => setActiveAction(null)}
        />
      )}
    </div>
  );
}
