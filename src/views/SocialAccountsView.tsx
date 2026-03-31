import { useEffect, useState } from 'react';
import { X, Youtube, Linkedin, Facebook, Instagram, Twitter, Zap } from 'lucide-react';

interface SocialAccountsViewProps {
    onClose: () => void;
}

export default function SocialAccountsView({ onClose }: SocialAccountsViewProps) {
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const platforms = [
        { id: 'youtube', icon: <Youtube size={24} color="currentColor" />, label: 'YouTube', sub: 'Channel' },
        { id: 'tiktok', icon: <div style={{ width: 24, height: 24, background: 'white', color: 'black', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>t</div>, label: 'TikTok', sub: 'Feed or Inbox' },
        { id: 'linkedin', icon: <Linkedin size={24} color="currentColor" />, label: 'LinkedIn', sub: 'Personal page or profile' },
        { id: 'facebook', icon: <Facebook size={24} color="currentColor" />, label: 'Facebook', sub: 'Page' },
        { id: 'instagram', icon: <Instagram size={24} color="currentColor" />, label: 'Instagram', sub: 'Business or creator' },
        { id: 'x', icon: <Twitter size={24} color="currentColor" />, label: 'X', sub: 'Profile', premium: true }
    ];

    const handleAddAccount = () => {
        if (!selectedPlatform) return;
        alert(`${selectedPlatform} connection flow can be wired next. Selection is working now.`);
    };

    return (
        <div
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}
        >
            <div style={{
                width: '600px',
                background: '#090909',
                border: '1px solid var(--border-base)',
                borderRadius: '13px',
                padding: '32px',
                position: 'relative',
                boxShadow: 'var(--shadow-lg)'
            }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                    <X size={20} />
                </button>

                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>Add social accounts</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                    {platforms.map((platform) => (
                        <div key={platform.id} style={{
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-dim)',
                            borderRadius: '10px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.2s',
                            outline: selectedPlatform === platform.id ? '2px solid rgba(255,255,255,0.2)' : 'none',
                            color: selectedPlatform === platform.id ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}
                            className={`social-btn ${selectedPlatform === platform.id ? 'selected' : ''}`}
                            onClick={() => setSelectedPlatform(platform.id)}
                        >
                            {platform.premium && <Zap size={14} fill="currentColor" color="currentColor" style={{ position: 'absolute', top: 12, right: 12 }} />}
                            {platform.icon}
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{platform.label}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{platform.sub}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={handleAddAccount}
                        disabled={!selectedPlatform}
                        style={{
                            background: selectedPlatform ? 'white' : '#4b4b4b',
                            color: 'black',
                            border: 'none',
                            padding: '12px 32px',
                            borderRadius: '7px',
                            fontSize: '14px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: selectedPlatform ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Add account
                    </button>
                </div>
            </div>

            <style>{`
                .social-btn:hover {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.18);
                }
                .social-btn.selected {
                    border-color: rgba(255,255,255,0.24);
                    background: rgba(255,255,255,0.08);
                }
            `}</style>
        </div>
    );
}
