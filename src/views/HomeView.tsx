import { useRef, useState } from 'react';
import {
    Link as LinkIcon,
    Upload,
    Triangle,
    Sparkles,
    ClosedCaption,
    Crop,
    Circle,
    PlayCircle,
    X,
    MoreHorizontal,
    Trash2
} from 'lucide-react';
import CustomArrow from '../components/CustomArrow';
import { Project } from '../types';

interface HomeViewProps {
    onFileSelect: (file: File) => void;
    projects: Project[];
    onOpenProject: (projectId: string) => void;
    onImportFromLink: (url: string) => void;
    onDeleteProject: (projectId: string) => void;
}

type FeatureModalType = 'long' | 'captions' | 'reframe' | null;

const featureModalContent: Record<Exclude<FeatureModalType, null>, { title: string; subtitle: string; placeholder: string; helper?: string }> = {
    long: {
        title: 'Long to shorts',
        subtitle: 'AI finds hooks, highlights, and turns your video into viral shorts.',
        placeholder: 'Drop a Rumble link'
    },
    captions: {
        title: 'AI Captions',
        subtitle: 'Add stylish captions or translate your content with one click.',
        placeholder: 'Drop a YouTube link',
        helper: 'You can upload videos up to 120 minutes long.'
    },
    reframe: {
        title: 'AI Reframe',
        subtitle: 'Let AI automatically reframe your content to fit any social platform. Save time on manual reframing',
        placeholder: 'Drop a YouTube link',
        helper: 'You can upload videos up to 120 minutes long.'
    }
};

function formatUploadedAgo(createdAt: string): string {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const diffDays = Math.max(1, Math.floor((now - created) / (1000 * 60 * 60 * 24)));
    return `${diffDays} day${diffDays > 1 ? 's' : ''} before expiring`;
}

