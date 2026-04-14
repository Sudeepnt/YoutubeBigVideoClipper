import { ClipSuggestion } from '../types';

const SCHEDULE_DAY_OFFSETS = [0, 1, 2, 4, 6, 7];
const SCHEDULE_HOURS = [18, 9, 12, 15, 10, 20];
const SCHEDULE_MINUTES = [0, 30, 0, 0, 15, 0];

export type ScheduledClipEvent = {
  clipId: string;
  title: string;
  scheduledAt: string;
};

export function buildScheduledDate(index: number, baseDate = new Date()): Date {
  const schedule = new Date(baseDate);
  schedule.setHours(0, 0, 0, 0);
  schedule.setDate(schedule.getDate() + SCHEDULE_DAY_OFFSETS[index % SCHEDULE_DAY_OFFSETS.length]);
  schedule.setHours(
    SCHEDULE_HOURS[index % SCHEDULE_HOURS.length],
    SCHEDULE_MINUTES[index % SCHEDULE_MINUTES.length],
    0,
    0,
  );
  return schedule;
}

export function formatScheduledLabel(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: date.getMinutes() === 0 ? undefined : '2-digit',
  }).format(date);
}

export function formatScheduleTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: date.getMinutes() === 0 ? undefined : '2-digit',
  }).format(date);
}

export function buildScheduledEvents(
  clips: ClipSuggestion[],
  fallbackTitles: string[],
  fallbackCount = fallbackTitles.length,
): ScheduledClipEvent[] {
  if (!clips.length) {
    return fallbackTitles.slice(0, fallbackCount).map((title, index) => ({
      clipId: `fallback-schedule-${index + 1}`,
      title,
      scheduledAt: buildScheduledDate(index).toISOString(),
    }));
  }

  return clips.map((clip, index) => ({
    clipId: clip.id,
    title: sanitizeScheduleTitle(clip.hook, fallbackTitles[index % fallbackTitles.length]),
    scheduledAt: buildScheduledDate(index).toISOString(),
  }));
}

function sanitizeScheduleTitle(hook: string, fallbackTitle: string): string {
  const cleaned = hook.replace(/\s+/g, ' ').replace(/^['"]+|['"]+$/g, '').trim();
  return cleaned.length > 12 ? cleaned : fallbackTitle;
}
