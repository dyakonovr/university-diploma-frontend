import {
  parseISO,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import type {
  SocialPostStatisticDynamicItem,
  SocialPostStatisticMetrics,
} from '~/domain/social-post/models/social-post-statistic.types';

import type { SocialPostStatisticMetricKey } from './useSocialPostStatisticMetrics';

/** Гранулярность группировки статистики */
export type SocialPostStatisticGranularity = 'month' | 'week' | 'day' | 'hour';

/** Возвращает начало периода для заданной даты и гранулярности */
export function getSocialPostStatisticGroupDate(
  date: Date,
  g: SocialPostStatisticGranularity,
): Date {
  if (g === 'month') return startOfMonth(date);
  if (g === 'week') return startOfWeek(date, { weekStartsOn: 1 });
  if (g === 'day') return startOfDay(date);
  return startOfHour(date);
}

export type GroupedStatPoint = {
  periodStart: Date;
  latestParsedAt: Date;
  metrics: Partial<Record<SocialPostStatisticMetricKey, number | null>>;
};

/**
 * Группирует статистику по периоду, оставляя для каждого периода
 * последнюю запись по parsed_at.
 */
export function groupStatsByPeriod(
  stats: SocialPostStatisticDynamicItem[],
  granularity: SocialPostStatisticGranularity,
  metricsAccessor: (
    item: SocialPostStatisticDynamicItem,
  ) => SocialPostStatisticMetrics,
  metricKeys: SocialPostStatisticMetricKey[],
): GroupedStatPoint[] {
  const map = new Map<number, GroupedStatPoint>();

  for (const point of stats) {
    const parsedAt = parseISO(point.parsed_at);
    const periodStart = getSocialPostStatisticGroupDate(parsedAt, granularity);
    const key = periodStart.getTime();

    const metrics: Partial<
      Record<SocialPostStatisticMetricKey, number | null>
    > = {};
    for (const m of metricKeys) {
      metrics[m] = metricsAccessor(point)[m];
    }

    const existing = map.get(key);

    if (!existing || parsedAt > existing.latestParsedAt) {
      map.set(key, { periodStart, latestParsedAt: parsedAt, metrics });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => a.periodStart.getTime() - b.periodStart.getTime(),
  );
}
