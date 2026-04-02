import {
    Home,
    LayoutTemplate,
    Folder,
    Calendar,
    BarChart2,
    Link as LinkIcon,
    ChevronDown,
    UserPlus,
    ArrowLeftToLine,
    ArrowRightToLine,
    RefreshCw,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ViewType } from '../types';

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    isExpanded: boolean;
    onToggle: () => void;
}

export default function Sidebar({ activeView, onViewChange, isExpanded, onToggle }: SidebarProps) {
    const handleRefreshApp = () => {
        window.location.reload();
    };

    return (
        <motion.aside 
            className="sidebar glass-panel"
            initial={false}
            animate={{ width: isExpanded ? 240 : 70 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{ margin: '16px 0 16px 16px', borderRadius: '17px' }}
        >
            <div className={`sidebar-header ${!isExpanded ? 'collapsed' : ''}`}>
                <button onClick={() => onViewChange('home')} title="Go to Home" className="sidebar-brand-btn">
                    <div className="sidebar-brand-mark">
                        <Zap size={16} />
                    </div>
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.span 
                                className="sidebar-plan-badge text-gradient"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                Pro
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
                <button onClick={onToggle} className="sidebar-toggle-btn" aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}>
                    {isExpanded ? <ArrowLeftToLine size={14} /> : <ArrowRightToLine size={14} />}
                </button>
            </div>

            <button onClick={() => onViewChange('settings')} className="sidebar-profile-card">
                <div className="sidebar-profile-left">
                    <div className="sidebar-avatar-dot">
                        <div className="sidebar-avatar-emoji">🪐</div>
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
                {isExpanded && <ChevronDown size={14} />}
            </button>

            <button onClick={() => onViewChange('settings')} className="sidebar-invite-btn">
                <UserPlus size={14} /> {isExpanded && 'Invite Team'}
            </button>

            <div className="sidebar-nav-stack">
                <div>
                    <div className="sidebar-group-title">{isExpanded ? 'Core' : '•'}</div>
                    <div className="sidebar-group-list">
                        <button className={`sidebar-btn ${activeView === 'home' ? 'active' : ''}`} onClick={() => onViewChange('home')} title="Home">
                            <span className="sidebar-btn-main">
                                <Home size={16} />
                                {isExpanded && 'Dashboard'}
                            </span>
                        </button>
                        <button className={`sidebar-btn ${activeView === 'projects' ? 'active' : ''}`} onClick={() => onViewChange('projects')} title="Templates">
                            <span className="sidebar-btn-main">
                                <LayoutTemplate size={16} />
                                {isExpanded && 'Templates'}
                            </span>
                        </button>
                        <button className={`sidebar-btn ${activeView === 'folder' ? 'active' : ''}`} onClick={() => onViewChange('folder')} title="Assets">
                            <span className="sidebar-btn-main">
                                <Folder size={16} />
                                {isExpanded && 'Assets'}
                            </span>
                        </button>
                    </div>
                </div>

                <div>
                    <div className="sidebar-group-title">{isExpanded ? 'Workflow' : '•'}</div>
                    <div className="sidebar-group-list">
                        <button className={`sidebar-btn ${activeView === 'calendar' ? 'active' : ''}`} onClick={() => onViewChange('calendar')} title="Calendar">
                            <span className="sidebar-btn-main">
                                <Calendar size={18} />
                                {isExpanded && 'Calendar'}
                            </span>
                        </button>
                        <button className={`sidebar-btn ${activeView === 'analytics' ? 'active' : ''}`} onClick={() => onViewChange('analytics')} title="Analytics">
                            <span className="sidebar-btn-main">
                                <BarChart2 size={18} />
                                {isExpanded && 'Analytics'}
                            </span>
                            {isExpanded && <span className="new-badge">Beta</span>}
                        </button>
                        <button className={`sidebar-btn ${activeView === 'link' ? 'active' : ''}`} onClick={() => onViewChange('link')} title="Integrations">
                            <span className="sidebar-btn-main">
                                <LinkIcon size={18} />
                                {isExpanded && 'Integrations'}
                            </span>
                        </button>
                        <button
                            className="sidebar-btn"
                            onClick={handleRefreshApp}
                            title="Refresh app"
                        >
                            <span className="sidebar-btn-main">
                                <RefreshCw size={18} />
                                {isExpanded && 'Refresh App'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}
