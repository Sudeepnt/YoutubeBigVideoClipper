import { BarChart2, Filter, ChevronDown, Info } from 'lucide-react';

export default function AnalyticsView() {
    return (
        <div className="analytics-view" style={{ padding: '40px', background: '#0a0a0b', minHeight: '100%', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Analytics</h1>
                    <span style={{ background: '#ffffff1a', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#9ca3af' }}>Beta</span>
                    <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>Currently only available for TikTok and YouTube accounts</span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ background: '#1f1f23', border: '1px solid #ffffff1a', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BarChart2 size={16} /> Last 7 days <ChevronDown size={14} />
                    </button>
                    <button style={{ background: '#1f1f23', border: '1px solid #ffffff1a', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={16} /> Filtering by
                    </button>
                </div>
            </div>

            {/* Account Views Chart Area */}
            <div style={{ background: '#111113', border: '1px solid #ffffff1a', borderRadius: '12px', padding: '24px', marginBottom: '32px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e5e7eb', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600 }}>Account views</span>
                            <Info size={14} color="#6b7280" />
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>25 Feb 2026 - 5 Mar 2026</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                        <div style={{ width: 14, height: 14, border: '1px solid #4b5563', borderRadius: '2px' }} />
                        Posted through OpusClip
                    </div>
                </div>

                {/* Mock Chart Area */}
                <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1px', paddingBottom: '20px', borderBottom: '1px solid #ffffff0a' }}>
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '100%', height: '2px', background: '#3b82f6', opacity: 0.1 }}></div>
                        </div>
                    ))}
                    <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, height: '1px', background: '#ffffff05' }}></div>
                    <div style={{ position: 'absolute', bottom: '140px', left: 0, right: 0, height: '1px', background: '#ffffff05' }}></div>
                    <div style={{ position: 'absolute', bottom: '200px', left: 0, right: 0, height: '1px', background: '#ffffff05' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: '#4b5563', padding: '0 20px' }}>
                    <span>Feb 25</span>
                    <span>Feb 26</span>
                    <span>Feb 27</span>
                    <span>Feb 28</span>
                    <span>Mar 1</span>
                    <span>Mar 2</span>
                    <span>Mar 3</span>
                </div>
            </div>

            {/* Audience Insights */}
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#f3f4f6' }}>Audience Insights</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', opacity: 0.6 }}>
                {[
                    { label: 'Aggregated views', value: '512,472' },
                    { label: 'Aggregated likes', value: '765' },
                    { label: 'Aggregated comments', value: '59' },
                    { label: 'Aggregated shares', value: '3,234' }
                ].map((stat, i) => (
                    <div key={i} style={{ background: '#111113', border: '1px solid #ffffff1a', borderRadius: '12px', padding: '24px', position: 'relative' }}>
                        <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            {stat.label}
                            <ChevronDown size={14} />
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</div>
                        {i === 0 && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,11,0.4)', backdropFilter: 'blur(4px)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ background: '#1f1f23', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, border: '1px solid #ffffff1a' }}>Advanced analytics coming soon</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
