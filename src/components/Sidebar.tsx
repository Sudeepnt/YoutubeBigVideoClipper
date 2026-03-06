import {
    Home,
    LayoutTemplate,
    Folder,
    Calendar,
    BarChart2,
    Link as LinkIcon,
    Crown,
    BookOpen,
    HelpCircle,
    ChevronDown,
    UserPlus,
    ArrowLeftToLine,
    ArrowRightToLine,
    BellRing,
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    isExpanded: boolean;
    onToggle: () => void;
    onShowPricing: () => void;
}

export default function Sidebar({ activeView, onViewChange, isExpanded, onToggle, onShowPricing }: SidebarProps) {
    const openExternal = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <aside className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-header">
                <button onClick={() => onViewChange('home')} title="Go to Home" className="sidebar-brand-btn">
                    <div className="sidebar-brand-mark">P</div>
                    {isExpanded && <span className="sidebar-plan-badge">FreeTrial</span>}
                </button>
                <button onClick={onToggle} className="sidebar-toggle-btn" aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}>
                    {isExpanded ? <ArrowLeftToLine size={14} /> : <ArrowRightToLine size={14} />}
                </button>
            </div>

            <button onClick={() => onViewChange('settings')} className="sidebar-profile-card">
                <div className="sidebar-profile-left">
                    <div className="sidebar-avatar-dot">
                        <div className="sidebar-avatar-emoji">🏜️</div>
                    </div>
                    {isExpanded && (
                        <div className="sidebar-profile-meta">
                            <div className="sidebar-profile-name">sudeepkic...</div>
                            <div className="sidebar-profile-count">
                                <UserPlus size={10} /> 0
                            </div>
                        </div>
                    )}
                </div>
                {isExpanded && <ChevronDown size={14} color="#9ca3af" />}
            </button>

            <button onClick={() => onViewChange('settings')} className="sidebar-invite-btn">
                <UserPlus size={14} /> {isExpanded && 'Invite members'}
            </button>

            <div className="sidebar-nav-stack">
                <div>
                    <div className="sidebar-group-title">{isExpanded ? 'Create' : '...'}</div>
                    <div className="sidebar-group-list">
                        <button className={`sidebar-btn ${activeView === 'home' ? 'active' : ''}`} onClick={() => onViewChange('home')} title="Home">
                            <span className="sidebar-btn-main">
                                <Home size={16} />
                                {isExpanded && 'Home'}
                            </span>
                        </button>
                        <button className={`sidebar-btn ${activeView === 'projects' ? 'active' : ''}`} onClick={() => onViewChange('projects')} title="Brand template">
                            <span className="sidebar-btn-main">
                                <LayoutTemplate size={16} />
                                {isExpanded && 'Brand template'}
                            </span>
                        </button>
                        <button className={`sidebar-btn ${activeView === 'folder' ? 'active' : ''}`} onClick={() => onViewChange('folder')} title="Asset library">
                            <span className="sidebar-btn-main">
                                <Folder size={16} />
                                {isExpanded && 'Asset library'}
                            </span>
                        </button>
                    </div>
                </div>

                <div>
                    <div className="sidebar-group-title">{isExpanded ? 'Post' : '...'}</div>
                    <div className="sidebar-group-list">
                        <button className={`sidebar-btn ${activeView === 'calendar' ? 'active' : ''}`} onClick={() => onViewChange('calendar')} title="Calendar">
                            <span className="sidebar-btn-main">
                                <Calendar size={16} />
                                {isExpanded && 'Calendar'}
                            </span>
                            {isExpanded && <span className="new-badge">New</span>}
                        </button>
                        <button className={`sidebar-btn ${activeView === 'analytics' ? 'active' : ''}`} onClick={() => onViewChange('analytics')} title="Analytics">
                            <span className="sidebar-btn-main">
                                <BarChart2 size={16} />
                                {isExpanded && 'Analytics'}
                            </span>
                            {isExpanded && <span className="new-badge">New</span>}
                        </button>
                        <button className={`sidebar-btn ${activeView === 'link' ? 'active' : ''}`} onClick={() => onViewChange('link')} title="Social accounts">
                            <span className="sidebar-btn-main">
                                <LinkIcon size={16} />
                                {isExpanded && 'Social accounts'}
                            </span>
                        </button>
                        <button className={`sidebar-btn ${activeView === 'notify' ? 'active' : ''}`} onClick={() => onViewChange('notify')} title="Let me know">
                            <span className="sidebar-btn-main">
                                <BellRing size={16} />
                                {isExpanded && 'Let me know'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="sidebar-footer-links">
                <button className="sidebar-btn-footer" title="Subscription" onClick={onShowPricing}>
                    <Crown size={16} /> {isExpanded && 'Subscription'}
                </button>
                <button className="sidebar-btn-footer" title="Learning center" onClick={() => openExternal('https://www.opus.pro/academy')}>
                    <BookOpen size={16} /> {isExpanded && 'Learning center'}
                </button>
                <button className="sidebar-btn-footer" title="Help center" onClick={() => openExternal('https://intercom.help/opusclip/en/')}>
                    <HelpCircle size={16} /> {isExpanded && 'Help center'}
                </button>
            </div>
        </aside>
    );
}