export default function HomeView({ onFileSelect, projects, onOpenProject, onImportFromLink, onDeleteProject }: HomeViewProps) {
    const [featureModal, setFeatureModal] = useState<FeatureModalType>(null);
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
    const [autoImportEnabled, setAutoImportEnabled] = useState(false);
    const [sourceUrl, setSourceUrl] = useState('');
    const [isDragActive, setIsDragActive] = useState(false);
    const modalFileInputRef = useRef<HTMLInputElement>(null);
    const mainFileInputRef = useRef<HTMLInputElement>(null);

    const handleModalUpload = () => {
        modalFileInputRef.current?.click();
    };

    const handleModalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFeatureModal(null);
        onFileSelect(file);
    };

    const openUploadPicker = () => {
        mainFileInputRef.current?.click();
    };

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

    const handleGetClips = () => {
        if (sourceUrl.trim()) {
            onImportFromLink(sourceUrl.trim());
            setSourceUrl('');
            return;
        }
        openUploadPicker();
    };

    return (
        <div className="dashboard-hero">
            <div className="bg-text">OpusClip</div>

            <div className="logo-text">OpusClip</div>

            <div
                className="upload-box"
                style={{
                    borderColor: isDragActive ? '#3b82f6' : '#ffffff1f'
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragActive(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragActive(false);
                }}
                onDrop={handleDrop}
            >
                <div className="url-input-container" style={{ marginBottom: 12 }}>
                    <LinkIcon size={17} color="#8b93a3" />
                    <input
                        type="text"
                        placeholder="Drop a Rumble link"
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                    />
                </div>

                <div className="upload-actions" style={{ marginBottom: 6 }}>
                    <button className="upload-action-btn" onClick={openUploadPicker}>
                        <Upload size={16} /> Upload
                    </button>
                    <button className="upload-action-btn" onClick={() => alert('Google Drive integration can be connected next.')}>
                        <Triangle size={16} /> Google Drive
                    </button>
                </div>

                <button className="get-clips-btn" onClick={handleGetClips}>
                    Get clips in 1 click
                </button>
            </div>

            <input
                ref={mainFileInputRef}
                type="file"
                accept="video/*"
                onChange={handleMainFileChange}
                style={{ display: 'none' }}
            />

            <div className="feature-toggles">
                <div className="feature-toggle" onClick={() => setFeatureModal('long')}>
                    <div className="feature-icon-wrapper" style={{ background: '#272015' }}>
                        <Sparkles size={24} color="#f59e0b" fill="#f59e0b" />
                    </div>
                    <span>Long to shorts</span>
                </div>
                <div className="feature-toggle" onClick={() => setFeatureModal('captions')}>
                    <div className="feature-icon-wrapper" style={{ background: '#14251c' }}>
                        <ClosedCaption size={24} color="#22c55e" />
                    </div>
                    <span>AI Captions</span>
                </div>
                <div className="feature-toggle" onClick={() => setFeatureModal('reframe')}>
                    <div className="feature-icon-wrapper" style={{ background: '#181e2b' }}>
                        <Crop size={24} color="#3b82f6" />
                    </div>
                    <span>AI Reframe</span>
                </div>
            </div>

            <div className="projects-section">
                <div className="projects-header">
                    <div className="projects-tabs">
                        <button className="project-tab active">All projects ({projects.length})</button>
                        <button className="project-tab">Saved projects (0)</button>
                    </div>

                    <div className="projects-controls">
                        <span className="usage-text">0 GB / 100 GB</span>
                        <div className="toggle-pill" onClick={() => setAutoSaveEnabled((v) => !v)}>
                            <Circle size={8} fill={autoSaveEnabled ? '#22c55e' : '#9ca3af'} color={autoSaveEnabled ? '#22c55e' : '#9ca3af'} /> Auto-save
                        </div>
                        <div className="toggle-pill" onClick={() => setAutoImportEnabled((v) => !v)}>
                            <Circle size={8} fill={autoImportEnabled ? '#22c55e' : '#9ca3af'} color={autoImportEnabled ? '#22c55e' : '#9ca3af'} /> Auto-import <span style={{ fontSize: 10, opacity: 0.6 }}>Beta</span>
                        </div>
                    </div>
                </div>

                <div className="projects-grid">
                    {projects.length ? projects.map((project) => (
                        <div key={project.id} className="project-card" style={{ width: 255 }} onClick={() => onOpenProject(project.id)}>
                            <div className="project-thumb">
                                {project.thumbnailUrl ? (
                                    <img
                                        src={project.thumbnailUrl}
                                        alt={project.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <video
                                        src={`${project.filePath}#t=1`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        muted
                                        preload="metadata"
                                    />
                                )}
                                <div className="project-badge">{(project.clipCount ?? 0) > 0 ? `${project.clipCount} clips` : 'New'}</div>
                                <div className="project-expiry">{formatUploadedAgo(project.createdAt)}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                <div className="project-title">{project.name}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const shouldDelete = window.confirm(`Delete project "${project.name}" and all its clips?`);
                                            if (shouldDelete) onDeleteProject(project.id);
                                        }}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}
                                        aria-label="Delete project"
                                        title="Delete project"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <MoreHorizontal size={16} color="#9ca3af" />
                                </div>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
                                {project.sourceType === 'link' ? 'Link source' : 'Uploaded source'}
                            </div>
                        </div>
                    )) : (
                        <div style={{
                            width: '100%',
                            border: '1px dashed #ffffff2a',
                            borderRadius: 10,
                            padding: '16px 14px',
                            color: '#9ca3af',
                            fontSize: 13
                        }}>
                            No projects yet. Upload a video or import a link to create your first project.
                        </div>
                    )}
                </div>

                <div className="master-section">
                    <div className="master-title">MASTER OPUSCLIP</div>
                    <div className="master-grid">
                        {[
                            { title: 'Turn Any Video Into Viral Shorts in Minutes', image: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=400&h=220&fit=crop' },
                            { title: '5 Top Features You Didn\'t Know About', image: 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=400&h=220&fit=crop' },
                            { title: 'Make 40 YouTube Shorts In 1 Hour', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=220&fit=crop' },
                            { title: 'Edit Faster with Keyboard Shortcuts', image: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=400&h=220&fit=crop' }
                        ].map((vid, i) => (
                            <div key={i} className="project-thumb" style={{ height: 120, position: 'relative', cursor: 'pointer' }}>
                                <img src={vid.image} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.1) 100%)', padding: 12 }}>
                                    <div style={{ color: 'white', fontWeight: 600, fontSize: 14, width: '60%' }}>
                                        {vid.title}
                                    </div>
                                </div>
                                <PlayCircle size={28} color="white" fill="white" style={{ position: 'absolute', bottom: 10, left: 10 }} />
                                {i === 3 && (
                                    <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: '#0b0b0e99', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CustomArrow size={20} tone="light" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {featureModal && (
                <div
                    onClick={() => setFeatureModal(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        zIndex: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%',
                            maxWidth: 560,
                            border: '1px solid #ffffff1f',
                            borderRadius: 10,
                            background: '#08090d',
                            padding: 22,
                            position: 'relative'
                        }}
                    >
                        <button
                            onClick={() => setFeatureModal(null)}
                            style={{ position: 'absolute', top: 14, right: 14, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                        >
                            <X size={18} />
                        </button>

                        <h3 style={{ fontSize: 30, fontWeight: 700, marginBottom: 4 }}>{featureModalContent[featureModal].title}</h3>
                        <p style={{ color: '#a1a1aa', fontSize: 15, lineHeight: 1.5, marginBottom: 18 }}>{featureModalContent[featureModal].subtitle}</p>

                        {featureModal === 'captions' ? (
                            <div style={{ marginBottom: 20, borderRadius: 12, overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
                                {['3','12','22','42','89'].map((seed) => (
                                    <img key={seed} src={`https://picsum.photos/seed/caption-${seed}/180/220`} alt="" style={{ width: '100%', height: 220, objectFit: 'cover' }} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <img src={`https://picsum.photos/seed/${featureModal}-left/300/160`} alt="" style={{ width: '100%', height: 150, borderRadius: 14, objectFit: 'cover' }} />
                                <CustomArrow size={54} />
                                <img src={`https://picsum.photos/seed/${featureModal}-right/300/160`} alt="" style={{ width: '100%', height: 150, borderRadius: 14, objectFit: 'cover' }} />
                            </div>
                        )}

                        <div style={{ background: '#13151b', border: '1px solid #ffffff14', borderRadius: 10, padding: 16 }}>
                            <div className="url-input-container" style={{ marginBottom: 12, background: '#0a0c10' }}>
                                <LinkIcon size={18} color="#6b7280" />
                                <input type="text" placeholder={featureModalContent[featureModal].placeholder} />
                            </div>
                            <div className="upload-actions" style={{ padding: 0 }}>
                                <button className="upload-action-btn" onClick={handleModalUpload}>
                                    <Upload size={16} /> Upload
                                </button>
                                <button className="upload-action-btn" onClick={() => alert('Google Drive integration can be connected next.')}>
                                    <Triangle size={16} /> Google Drive
                                </button>
                            </div>
                        </div>

                        {featureModalContent[featureModal].helper && (
                            <div style={{ color: '#a1a1aa', marginTop: 12, fontSize: 13 }}>
                                {featureModalContent[featureModal].helper}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <input
                ref={modalFileInputRef}
                type="file"
                accept="video/*"
                onChange={handleModalFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}
