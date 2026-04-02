import {
  ArrowLeft,
  LayoutGrid,
  House,
  Clapperboard,
  Folder,
  CalendarDays,
  BarChart3,
  Link2,
  RefreshCw,
  UserRound,
  UserPlus,
} from 'lucide-react';
import { type ComponentType } from 'react';
import { ViewType } from '../../types';
import { SidebarItem } from './types';

interface AppSidebarProps {
  activeItem?: SidebarItem;
  onBack?: () => void;
  onNavigate?: (view: ViewType) => void;
}

type NavItem = {
  id: SidebarItem;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  view: ViewType;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: House, view: 'home' },
  { id: 'clips', label: 'Clips', icon: Clapperboard, view: 'clips-list' },
  { id: 'assets', label: 'Assets', icon: Folder, view: 'folder' },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays, view: 'calendar' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, view: 'analytics' },
  { id: 'share', label: 'Share', icon: Link2, view: 'link' },
];

export default function AppSidebar({ activeItem = 'clips', onBack, onNavigate }: AppSidebarProps) {
  const handleRefreshApp = () => {
    window.location.reload();
  };

  return (
    <aside className="results-sidebar" aria-label="Primary navigation">
      <div className="results-sidebar-top">
        <div className="results-sidebar-top-row">
          <button
            type="button"
            className="results-icon-btn"
            onClick={onBack}
            aria-label="Back"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            className="results-icon-btn results-icon-btn--active"
            aria-label="Layout menu"
            title="Layout menu"
          >
            <LayoutGrid size={16} />
          </button>
        </div>

        <button type="button" className="results-avatar-btn" aria-label="Workspace profile" title="Workspace profile">
          <span className="results-avatar-core">
            <UserRound size={13} />
          </span>
        </button>

        <button type="button" className="results-invite-btn" aria-label="Invite team" title="Invite team">
          <UserPlus size={14} />
        </button>
      </div>

      <nav className="results-sidebar-nav" aria-label="Section navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItem;
          return (
            <button
              key={item.id}
              type="button"
              className={`results-sidebar-nav-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavigate?.(item.view)}
              aria-label={item.label}
              title={item.label}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </nav>

      <div className="results-sidebar-footer">
        <button
          type="button"
          className="results-sidebar-footer-btn"
          onClick={handleRefreshApp}
          aria-label="Refresh app"
          title="Refresh app"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </aside>
  );
}
