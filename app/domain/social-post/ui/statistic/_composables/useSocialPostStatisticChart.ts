import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { computed } from 'vue';

import type {
  SocialPostStatisticDynamicItem,
  SocialPostStatisticMetrics,
} from '~/domain/social-post/models/social-post-statistic.types';

import {
  groupStatsByPeriod,
  type SocialPostStatisticGranularity,
} from './socialPostStatistic.utils';
import type { SocialPostStatisticMetricKey } from './useSocialPostStatisticMetrics';

/**
 * Composable для подготовки данных графика статистики.
 * Принимает `metricsAccessor` для работы как с `metrics`, так и с `delta`.
 */
function useSocialPostStatisticChart(options: {
  stats: Ref<SocialPostStatisticDynamicItem[] | null>;
  granularity: Ref<SocialPostStatisticGranularity>;
  selectedMetrics: Ref<SocialPostStatisticMetricKey[]>;
  metricsAccessor: (
    item: SocialPostStatisticDynamicItem,
  ) => SocialPostStatisticMetrics;
}) {
  const chartData = computed(() => {
    if (!options.stats.value) return [];

    const grouped = groupStatsByPeriod(
      options.stats.value,
      options.granularity.value,
      options.metricsAccessor,
      options.selectedMetrics.value,
    );

    return grouped.map((g) => ({
      formattedTime: format(g.periodStart, 'dd.MM.yyyy HH:mm'),
      isoTime: g.periodStart.toISOString(),
      ...g.metrics,
    }));
  });

  /** Данные для donut-графика: значения выбранных метрик из последней точки */
  const donutData = computed<number[]>(() => {
    if (!chartData.value.length) return [];

    const latest = chartData.value[chartData.value.length - 1];
    return options.selectedMetrics.value.map(
      (m) => (latest?.[m] as number) ?? 0,
    );
  });

  /** Форматтер для оси X графика */
  const xFormatter = (tick: number): string => {
    const item = chartData.value[tick];
    if (!item) return '';

    const date = parseISO(item.isoTime);

    if (options.granularity.value === 'month') {
      return format(date, 'MMMM yyyy', { locale: ru });
    }

    if (options.granularity.value === 'week') {
      return `Неделя с ${format(date, 'dd MMMM', { locale: ru })}`;
    }

    if (options.granularity.value === 'hour') {
      return format(date, 'dd MMMM, HH:mm', { locale: ru });
    }

    return format(date, 'dd MMMM', { locale: ru });
  };

  return {
    chartData,
    donutData,
    xFormatter,
  };
}

export default useSocialPostStatisticChart;
