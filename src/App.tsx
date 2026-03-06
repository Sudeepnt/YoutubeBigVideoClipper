import { useState, useCallback, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import HomeView from './views/HomeView';
import BrandTemplateView from './views/BrandTemplateView';
import EditorView from './views/EditorView';
import AssetLibraryView from './views/AssetLibraryView';
import CalendarView from './views/CalendarView';
import AnalyticsView from './views/AnalyticsView';
import SocialAccountsView from './views/SocialAccountsView';
import NotifyView from './views/NotifyView';
import WorkflowView from './views/WorkflowView';
import SettingsView from './views/SettingsView';
import PricingModal from './components/PricingModal';
import ClipsListView from './views/ClipsListView';
import { ViewType, AppState, Project, ClipSuggestion } from './types';
import { defaultExportSettings, defaultSystemStatus } from './store';
import {
  clearProjectClips,
  createLinkProject,
  createUploadProject,
  deleteClip,
  deleteProject,
  initLibrary,
  listProjectClips,
  listProjects,
} from './lib/libraryApi';
import { isTauri } from '@tauri-apps/api/core';
import { Bell, Zap } from 'lucide-react';
import './index.css';

const VALID_VIEWS: ViewType[] = [
  'home',
  'projects',
  'editor',
  'export',
  'settings',
  'folder',
  'calendar',
  'analytics',
  'link',
  'notify',
  'workflow',
  'clips-list'
];

function parseViewFromHash(hash: string): ViewType {
  const raw = hash.replace(/^#\/?/, '').trim();
  return VALID_VIEWS.includes(raw as ViewType) ? (raw as ViewType) : 'home';
}

function viewToHash(view: ViewType): string {
  return `#/${view}`;
}

function App() {
  const initialViewRef = useRef<ViewType>(parseViewFromHash(window.location.hash));
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [state, setState] = useState<AppState>({
    currentView: initialViewRef.current,
    projects: [],
    activeProject: null,
    transcript: [],
    clips: [],
    pipeline: [],
    exportSettings: defaultExportSettings,
    systemStatus: defaultSystemStatus,
    activeClip: null
  });

  const [activeClip, setActiveClip] = useState<ClipSuggestion | null>(null);
  const previousViewRef = useRef<ViewType>(initialViewRef.current);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initLibrary();
        const persistedProjects = await listProjects();
        if (cancelled) return;
        setState((s) => ({ ...s, projects: persistedProjects }));
      } catch (err) {
        console.error('Failed to initialize library:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const nextView = parseViewFromHash(window.location.hash);
      setState((s) => (s.currentView === nextView ? s : { ...s, currentView: nextView }));
    };
    window.addEventListener('hashchange', onHashChange);

    if (!window.location.hash) {
      window.location.hash = viewToHash(initialViewRef.current);
    } else {
      onHashChange();
    }

    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const target = viewToHash(state.currentView);
    if (window.location.hash !== target) {
      window.location.hash = target;
    }
  }, [state.currentView]);

  useEffect(() => {
    if (state.currentView !== 'link') {
      previousViewRef.current = state.currentView;
    }
  }, [state.currentView]);

  useEffect(() => {
    if ((state.currentView === 'workflow' || state.currentView === 'clips-list') && !state.activeProject) {
      const firstProject = state.projects[0];
      if (!firstProject) return;
      setState((s) => ({ ...s, activeProject: firstProject }));
    }
  }, [state.currentView, state.activeProject, state.projects]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarExpanded((prev) => !prev);
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      const metadata = await new Promise<{ duration: number; width: number; height: number }>((resolve) => {
        const video = document.createElement('video');
        const metadataUrl = URL.createObjectURL(file);

        video.preload = 'metadata';
        video.src = metadataUrl;
        video.onloadedmetadata = () => {
          resolve({
            duration: Number.isFinite(video.duration) ? video.duration : 0,
            width: video.videoWidth || 0,
            height: video.videoHeight || 0
          });
          URL.revokeObjectURL(metadataUrl);
        };
        video.onerror = () => {
          resolve({ duration: 0, width: 0, height: 0 });
          URL.revokeObjectURL(metadataUrl);
        };
      });

      if (!isTauri()) {
        const objectUrl = URL.createObjectURL(file);
        const fallbackProject: Project = {
          id: `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          fileName: file.name,
          filePath: objectUrl,
          sourceFile: file,
          sourceType: 'upload',
          fileSize: file.size,
          duration: metadata.duration,
          resolution: { width: metadata.width, height: metadata.height },
          createdAt: new Date().toISOString(),
          status: 'imported',
          thumbnailUrl: undefined,
          clipCount: 0
        };

        setState((s) => ({
          ...s,
          projects: [fallbackProject, ...s.projects],
          activeProject: fallbackProject,
          clips: [],
          currentView: 'workflow'
        }));
        return;
      }

      const nativePath = (file as File & { path?: string }).path;
      let sourceBytes: number[] | undefined;
      if (!nativePath) {
        if (file.size > 80 * 1024 * 1024) {
          throw new Error('For large uploads, please select the file directly in desktop app so path-based persistence can be used.');
        }
        sourceBytes = Array.from(new Uint8Array(await file.arrayBuffer()));
      }

      const persistedProject = await createUploadProject({
        name: file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileSize: file.size,
        duration: metadata.duration,
        resolutionWidth: metadata.width,
        resolutionHeight: metadata.height,
        sourcePath: nativePath,
        sourceBytes
      });

      const project: Project = { ...persistedProject, sourceFile: file };

      setState((s) => ({
        ...s,
        projects: [project, ...s.projects.filter((p) => p.id !== project.id)],
        activeProject: project,
        clips: [],
        currentView: 'workflow'
      }));
    } catch (err) {
      console.error(err);
      alert(`Upload import failed: ${err}`);
    }
  }, []);

  const handleOpenProject = useCallback((projectId: string) => {
    (async () => {
      try {
        const projectClips = await listProjectClips(projectId);
        setState((s) => {
          const project = s.projects.find((p) => p.id === projectId) ?? null;
          if (!project) return s;
          return {
            ...s,
            activeProject: project,
            clips: projectClips,
            currentView: projectClips.length > 0 ? 'clips-list' : 'workflow'
          };
        });
      } catch (err) {
        console.error(err);
        alert(`Failed to open project: ${err}`);
      }
    })();
  }, []);

  const handleImportFromLink = useCallback((url: string) => {
    (async () => {
      try {
        const project = await createLinkProject(url);
        const projectClips = await listProjectClips(project.id);
        setState((s) => ({
          ...s,
          projects: [project, ...s.projects.filter((p) => p.id !== project.id)],
          activeProject: project,
          clips: projectClips,
          currentView: 'workflow'
        }));
      } catch (err) {
        console.error(err);
        alert(`Link import failed: ${err}`);
      }
    })();
  }, []);

  const handleClipsChange = useCallback((clips: ClipSuggestion[]) => {
    setState((s) => {
      s.clips.forEach((clip) => {
        if (clip.videoUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(clip.videoUrl);
        }
      });
      const activeProjectId = s.activeProject?.id;
      const updatedProjects = activeProjectId
        ? s.projects.map((project) => (
          project.id === activeProjectId ? { ...project, clipCount: clips.length } : project
        ))
        : s.projects;

      return {
        ...s,
        clips,
        projects: updatedProjects,
        activeProject: s.activeProject ? { ...s.activeProject, clipCount: clips.length } : s.activeProject
      };
    });
  }, []);

  const handleDeleteProject = useCallback((projectId: string) => {
    (async () => {
      try {
        await deleteProject(projectId);
        setState((s) => {
          const projects = s.projects.filter((p) => p.id !== projectId);
          const isDeletingActive = s.activeProject?.id === projectId;
          return {
            ...s,
            projects,
            activeProject: isDeletingActive ? null : s.activeProject,
            clips: isDeletingActive ? [] : s.clips,
            currentView: isDeletingActive ? 'home' : s.currentView
          };
        });
      } catch (err) {
        console.error(err);
        alert(`Failed to delete project: ${err}`);
      }
    })();
  }, []);

  const handleDeleteClip = useCallback((clipId: string) => {
    (async () => {
      try {
        await deleteClip(clipId);
        setState((s) => {
          const nextClips = s.clips.filter((c) => c.id !== clipId);
          const activeProjectId = s.activeProject?.id;
          const updatedProjects = activeProjectId
            ? s.projects.map((project) => (
              project.id === activeProjectId ? { ...project, clipCount: nextClips.length } : project
            ))
            : s.projects;
          return {
            ...s,
            clips: nextClips,
            projects: updatedProjects,
            activeProject: s.activeProject ? { ...s.activeProject, clipCount: nextClips.length } : s.activeProject
          };
        });
      } catch (err) {
        console.error(err);
        alert(`Failed to delete clip: ${err}`);
      }
    })();
  }, []);

  const handleEditClip = useCallback((clip: ClipSuggestion) => {
    setActiveClip(clip);
    setState((s) => ({ ...s, currentView: 'editor' }));
  }, []);

  const handleViewChange = useCallback((view: ViewType) => {
    setState((s) => ({ ...s, currentView: view }));
  }, []);

  const handleCloseSocialAccounts = useCallback(() => {
    const fallback = previousViewRef.current === 'link' ? 'home' : previousViewRef.current;
    handleViewChange(fallback);
  }, [handleViewChange]);

  return (
    <div className="app-shell">
      <Sidebar
        activeView={state.currentView === 'workflow' || state.currentView === 'clips-list' ? 'home' : state.currentView}
        onViewChange={handleViewChange}
        isExpanded={isSidebarExpanded}
        onToggle={toggleSidebar}
        onShowPricing={() => setShowPricingModal(true)}
      />

      {showPricingModal && <PricingModal onClose={() => setShowPricingModal(false)} />}

      <main className="main-content">
        {/* Top Navbar overlapping the content (Only on Home) */}
        {state.currentView === 'home' && (
          <header className="top-nav">
            <div className="notif-btn">
              <Bell size={20} color="#9ca3af" />
              <div className="notif-badge">17</div>
            </div>
            <div className="credits-badge">
              <Zap size={16} fill="#f59e0b" color="#f59e0b" /> 4
            </div>
            <button className="add-credits-btn">Add more credits</button>
          </header>
        )}

        {state.currentView === 'home' && (
          <HomeView
            onFileSelect={handleFileSelect}
            projects={state.projects}
            onOpenProject={handleOpenProject}
            onImportFromLink={handleImportFromLink}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {state.currentView === 'editor' && state.activeProject && (
          <EditorView
            project={state.activeProject}
            activeClip={activeClip}
            onBack={() => handleViewChange('clips-list')}
          />
        )}

        {state.currentView === 'workflow' && state.activeProject && (
          <WorkflowView
            project={state.activeProject}
            onProjectDeleted={handleDeleteProject}
            onClipsReady={handleClipsChange}
            onOpenClipsList={() => handleViewChange('clips-list')}
          />
        )}

        {state.currentView === 'clips-list' && (
          <ClipsListView
            project={state.activeProject}
            clips={state.clips}
            onClipsChange={handleClipsChange}
            onEditClip={handleEditClip}
            onDeleteClip={handleDeleteClip}
            onClearProjectClips={async (projectId) => {
              await clearProjectClips(projectId);
            }}
            onBack={() => handleViewChange(state.activeProject ? 'workflow' : 'home')}
          />
        )}

        {state.currentView === 'analytics' && <AnalyticsView />}

        {state.currentView === 'calendar' && <CalendarView />}

        {state.currentView === 'projects' && <BrandTemplateView />}

        {state.currentView === 'folder' && <AssetLibraryView />}

        {state.currentView === 'settings' && <SettingsView systemStatus={state.systemStatus} />}
        {state.currentView === 'notify' && <NotifyView />}
        {state.currentView === 'link' && <SocialAccountsView onClose={handleCloseSocialAccounts} />}
      </main>
    </div>
  );
}

export default App;
