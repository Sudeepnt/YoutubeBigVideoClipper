import { Folder, Search } from 'lucide-react';

export default function AssetLibraryView() {
    return (
        <div className="asset-library-view" style={{ padding: '40px', background: '#0a0a0b', minHeight: '100%', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Asset library</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} color="#6b7280" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search assets"
                            style={{ background: '#1f1f23', border: '1px solid #ffffff1a', borderRadius: '8px', color: 'white', padding: '8px 12px 8px 36px', fontSize: '13px', width: '240px' }}
                        />
                    </div>
                    <button style={{ background: 'white', color: 'black', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                        Upload assets
                    </button>
                </div>
            </div>

            <div style={{ borderBottom: '1px solid #ffffff1a', display: 'flex', gap: '32px', marginBottom: '24px' }}>
                <div style={{ padding: '12px 0', borderBottom: '2px solid white', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>All assets</div>
                <div style={{ padding: '12px 0', color: '#6b7280', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Images</div>
                <div style={{ padding: '12px 0', color: '#6b7280', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Videos</div>
                <div style={{ padding: '12px 0', color: '#6b7280', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Audio</div>
            </div>

            {/* Empty State */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', color: '#4b5563' }}>
                <Folder size={64} strokeWidth={1} style={{ marginBottom: '20px', opacity: 0.2 }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#9ca3af', marginBottom: '8px' }}>Your library is empty</h3>
                <p style={{ fontSize: '14px', maxWidth: '300px', textAlign: 'center' }}>Upload images, videos, or audio files to use them in your projects.</p>
            </div>
        </div>
    );
}
