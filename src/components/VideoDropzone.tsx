import { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, RotateCcw, Zap } from 'lucide-react';

export default function VideoDropzone({ onFileSelect, children }: { onFileSelect: (file: File) => void, children?: React.ReactNode }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const startedAtRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFile = (file: File) => {
        setSelectedFile(file);
        setProgress(0);
        setIsUploading(true);
    };

    useEffect(() => {
        if (!isUploading || !selectedFile) return;
        startedAtRef.current = performance.now();

        const animate = (now: number) => {
            const start = startedAtRef.current ?? now;
            const elapsed = now - start;
            const total = 2800;
            const raw = Math.min(elapsed / total, 1);
            const eased = 1 - Math.pow(1 - raw, 2.6);
            const nextProgress = Math.min(100, Number((eased * 100).toFixed(1)));
            setProgress(nextProgress);

            if (raw >= 1) {
                onFileSelect(selectedFile);
                return;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [isUploading, onFileSelect, selectedFile]);

    const estimatedMinutesLeft = Math.max(1, Math.ceil(((100 - progress) / 100) * 10));

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('video/')) {
                handleFile(file);
            }
        },
        [handleFile]
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                handleFile(file);
            }
        },
        [handleFile]
    );

    return (
        <div className="dropzone-container">
            <div
                className={`dropzone ${isDragging ? 'active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={onDrop}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                <div
                    className="dropzone-content"
                    onClick={() => !isUploading && document.getElementById('fileInput')?.click()}
                    style={{ cursor: isUploading ? 'default' : 'pointer', flex: 1 }}
                >
                    {isUploading ? (
                        <div style={{ padding: '40px', textAlign: 'center' }} className="uploading-panel">
                            <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
                                Import a video to get started<br />
                                Drag & drop a video file, or click to browse. ClipForge will analyze it with AI to find the most viral moments.
                            </div>

                            <div style={{ background: '#111113', border: '1px solid #ffffff0a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }} className="uploading-box">
                                <div style={{ background: '#0f1117', border: '1px solid #ffffff14', borderRadius: '6px', height: '12px', marginBottom: '10px', overflow: 'hidden' }}>
                                    <div className="upload-progress-fill" style={{ width: `${progress}%`, height: '100%' }} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                                        <RotateCcw size={20} className="spin" color="#22c55e" />
                                    </div>
                                    <span style={{ fontSize: '14px', color: '#22c55e', fontWeight: 600 }}>Uploading {progress.toFixed(1)} %</span>
                                    <span style={{ fontSize: '14px', color: '#9ca3af', marginLeft: 'auto' }}>{estimatedMinutesLeft} min left</span>
                                    <span style={{ fontSize: '14px', color: 'white', fontWeight: 600, marginLeft: '24px', cursor: 'pointer' }}>Cancel</span>
                                </div>

                                <button style={{ width: '100%', background: '#4b5563', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'not-allowed' }}>
                                    Get clips in 1 click
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="dropzone-icon">
                                {isDragging ? <Zap size={28} /> : <Upload size={28} />}
                            </div>
                            <div className="dropzone-title">
                                {isDragging ? 'Drop your video here' : 'Import a video to get started'}
                            </div>
                            <div className="dropzone-subtitle">
                                Drag & drop a video file, or click to browse. ClipForge will analyze it
                                with AI to find the most viral moments.
                            </div>
                            <div className="dropzone-formats">
                                {['MP4', 'MOV', 'AVI', 'MKV', 'WEBM'].map((fmt) => (
                                    <span key={fmt} className="format-badge">
                                        {fmt}
                                    </span>
                                ))}
                            </div>
                            <div style={{ marginTop: 'var(--space-4)' }}>
                                <span className="btn btn-primary btn-lg">
                                    <Upload size={18} />
                                    Select Video
                                </span>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </>
                    )}
                </div>
                {children && <div style={{ zIndex: 10, position: 'relative', width: '100%' }}>{children}</div>}
            </div>
        </div>
    );
}
