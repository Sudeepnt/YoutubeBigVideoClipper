import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Link as LinkIcon,
    Upload,
    Triangle,
    Sparkles,
    ClosedCaption,
    Crop,
    X,
    Trash2,
    Video,
    Clock,
    FileVideo,
    Folder
} from 'lucide-react';
import CustomArrow from '../components/CustomArrow';
import { Project } from '../types';
import { fetchLinkInfo, type LinkInfo } from '../lib/libraryApi';

interface HomeViewProps {
    onFileSelect: (file: File) => void;
    projects: Project[];
    onOpenProject: (projectId: string) => void;
    onImportFromLink: (url: string, quality: number) => void;
    onDeleteProject: (projectId: string) => void;
}

type FeatureModalType = 'long' | 'captions' | 'reframe' | null;
const LINK_HISTORY_KEY = 'clipforge.link-history.v2';
const MAX_LINK_HISTORY = 8;

const featureModalContent: Record<Exclude<FeatureModalType, null>, { title: string; subtitle: string; placeholder: string; helper?: string }> = {
    long: {
        title: 'Long to Shorts',
        subtitle: 'Our AI engine analyzes hooks and retention to generate viral shorts from any long-form video.',
        placeholder: 'Drop a YouTube or Rumble link'
    },
    captions: {
        title: 'Dynamic AI Captions',
        subtitle: 'Generate high-retention animated captions automatically in 30+ languages.',
        placeholder: 'Drop a video link',
        helper: 'Supports videos up to 120 minutes in 4K resolution.'
    },
    reframe: {
        title: 'Smart Auto-Reframe',
        subtitle: 'Effortlessly track subjects and crop your landscape video for TikTok, Reels, and Shorts.',
        placeholder: 'Drop a video link',
        helper: 'Supports videos up to 120 minutes in 4K resolution.'
    }
};

function formatUploadedAgo(createdAt: string): string {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const diffDays = Math.max(1, Math.floor((now - created) / (1000 * 60 * 60 * 24)));
    return `${diffDays}d ago`;
}

