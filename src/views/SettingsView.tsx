import { SystemStatus } from '../types';
import { Cpu, HardDrive, RefreshCcw, Database } from 'lucide-react';

interface SettingsViewProps {
    systemStatus: SystemStatus;
}

export default function SettingsView({ systemStatus }: SettingsViewProps) {
    return (
        <div className="content-area">
            <div className="page-header animate-fadeInUp">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Configure AI models, hardware, and app preferences</p>
                </div>
            </div>

            <div className="settings-page stagger-animation">
                {/* AI Models */}
                <div className="settings-section">
                    <div className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Cpu size={18} />
                        AI Models & Inference
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="settings-row-label">Local LLM Engine</div>
                            <div className="settings-row-desc">
                                {systemStatus.ollamaRunning
                                    ? 'Ollama is running on localhost:11434'
                                    : 'Requires Ollama to be installed and running'}
                            </div>
                        </div>
                        <span className={`badge ${systemStatus.ollamaRunning ? 'badge-green' : 'badge-red'}`}>
                            {systemStatus.ollamaRunning ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="settings-row-label">Language Model</div>
                            <div className="settings-row-desc">Used for clip generation and virality scoring</div>
                        </div>
                        <select className="form-select" defaultValue="mistral" style={{ width: 220 }}>
                            <option value="mistral">Mistral 7B (Recommended)</option>
                            <option value="llama3">Llama 3.1 8B</option>
                            <option value="phi3">Phi-3 Mini (Fast)</option>
                        </select>
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="settings-row-label">Whisper Model</div>
                            <div className="settings-row-desc">Used for transcription and timestamps</div>
                        </div>
                        <select className="form-select" defaultValue="base" style={{ width: 220 }}>
                            <option value="tiny">ggml-tiny.en (Fastest)</option>
                            <option value="base">ggml-base.en (Default)</option>
                            <option value="small">ggml-small.en (Accurate)</option>
                        </select>
                    </div>
                </div>

                {/* Hardware */}
                <div className="settings-section">
                    <div className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <HardDrive size={18} />
                        Hardware Acceleration
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="settings-row-label">GPU Acceleration</div>
                            <div className="settings-row-desc">
                                {systemStatus.gpuDetected
                                    ? `Detected: ${systemStatus.gpuName}. Enabled for Whisper & LLM.`
                                    : 'No compatible GPU detected. Falling back to CPU.'}
                            </div>
                        </div>
                        <button className={`toggle active`}>
                            <div className="toggle-knob" />
                        </button>
                    </div>
                </div>

                {/* Data Management */}
                <div className="settings-section">
                    <div className="settings-section-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Database size={18} />
                        Data Management
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="settings-row-label">Clear Cache</div>
                            <div className="settings-row-desc">Remove temporary video chunks and old transcripts (2.4 GB)</div>
                        </div>
                        <button className="btn btn-secondary btn-sm">
                            Clear Cache
                        </button>
                    </div>

                    <div className="settings-row">
                        <div>
                            <div className="settings-row-label">Application Updates</div>
                            <div className="settings-row-desc">Check for the latest version of ClipForge</div>
                        </div>
                        <button className="btn btn-secondary btn-sm">
                            <RefreshCcw size={14} /> Check for Updates
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
