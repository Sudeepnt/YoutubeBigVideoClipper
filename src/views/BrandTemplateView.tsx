import { Plus, ChevronDown } from 'lucide-react';

export default function BrandTemplateView() {
    return (
        <div className="brand-template-view" style={{ padding: '40px', background: '#0a0a0b', minHeight: '100%', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Brand template</h1>
                <button style={{ background: 'white', color: 'black', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Create new template
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {/* Default Template Card */}
                <div style={{ border: '1px solid #3b82f6', borderRadius: '12px', overflow: 'hidden', background: '#111113' }}>
                    <div style={{ height: '180px', background: '#1e1e20', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ color: '#22c55e', fontSize: '20px', fontWeight: 900, textTransform: 'uppercase' }}>THIS YEAR</div>
                        <div style={{ position: 'absolute', top: 12, left: 12, background: '#3b82f6', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>DEFAULT</div>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600 }}>Default Template</div>
                        <ChevronDown size={14} color="#6b7280" />
                    </div>
                </div>

                {/* Empty State / Add New */}
                <div style={{ border: '1px dashed #ffffff1a', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', height: '235px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#ffffff0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={24} color="#9ca3af" />
                    </div>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>Create new template</span>
                </div>
            </div>
        </div>
    );
}