export default function HomeView({ onFileSelect, projects, onOpenProject, onImportFromLink, onDeleteProject }: HomeViewProps) {
    const [featureModal, setFeatureModal] = useState<FeatureModalType>(null);
    const [sourceUrl, setSourceUrl] = useState('');
    const [linkQuality, setLinkQuality] = useState<number>(1080);
    const [linkInfo, setLinkInfo] = useState<LinkInfo | null>(null);
    const [linkInfoLoading, setLinkInfoLoading] = useState(false);
    const [linkInfoError, setLinkInfoError] = useState<string | null>(null);
    const [linkHistory, setLinkHistory] = useState<string[]>([]);
    const [showLinkHistory, setShowLinkHistory] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    
    const modalFileInputRef = useRef<HTMLInputElement>(null);
    const mainFileInputRef = useRef<HTMLInputElement>(null);
    const linkInfoRequestId = useRef(0);

    // Load History
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(LINK_HISTORY_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                setLinkHistory(parsed.filter((item) => typeof item === 'string').slice(0, MAX_LINK_HISTORY));
            }
        } catch (error) {
            console.warn('Failed to load link history:', error);
        }
    }, []);

    const filteredHistory = useMemo(() => {
        const q = sourceUrl.trim().toLowerCase();
        if (!q) return linkHistory;
        return linkHistory.filter((item) => item.toLowerCase().includes(q));
    }, [linkHistory, sourceUrl]);

    const hasCandidateLink = useMemo(() => /^https?:\/\//i.test(sourceUrl.trim()), [sourceUrl]);

    const saveLinkHistory = (url: string) => {
        const clean = url.trim();
        if (!clean) return;
        const deduped = [clean, ...linkHistory.filter((item) => item !== clean)].slice(0, MAX_LINK_HISTORY);
        setLinkHistory(deduped);
        try {
            window.localStorage.setItem(LINK_HISTORY_KEY, JSON.stringify(deduped));
        } catch (error) {
            console.warn('Failed to persist link history');
        }
    };

    const clearLinkHistory = () => {
        setLinkHistory([]);
        try { window.localStorage.removeItem(LINK_HISTORY_KEY); } catch (e) {}
    };

    // File Handlers
    const handleModalUpload = () => modalFileInputRef.current?.click();
    const handleModalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFeatureModal(null);
        onFileSelect(file);
    };

    const openUploadPicker = () => mainFileInputRef.current?.click();
    const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onFileSelect(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('video/')) {
            alert('Please drop a valid video file.');
            return;
        }
        onFileSelect(file);
    };

    // Link Processing
    const handleGetClips = () => {
        if (sourceUrl.trim()) {
            if (linkInfoLoading) return;
            if (hasCandidateLink && !linkInfo) {
                alert(linkInfoError || 'Could not verify link. Please try again.');
                return;
            }
            saveLinkHistory(sourceUrl.trim());
            onImportFromLink(sourceUrl.trim(), linkQuality);
            setSourceUrl('');
            setShowLinkHistory(false);
            setLinkInfo(null);
            setLinkInfoError(null);
            return;
        }
        openUploadPicker();
    };

    useEffect(() => {
        const trimmed = sourceUrl.trim();
        if (!trimmed) {
            setLinkInfo(null); setLinkInfoError(null); setLinkQuality(1080);
            return;
        }

        let parsedUrl: URL;
        try { parsedUrl = new URL(trimmed); } catch { return; }
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) return;

        const requestId = ++linkInfoRequestId.current;
        setLinkInfoLoading(true); setLinkInfoError(null);

        const timer = window.setTimeout(async () => {
            try {
                const info = await fetchLinkInfo(trimmed);
                if (linkInfoRequestId.current !== requestId) return;
                setLinkInfo(info);
                const options = (info.qualityOptions ?? []).filter((q) => Number.isFinite(q) && q > 0);
                if (!options.length) setLinkQuality(Math.max(240, Math.min(1440, Math.floor(info.maxHeight || 720))));
                else setLinkQuality(options[options.length - 1]);
            } catch (error) {
                if (linkInfoRequestId.current !== requestId) return;
                setLinkInfo(null);
                setLinkInfoError(error instanceof Error ? error.message : String(error));
            } finally {
                if (linkInfoRequestId.current === requestId) setLinkInfoLoading(false);
            }
        }, 400);

        return () => window.clearTimeout(timer);
    }, [sourceUrl]);

    const displayedQualityOptions = useMemo(() => linkInfo?.qualityOptions ?? [], [linkInfo]);
    const recentProjects = projects.slice(0, 4);

    return (
        <div className="dashboard-hero">
            
            <div className="bg-text">ClipForge</div>
            
            {/* Bento Grid Container */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
                gridTemplateRows: 'auto auto',
                gap: '24px',
                width: '100%',
                maxWidth: '1200px',
                zIndex: 1,
                position: 'relative'
            }}>
                
                {/* 1. Main Action Hero (Upload/Link) */}
                <motion.div 
                    className="upload-box"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragActive(false); }}
                    onDrop={handleDrop}
                    style={{
                        gridColumn: '1 / 2',
                        gridRow: '1 / 2',
                        borderColor: isDragActive ? 'var(--border-bright)' : 'var(--border-base)',
                        maxWidth: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <div style={{ marginBottom: 24 }}>
                        <h1 className="logo-text" style={{ fontSize: 36, marginBottom: 8 }}>Forge Your Clips.</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.5 }}>
                            Drop a video link or upload a file to let AI find your best moments instantly.
                        </p>
                    </div>

                    <div className="link-history-anchor" style={{ marginBottom: '16px', zIndex: 10 }}>
                        <div className="url-input-container">
                            <LinkIcon size={18} color="var(--text-secondary)" />
                            <input
                                type="text"
                                placeholder="Paste YouTube, Twitch, or Rumble link here..."
                                value={sourceUrl}
                                onChange={(e) => { setSourceUrl(e.target.value); setShowLinkHistory(true); }}
                                onFocus={() => setShowLinkHistory(true)}
                                onClick={() => setShowLinkHistory(true)}
                                onBlur={() => window.setTimeout(() => setShowLinkHistory(false), 150)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleGetClips(); } }}
                            />
                            {hasCandidateLink && (
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {displayedQualityOptions.map((q) => (
                                        <button 
                                            key={q}
                                            onClick={() => setLinkQuality(q)}
                                            className={`quality-pill ${linkQuality === q ? 'active' : ''}`}
                                            disabled={linkInfoLoading}
                                        >
                                            {q}p
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Dropdown History */}
                        <AnimatePresence>
                            {showLinkHistory && filteredHistory.length > 0 && (
                                <motion.div 
                                    className="link-history-dropdown"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <div className="link-history-header">
                                        <span>Recent Imports</span>
                                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={clearLinkHistory}>Clear</button>
                                    </div>
                                    {filteredHistory.map((item) => (
                                        <button
                                            key={item} type="button" className="link-history-item"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => { setSourceUrl(item); setShowLinkHistory(false); }}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div style={{ display: 'flex', gap: 16 }}>
                        <button className="get-clips-btn" onClick={handleGetClips} disabled={hasCandidateLink && linkInfoLoading}>
                             {hasCandidateLink ? (linkInfoLoading ? 'Analyzing Link...' : 'Generate Clips') : 'Select File to Upload'}
                        </button>
                        
                        {!hasCandidateLink && (
                            <button 
                                onClick={openUploadPicker}
                                style={{
                                    width: 48, height: 48, flexShrink: 0,
                                    background: 'var(--bg-input)', border: '1px solid var(--border-bright)',
                                    borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s'
                                }}
                                title="Upload File"
                            >
                                <Upload size={20} />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* 2. Micro Tools / Features (Right Top) */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ gridColumn: '2 / 3', gridRow: '1 / 2', display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Studio Tools</h3>
                    </div>
                    
                    {[
                        { id: 'long', title: 'Viral Shorts Generator', icon: Sparkles },
                        { id: 'captions', title: 'Dynamic AI Captions', icon: ClosedCaption },
                        { id: 'reframe', title: 'Smart Auto-Reframe', icon: Crop },
                    ].map((tool) => (
                        <div 
                            key={tool.id}
                            onClick={() => setFeatureModal(tool.id as FeatureModalType)}
                            className="glass-raised"
                            style={{
                                padding: '16px 20px', borderRadius: 'var(--radius-md)',
                                display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateX(6px)';
                                e.currentTarget.style.borderColor = 'var(--border-bright)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateX(0)';
                                e.currentTarget.style.borderColor = 'var(--border-base)';
                            }}
                        >
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(255,255,255,0.05)`, border: '1px solid var(--border-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <tool.icon size={20} color="var(--text-primary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{tool.title}</h4>
                                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Click to launch workflow</p>
                            </div>
                            <CustomArrow size={20} tone="light" />
                        </div>
                    ))}
                </motion.div>

                {/* 3. Recent Projects Bento Grid (Bottom Full Width) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ gridColumn: '1 / 3', gridRow: '2 / 3', marginTop: 12 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Folder size={18} color="var(--text-primary)" /> Recent Library
                        </h3>
                        {projects.length > 4 && (
                            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>View All</button>
                        )}
                    </div>

                    {projects.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                            {recentProjects.map(project => (
                                <div 
                                    key={project.id} 
                                    className="project-card"
                                    onClick={() => onOpenProject(project.id)}
                                >
                                    <div className="project-thumb">
                                        {project.thumbnailUrl ? (
                                            <img src={project.thumbnailUrl} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <video src={`${project.filePath}#t=1`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted preload="metadata" />
                                        )}
                                        <div className="project-badge" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            {(project.clipCount ?? 0) > 0 ? `${project.clipCount} Clips` : 'Draft'}
                                        </div>
                                        <div className="project-expiry">
                                            <Clock size={10} style={{ display: 'inline', marginRight: 4 }} />
                                            {formatUploadedAgo(project.createdAt)}
                                        </div>
                                    </div>
                                    
                                    <div style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                            <div className="project-title" style={{ fontSize: 14 }}>{project.name}</div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if(window.confirm(`Delete ${project.name}?`)) onDeleteProject(project.id);
                                                }}
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 2 }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <FileVideo size={12} /> {project.sourceType === 'link' ? 'URL Import' : 'Local File'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ width: '100%', padding: '40px', textAlign: 'center', borderRadius: 'var(--radius-lg)', borderStyle: 'dashed', borderColor: 'var(--border-bright)' }}>
                            <Video size={32} color="var(--text-secondary)" style={{ margin: '0 auto 12px' }} />
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No projects yet. Your freshly forged clips will appear here.</p>
                        </div>
                    )}
                </motion.div>

            </div>

            {/* Feature Modal */}
            <AnimatePresence>
                {featureModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="feature-modal-backdrop"
                        onClick={() => setFeatureModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
                            className="feature-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="feature-modal-close" onClick={() => setFeatureModal(null)}><X size={16} /></button>
                            <h3 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8, color: '#fff' }}>{featureModalContent[featureModal!].title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.5, marginBottom: 24 }}>{featureModalContent[featureModal!].subtitle}</p>

                            <div className="feature-modal-inner-box">
                                <div className="url-input-container" style={{ marginBottom: 16 }}>
                                    <LinkIcon size={18} color="var(--text-secondary)" />
                                    <input type="text" placeholder={featureModalContent[featureModal!].placeholder} />
                                </div>
                                <button className="get-clips-btn" style={{ height: 42, fontSize: 14 }}>Launch Workflow</button>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-base)' }}>
                                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Or Import Via</span>
                                    <button className="upload-action-btn" onClick={handleModalUpload}><Upload size={14} /> Local File</button>
                                    <button className="upload-action-btn" onClick={() => alert('Coming soon')}><Triangle size={14} /> Drive</button>
                                </div>
                            </div>

                            {featureModalContent[featureModal!].helper && (
                                <div style={{ color: 'var(--text-tertiary)', marginTop: 16, fontSize: 12, textAlign: 'center' }}>
                                    {featureModalContent[featureModal!].helper}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <input ref={mainFileInputRef} type="file" accept="video/*" onChange={handleMainFileChange} style={{ display: 'none' }} />
            <input ref={modalFileInputRef} type="file" accept="video/*" onChange={handleModalFileChange} style={{ display: 'none' }} />
        </div>
    );
}
