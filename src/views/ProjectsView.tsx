import { Project } from '../types';
import { formatDuration, getStatusLabel, getStatusClass } from '../store';
import { Search, Filter, FolderPlus } from 'lucide-react';

interface ProjectsViewProps {
    projects: Project[];
    onOpenProject: (id: string) => void;
    onImport: () => void;
}

export default function ProjectsView({ projects, onOpenProject, onImport }: ProjectsViewProps) {
    return (
        <div className="content-area">
            <div className="page-header animate-fadeInUp">
                <div>
                    <h1 className="page-title">Projects</h1>
                    <p className="page-subtitle">Manage your videos and clips</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <div className="transcript-search">
                        <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                        <input type="text" placeholder="Search projects..." />
                    </div>
                    <button className="btn btn-secondary">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="btn btn-primary" onClick={onImport}>
                        <FolderPlus size={16} /> New Project
                    </button>
                </div>
            </div>

            <div className="projects-grid stagger-animation">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="project-card"
                        onClick={() => onOpenProject(project.id)}
                    >
                        <div className="project-card-thumb">
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    background: `linear-gradient(135deg, 
                    hsl(${parseInt(project.id) * 60 + 220}, 50%, 18%) 0%, 
                    hsl(${parseInt(project.id) * 40 + 180}, 40%, 12%) 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <span style={{ fontSize: 36, opacity: 0.3 }}>🎥</span>
                            </div>
                            <div className="project-card-duration">
                                {formatDuration(project.duration)}
                            </div>
                        </div>
                        <div className="project-card-body">
                            <div className="project-card-title">{project.name}</div>
                            <div className="project-card-meta">
                                <span className={`project-card-status ${getStatusClass(project.status)}`}>
                                    <span
                                        className={`status-dot ${project.status === 'complete' || project.status === 'ready'
                                                ? 'online'
                                                : 'loading'
                                            }`}
                                    />
                                    {getStatusLabel(project.status)}
                                </span>
                                <span>
                                    {project.resolution.width}×{project.resolution.height}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Create New Card */}
                <div
                    className="project-card"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderStyle: 'dashed',
                        background: 'transparent',
                        minHeight: 240,
                    }}
                    onClick={onImport}
                >
                    <div style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        <FolderPlus size={32} style={{ margin: '0 auto var(--space-3)' }} />
                        <div style={{ fontWeight: 500 }}>Create New Project</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
