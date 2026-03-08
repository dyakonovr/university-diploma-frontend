import { parseISO } from 'date-fns';

import type {
  SocialPostStatisticDynamicItem,
  SocialPostStatisticMetrics,
} from '~/domain/social-post/models/social-post-statistic.types';
import { useCachedFetch } from '~/shared/composables/useCacheRequest';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { QueryParams } from '~/shared/types/core/request.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';

import type { SocialPostStatisticGranularity } from './socialPostStatistic.utils';

/**
 * Конфиг коэффициентов трансформации метрик.
 * Если ключа нет — значение не меняется.
 */
const METRIC_MULTIPLIERS: Partial<
  Record<keyof SocialPostStatisticMetrics, (value: number) => number>
> = {
  ctr: (value) => Number((value * 100).toFixed(2)),
};

/**
 * Применяет коэффициенты к объекту метрик.
 */
function applyMultipliers(
  metrics: SocialPostStatisticMetrics,
): SocialPostStatisticMetrics {
  return Object.fromEntries(
    Object.entries(metrics).map(([key, value]) => {
      if (value === null) return [key, null];

      const mapper =
        METRIC_MULTIPLIERS[key as keyof SocialPostStatisticMetrics];

      return [key, mapper ? mapper(value) : value];
    }),
  ) as SocialPostStatisticMetrics;
}

/**
 * Применяет коэффициенты к метрикам и дельтам.
 */
export function transformStatisticItems(
  items: SocialPostStatisticDynamicItem[],
): SocialPostStatisticDynamicItem[] {
  return items.map((item) => ({
    ...item,
    metrics: applyMultipliers(item.metrics),
    delta: applyMultipliers(item.delta),
  }));
}

const getIntervalInHoursByGranularity = (
  granularity: SocialPostStatisticGranularity,
): number => {
  if (granularity === 'hour') return 1;
  if (granularity === 'day') return 24;
  if (granularity === 'week') return 168;
  if (granularity === 'month') return 720;
  return 1;
};

const currentDate = new Date();

type RequestFunc = (
  params: QueryParams,
) => Promise<SocialPostStatisticDynamicItem[]>;
function useSocialPostStatisticFetch(requestFunc: RequestFunc) {
  const stats = ref<SocialPostStatisticDynamicItem[] | null>(null);
  const loading = ref(false);
  const { toastError } = useCustomToast();

  const minDate = ref<Date>(currentDate);
  const maxDate = ref<Date>(currentDate);

  function setMinAndMaxDates() {
    if (!stats.value) {
      return;
    }

    minDate.value = stats.value[0]
      ? new Date(parseISO(stats.value[0].parsed_at))
      : currentDate;
    maxDate.value = stats.value[stats.value.length - 1]
      ? new Date(parseISO(stats.value[stats.value.length - 1]!.parsed_at))
      : currentDate;
  }

  async function fetchData(
    dateFrom: Date | null,
    dateTo: Date | null,
    granularity: SocialPostStatisticGranularity,
  ) {
    try {
      const isFirstLoading = stats.value === null;

      loading.value = true;

      const params = objectToQueryString({
        date_from: dateFrom?.toISOString() ?? null,
        date_to: dateTo?.toISOString() ?? null,
        interval: getIntervalInHoursByGranularity(granularity),
      });

      const cacheKey = `social-post-stat:${params}`;

      const { data: cachedData, execute } = useCachedFetch(
        cacheKey,
        () => requestFunc(params),
        1000 * 60 * 10, // 10 min TTL
      );

      await execute();

      if (!cachedData.value) return;

      stats.value = transformStatisticItems(
        cachedData.value.sort(
          (a, b) =>
            parseISO(a.parsed_at).getTime() - parseISO(b.parsed_at).getTime(),
        ),
      );

      if (isFirstLoading) {
        setMinAndMaxDates();
      }
    } catch {
      toastError('Ошибка при получении статистики');
    } finally {
      loading.value = false;
    }
  }

  return {
    stats,
    loading,
    minDate,
    maxDate,
    fetchData,
  };
}

export default useSocialPostStatisticFetch;
