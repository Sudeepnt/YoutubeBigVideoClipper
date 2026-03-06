import { useEffect, useMemo, useState } from 'react';
import { BellRing, Mail, MessageCircle, Send } from 'lucide-react';

type NotifyChannel = 'email' | 'whatsapp';

const STORAGE_KEYS = {
    enabled: 'clipforge_notify_enabled',
    channel: 'clipforge_notify_channel',
    email: 'clipforge_notify_email',
    whatsapp: 'clipforge_notify_whatsapp'
};

export default function NotifyView() {
    const [enabled, setEnabled] = useState(false);
    const [channel, setChannel] = useState<NotifyChannel>('whatsapp');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');

    useEffect(() => {
        const savedEnabled = localStorage.getItem(STORAGE_KEYS.enabled) === 'true';
        const savedChannel = localStorage.getItem(STORAGE_KEYS.channel) as NotifyChannel | null;
        const savedEmail = localStorage.getItem(STORAGE_KEYS.email) ?? '';
        const savedWhatsapp = localStorage.getItem(STORAGE_KEYS.whatsapp) ?? '';

        setEnabled(savedEnabled);
        if (savedChannel === 'email' || savedChannel === 'whatsapp') setChannel(savedChannel);
        setEmail(savedEmail);
        setWhatsapp(savedWhatsapp);
    }, []);

    const saveConfig = () => {
        localStorage.setItem(STORAGE_KEYS.enabled, String(enabled));
        localStorage.setItem(STORAGE_KEYS.channel, channel);
        localStorage.setItem(STORAGE_KEYS.email, email.trim());
        localStorage.setItem(STORAGE_KEYS.whatsapp, whatsapp.trim());
        alert('Saved. We will wire auto-trigger after clipping completes in the next step.');
    };

    const completionMessage = useMemo(
        () => 'ClipForge: your clipping job is complete. Open app to review and export clips.',
        []
    );

    const sendTest = () => {
        if (channel === 'email') {
            const target = email.trim();
            if (!target) {
                alert('Please enter an email address.');
                return;
            }
            const url = `mailto:${encodeURIComponent(target)}?subject=${encodeURIComponent('ClipForge clipping completed')}&body=${encodeURIComponent(completionMessage)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
            return;
        }

        const target = whatsapp.trim();
        const clean = target.replace(/[^0-9]/g, '');
        const text = encodeURIComponent(completionMessage);
        const url = clean
            ? `https://wa.me/${clean}?text=${text}`
            : `https://wa.me/?text=${text}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="content-area" style={{ padding: '28px 34px', color: '#fff' }}>
            <div style={{ maxWidth: 920, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: '#10141d', border: '1px solid #ffffff1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BellRing size={20} color="#93c5fd" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: 30, fontWeight: 700 }}>Let me know</h1>
                        <p style={{ color: '#9ca3af', fontSize: 14 }}>Set where you want completion alerts (Email or WhatsApp Web).</p>
                    </div>
                </div>

                <div style={{ border: '1px solid #ffffff1a', borderRadius: 14, background: '#0c0e13', padding: 18 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, marginBottom: 16, cursor: 'pointer' }}>
                        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                        Enable completion notifications (auto trigger wiring next)
                    </label>

                    <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                        <button
                            onClick={() => setChannel('whatsapp')}
                            style={{
                                border: '1px solid #ffffff24',
                                background: channel === 'whatsapp' ? '#163021' : '#151922',
                                color: '#fff',
                                borderRadius: 8,
                                padding: '9px 12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: 'pointer'
                            }}
                        >
                            <MessageCircle size={16} /> WhatsApp Web
                        </button>
                        <button
                            onClick={() => setChannel('email')}
                            style={{
                                border: '1px solid #ffffff24',
                                background: channel === 'email' ? '#1e293b' : '#151922',
                                color: '#fff',
                                borderRadius: 8,
                                padding: '9px 12px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: 'pointer'
                            }}
                        >
                            <Mail size={16} /> Email
                        </button>
                    </div>

                    {channel === 'email' ? (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6 }}>Email address</div>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                style={{ width: '100%', background: '#0b0f16', border: '1px solid #ffffff1a', color: '#fff', borderRadius: 8, padding: '10px 12px' }}
                            />
                        </div>
                    ) : (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6 }}>WhatsApp number (country code)</div>
                            <input
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                placeholder="919876543210"
                                style={{ width: '100%', background: '#0b0f16', border: '1px solid #ffffff1a', color: '#fff', borderRadius: 8, padding: '10px 12px' }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            onClick={saveConfig}
                            style={{ background: '#f3f4f6', color: '#0b0b0e', border: 'none', borderRadius: 8, padding: '10px 14px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Save
                        </button>
                        <button
                            onClick={sendTest}
                            style={{ background: '#1f2430', color: '#e5e7eb', border: '1px solid #ffffff1f', borderRadius: 8, padding: '10px 14px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                        >
                            <Send size={15} /> Send test
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
