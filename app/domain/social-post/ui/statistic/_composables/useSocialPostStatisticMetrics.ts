import type {
  SocialPostStatisticDynamicItem,
  SocialPostStatisticMetrics,
} from '~/domain/social-post/models/social-post-statistic.types';
import type { SelectOption } from '~/shared/types/ui/select.types';

export type SocialPostStatisticMetricKey = keyof SocialPostStatisticMetrics;

/** Конфигурация метрик: название и цвет для графиков и легенд */
export const METRIC_CONFIG: Record<
  SocialPostStatisticMetricKey,
  { name: string; color: string }
> = {
  comments: { name: 'Комментарии', color: '#f59e0b' },
  views: { name: 'Просмотры', color: '#6366f1' },
  likes: { name: 'Лайки', color: '#3b82f6' },
  reposts: { name: 'Репосты', color: '#10b981' },
  subscribers: { name: 'Подписчики', color: '#ec4899' },
  ctr: { name: 'CTR (%)', color: '#ef4444' },
};

export const SOCIAL_POST_STATISTIC_METRIC_PRIORITY: SocialPostStatisticMetricKey[] =
  ['views', 'likes', 'comments', 'reposts', 'subscribers', 'ctr'];

function useSocialPostStatisticMetrics() {
  const METRIC_SELECT_OPTIONS = computed<SelectOption[]>(() => {
    return Object.entries(METRIC_CONFIG).map(([key, value]) => ({
      label: value.name,
      value: key,
    }));
  });

  const selectedMetrics = ref<SocialPostStatisticMetricKey[]>([]);

  /** Категории для графиков, отфильтрованные по выбранным метрикам */
  const categories = computed<Record<string, BulletLegendItemInterface>>(() =>
    selectedMetrics.value.reduce(
      (acc, metric) => {
        acc[metric] = METRIC_CONFIG[metric];
        return acc;
      },
      {} as Record<string, BulletLegendItemInterface>,
    ),
  );

  const selectMetricsByPriority = (
    stats: SocialPostStatisticDynamicItem[] | null,
  ) => {
    if (!stats) return;

    const available = SOCIAL_POST_STATISTIC_METRIC_PRIORITY.filter((metric) =>
      stats.some((item) => item.metrics[metric] !== null),
    );

    selectedMetrics.value = available.slice(0, 2);
  };

  return {
    METRIC_SELECT_OPTIONS,
    selectedMetrics,
    selectMetricsByPriority,
    categories,
  };
}

export default useSocialPostStatisticMetrics;
