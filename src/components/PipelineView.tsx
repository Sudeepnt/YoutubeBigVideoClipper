import { PipelineStage } from '../types';
import { Check, Loader, AlertCircle } from 'lucide-react';

interface PipelineViewProps {
    stages: PipelineStage[];
}

export default function PipelineView({ stages }: PipelineViewProps) {
    const activeStage = stages.find((s) => s.status === 'active');

    return (
        <div className="pipeline-container animate-fadeInUp">
            <div className="pipeline-header">
                <div className="pipeline-title">Processing Pipeline</div>
                {activeStage && (
                    <span className="badge badge-purple">
                        <Loader size={12} className="spinner-inline" />
                        {activeStage.message || 'Processing...'}
                    </span>
                )}
            </div>

            <div className="pipeline-stages">
                {stages.map((stage, index) => (
                    <div key={stage.id} style={{ display: 'flex', alignItems: 'flex-start', flex: 1, gap: '0' }}>
                        <div className={`pipeline-stage ${stage.status}`}>
                            <div className="pipeline-stage-circle">
                                {stage.status === 'complete' ? (
                                    <Check size={18} />
                                ) : stage.status === 'active' ? (
                                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                ) : stage.status === 'error' ? (
                                    <AlertCircle size={18} />
                                ) : (
                                    <span style={{ fontSize: 16 }}>{stage.icon}</span>
                                )}
                            </div>
                            <div className="pipeline-stage-label">{stage.label}</div>
                        </div>
                        {index < stages.length - 1 && (
                            <div
                                className={`pipeline-connector ${stage.status === 'complete'
                                        ? 'complete'
                                        : stage.status === 'active'
                                            ? 'active'
                                            : ''
                                    }`}
                            />
                        )}
                    </div>
                ))}
            </div>

            {activeStage && (
                <div className="progress-container" style={{ marginTop: 'var(--space-6)' }}>
                    <div className="progress-info">
                        <span className="progress-label">{activeStage.label}</span>
                        <span className="progress-value">{activeStage.progress}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${activeStage.progress}%` }} />
                    </div>
                </div>
            )}
        </div>
    );
}
