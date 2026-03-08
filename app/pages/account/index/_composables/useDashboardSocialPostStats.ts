import { subMonths } from 'date-fns';

import { getSocialPostsDynamicStatisticByUserId } from '~/domain/social-post/api/social-post-statistic.api';
import type { SocialPostStatisticGranularity } from '~/domain/social-post/ui/statistic/_composables/socialPostStatistic.utils';
import useSocialPostStatisticChart from '~/domain/social-post/ui/statistic/_composables/useSocialPostStatisticChart';
import useSocialPostStatisticFetch from '~/domain/social-post/ui/statistic/_composables/useSocialPostStatisticFetch';
import useSocialPostStatisticMetrics from '~/domain/social-post/ui/statistic/_composables/useSocialPostStatisticMetrics';
import useUserStore from '~/domain/user/stores/user';

const DASHBOARD_GRANULARITY: SocialPostStatisticGranularity = 'day';

/**
 * Composable для статистики социальных постов на дашборде.
 * Использует фиксированные параметры: последний месяц, гранулярность "день".
 * Фильтры скрыты — данные загружаются с константными значениями.
 */
function useDashboardSocialPostStats() {
  const userStore = useUserStore();

  const requestFunc = async (
    params: Parameters<typeof getSocialPostsDynamicStatisticByUserId>[1],
  ) => {
    if (!userStore.user) return [];
    const response = await getSocialPostsDynamicStatisticByUserId(
      userStore.user.id,
      params,
    );
    return response.data.data;
  };

  const { loading, stats, fetchData } =
    useSocialPostStatisticFetch(requestFunc);

  const granularity = ref<SocialPostStatisticGranularity>(
    DASHBOARD_GRANULARITY,
  );

  // Metrics for dynamic
  const {
    selectMetricsByPriority,
    selectedMetrics: dynamicSelectedMetrics,
    categories: dynamicCategories,
  } = useSocialPostStatisticMetrics();

  // Metrics for total
  const { selectedMetrics: totalSelectedMetrics, categories: totalCategories } =
    useSocialPostStatisticMetrics();

  // Dynamic chart (delta)
  const { chartData: dynamicChartData, xFormatter: dynamicXFormatter } =
    useSocialPostStatisticChart({
      stats,
      granularity,
      selectedMetrics: dynamicSelectedMetrics,
      metricsAccessor: (item) => item.delta,
    });

  // Total chart (cumulative)
  const { chartData: totalChartData, xFormatter: totalXFormatter } =
    useSocialPostStatisticChart({
      stats,
      granularity,
      selectedMetrics: totalSelectedMetrics,
      metricsAccessor: (item) => item.metrics,
    });

  const hasInitialStats = ref(false);

  async function init() {
    loading.value = true;

    const now = new Date();
    const monthAgo = subMonths(now, 1);

    await fetchData(monthAgo, now, DASHBOARD_GRANULARITY);

    if (stats.value?.length) {
      hasInitialStats.value = true;
    }

    selectMetricsByPriority(stats.value);
    totalSelectedMetrics.value = [...dynamicSelectedMetrics.value];

    loading.value = false;
  }

  return {
    loading,
    hasInitialStats,
    init,

    // Dynamic section
    dynamicChartData,
    dynamicCategories,
    dynamicXFormatter,

    // Total section
    totalChartData,
    totalCategories,
    totalXFormatter,
  };
}

export default useDashboardSocialPostStats;
