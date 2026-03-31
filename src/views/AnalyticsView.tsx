import { BarChart2, Filter, ChevronDown, Info } from 'lucide-react';

export default function AnalyticsView() {
    return (
        <div className="analytics-view content-area" style={{ minHeight: '100%' }}>
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h1 className="page-title" style={{ fontSize: '28px' }}>Analytics</h1>
                    <span className="badge">Beta</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '8px' }}>Currently only available for TikTok and YouTube accounts</span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BarChart2 size={16} /> Last 7 days <ChevronDown size={14} />
                    </button>
                    <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={16} /> Filtering by
                    </button>
                </div>
            </div>

            {/* Account Views Chart Area */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-dim)', borderRadius: '13px', padding: '24px', marginBottom: '32px', position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600 }}>Account views</span>
                            <Info size={14} color="var(--text-secondary)" />
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>25 Feb 2026 - 5 Mar 2026</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <div style={{ width: 14, height: 14, border: '1px solid var(--border-base)', borderRadius: '1px', background: 'rgba(255,255,255,0.06)' }} />
                        Posted through Dream Clip
                    </div>
                </div>

                {/* Mock Chart Area */}
                <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1px', paddingBottom: '20px', borderBottom: '1px solid var(--border-dim)' }}>
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '100%', height: '2px', background: '#ffffff', opacity: 0.12 }}></div>
                        </div>
                    ))}
                    <div style={{ position: 'absolute', bottom: '80px', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <div style={{ position: 'absolute', bottom: '140px', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <div style={{ position: 'absolute', bottom: '200px', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', padding: '0 20px' }}>
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
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)' }}>Audience Insights</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', opacity: 0.6 }}>
                {[
                    { label: 'Aggregated views', value: '512,472' },
                    { label: 'Aggregated likes', value: '765' },
                    { label: 'Aggregated comments', value: '59' },
                    { label: 'Aggregated shares', value: '3,234' }
                ].map((stat, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-dim)', borderRadius: '11px', padding: '24px', position: 'relative' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                            {stat.label}
                            <ChevronDown size={14} />
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>{stat.value}</div>
                        {i === 0 && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.55)', backdropFilter: 'blur(4px)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 16px', borderRadius: '14px', fontSize: '13px', fontWeight: 600, border: '1px solid var(--border-base)' }}>Advanced analytics coming soon</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
