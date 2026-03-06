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
        <div className="calendar-view" style={{ padding: '40px', background: '#0a0a0b', minHeight: '100%', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Calendar</h1>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ background: 'white', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CalendarIcon size={16} /> Schedule post
                        </button>
                        <button style={{ background: '#1f1f23', border: '1px solid #ffffff1a', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Upload size={16} /> Upload local video
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#111113', padding: '6px 12px', borderRadius: '8px', border: '1px solid #ffffff1a', fontSize: '12px', color: '#9ca3af' }}>
                    <Globe size={14} /> GMT+05
                </div>
            </div>

            {/* Calendar Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '20px' }}>
                <ChevronLeft size={20} color="#4b5563" style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: '16px', fontWeight: 700 }}>{currentYear}{currentMonth}</span>
                <ChevronRight size={20} color="#4b5563" style={{ cursor: 'pointer' }} />
            </div>

            {/* Calendar Grid */}
            <div style={{ border: '1px solid #ffffff1a', borderRadius: '12px', overflow: 'hidden' }}>
                {/* Days Label */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #ffffff0a', background: '#0a0a0b' }}>
                    {days.map(day => (
                        <div key={day} style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#9ca3af' }}>{day}</div>
                    ))}
                </div>

                {/* Dates Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '140px' }}>
                    {calendarDays.map((d, i) => (
                        <div key={i} style={{
                            borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid #ffffff0a',
                            borderBottom: i < 28 ? '1px solid #ffffff0a' : 'none',
                            padding: '12px',
                            background: d.isCurrent ? '#ffffff03' : 'transparent',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '12px', color: d.isCurrent ? 'white' : '#6b7280', fontWeight: d.isCurrent ? 700 : 400 }}>{d.month} {d.day}</span>
                                {d.isCurrent && <div style={{ width: 4, height: 4, background: 'white', borderRadius: '50%' }} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
