import { ChevronLeft, ChevronRight, Upload, Calendar as CalendarIcon, Globe } from 'lucide-react';

export default function CalendarView() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentYear = 2026;
    const currentMonth = "March";

    // Create a 5x7 grid of days
    const calendarDays = Array.from({ length: 35 }).map((_, i) => ({
        day: i < 31 ? i + 1 : (i - 30),
        month: i < 31 ? 'Mar' : 'Apr',
        isCurrent: i === 4 // Mar 5
    }));

    return (
        <div className="calendar-view content-area" style={{ minHeight: '100%' }}>
            <div className="page-header" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h1 className="page-title" style={{ fontSize: '28px' }}>Calendar</h1>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CalendarIcon size={16} /> Schedule post
                        </button>
                        <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Upload size={16} /> Upload local video
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-dim)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Globe size={14} /> GMT+05
                </div>
            </div>

            {/* Calendar Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '20px' }}>
                <ChevronLeft size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: '16px', fontWeight: 700 }}>{currentYear}{currentMonth}</span>
                <ChevronRight size={20} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
            </div>

            {/* Calendar Grid */}
            <div style={{ border: '1px solid var(--border-dim)', borderRadius: '13px', overflow: 'hidden', background: 'var(--bg-card)' }}>
                {/* Days Label */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-dim)', background: '#050505' }}>
                    {days.map(day => (
                        <div key={day} style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{day}</div>
                    ))}
                </div>

                {/* Dates Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '140px' }}>
                    {calendarDays.map((d, i) => (
                        <div key={i} style={{
                            borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid var(--border-dim)',
                            borderBottom: i < 28 ? '1px solid var(--border-dim)' : 'none',
                            padding: '12px',
                            background: d.isCurrent ? 'rgba(255,255,255,0.04)' : 'transparent',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '12px', color: d.isCurrent ? 'white' : 'var(--text-secondary)', fontWeight: d.isCurrent ? 700 : 400 }}>{d.month} {d.day}</span>
                                {d.isCurrent && <div style={{ width: 4, height: 4, background: 'white', borderRadius: '50%' }} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
