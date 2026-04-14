import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, Calendar as CalendarIcon, Globe, Clock3 } from 'lucide-react';
import { buildScheduledEvents, formatScheduleTime } from '../lib/clipScheduling';
import { ClipSuggestion, Project } from '../types';

interface CalendarViewProps {
  project?: Project | null;
  clips: ClipSuggestion[];
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const FALLBACK_TITLES = [
  'Useful quote clip',
  'Podcast insight clip',
  'Journey tutorial clip',
  'Bold opinion clip',
  'Motivation clip',
];

export default function CalendarView({ project, clips }: CalendarViewProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const current = new Date();
    return new Date(current.getFullYear(), current.getMonth(), 1);
  });

  const scheduledEvents = useMemo(
    () => buildScheduledEvents(clips, FALLBACK_TITLES, Math.max(1, Math.min(3, FALLBACK_TITLES.length))),
    [clips],
  );

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const eventsByDate = useMemo(() => groupEventsByDate(scheduledEvents), [scheduledEvents]);
  const monthTitle = visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const todayKey = toDateKey(new Date());

  return (
    <div className="calendar-view content-area" style={{ minHeight: '100%' }}>
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <h1 className="page-title" style={{ fontSize: '28px' }}>Calendar</h1>
            <p style={{ marginTop: '6px', color: 'var(--text-secondary)', fontSize: '13px' }}>
              Scheduled clips from your results page land here automatically.
            </p>
          </div>
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', marginBottom: '20px' }}>
        <ChevronLeft
          size={20}
          color="var(--text-secondary)"
          style={{ cursor: 'pointer' }}
          onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
        />
        <span style={{ fontSize: '16px', fontWeight: 700 }}>{monthTitle}</span>
        <ChevronRight
          size={20}
          color="var(--text-secondary)"
          style={{ cursor: 'pointer' }}
          onClick={() => setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
        />
      </div>

      <div style={{ border: '1px solid var(--border-dim)', borderRadius: '13px', overflow: 'hidden', background: 'var(--bg-card)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-dim)', background: '#050505' }}>
          {DAYS.map((day) => (
            <div key={day} style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {day}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '150px' }}>
          {calendarDays.map((date, index) => {
            const dateKey = toDateKey(date);
            const events = eventsByDate.get(dateKey) ?? [];
            const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
            const isToday = dateKey === todayKey;

            return (
              <div
                key={dateKey}
                style={{
                  borderRight: (index + 1) % 7 === 0 ? 'none' : '1px solid var(--border-dim)',
                  borderBottom: index < 35 ? '1px solid var(--border-dim)' : 'none',
                  padding: '12px',
                  background: isToday ? 'rgba(255,255,255,0.04)' : 'transparent',
                  position: 'relative',
                  display: 'grid',
                  alignContent: 'start',
                  gap: '8px',
                  opacity: isCurrentMonth ? 1 : 0.42,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: isToday ? 'white' : 'var(--text-secondary)', fontWeight: isToday ? 700 : 500 }}>
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  {isToday && <div style={{ width: 4, height: 4, background: 'white', borderRadius: '50%' }} />}
                </div>

                {events.map((event) => (
                  <div
                    key={event.clipId}
                    style={{
                      borderRadius: '10px',
                      border: '1px solid rgba(179, 206, 255, 0.1)',
                      background: 'linear-gradient(180deg, rgba(11,17,28,0.98) 0%, rgba(8,12,20,0.94) 100%)',
                      padding: '8px 9px',
                      display: 'grid',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#8fd2ff', fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      <CalendarIcon size={10} />
                      {project?.name ? 'ClipForge post' : 'Scheduled clip'}
                    </div>
                    <div style={{ color: '#f5f8ff', fontSize: '12px', fontWeight: 700, lineHeight: 1.3 }}>
                      {event.title}
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#9fb1cb', fontSize: '11px', fontWeight: 600 }}>
                      <Clock3 size={11} />
                      {formatScheduleTime(new Date(event.scheduledAt))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function buildCalendarDays(visibleMonth: Date): Date[] {
  const firstOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function groupEventsByDate(events: ReturnType<typeof buildScheduledEvents>) {
  const grouped = new Map<string, ReturnType<typeof buildScheduledEvents>>();

  events.forEach((event) => {
    const key = toDateKey(new Date(event.scheduledAt));
    const bucket = grouped.get(key) ?? [];
    bucket.push(event);
    grouped.set(key, bucket);
  });

  return grouped;
}

function toDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}
