import {
  DAYS_OF_WEEK_SHORT,
  SCHEDULE_CRON_INTERVAL_MINUTES,
} from '../constants/schedule.const';
import type { ScheduleTimeSlot } from '../models/schedule.types';

/**
 * Возвращает время, округлённое вверх от текущего + 1 час
 * @example getDefaultTime() // "14:30" (если сейчас 13:05)
 */
export function getDefaultTime(): string {
  const now = new Date();
  const futureMinutes = now.getHours() * 60 + now.getMinutes() + 60;
  const rounded =
    Math.ceil(futureMinutes / SCHEDULE_CRON_INTERVAL_MINUTES) *
    SCHEDULE_CRON_INTERVAL_MINUTES;
  const totalMinutes = rounded % (24 * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Формирует user-friendly label для слота расписания
 * @example formatScheduleSlotLabel(slot) // "Пн 14:30 — Мой слот"
 */
export function formatScheduleSlotLabel(slot: ScheduleTimeSlot): string {
  const dayShort = DAYS_OF_WEEK_SHORT[slot.day_of_week] ?? '?';
  return `${dayShort} ${slot.time} — ${slot.name}`;
}
