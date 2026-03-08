import type { SelectOption } from '~/shared/types/ui/select.types';

export const DAYS_OF_WEEK: SelectOption<number>[] = [
  { label: 'Понедельник', value: 1 },
  { label: 'Вторник', value: 2 },
  { label: 'Среда', value: 3 },
  { label: 'Четверг', value: 4 },
  { label: 'Пятница', value: 5 },
  { label: 'Суббота', value: 6 },
  { label: 'Воскресенье', value: 7 },
];

/** Интервал cron-расписания в минутах */
export const SCHEDULE_CRON_INTERVAL_MINUTES = 30;

export const DAYS_OF_WEEK_SHORT: Record<number, string> = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
  7: 'Вс',
};
