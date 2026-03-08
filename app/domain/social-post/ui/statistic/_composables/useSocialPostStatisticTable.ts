import { format } from 'date-fns';

import type {
  SocialPostStatisticDynamicItem,
  SocialPostStatisticMetrics,
} from '~/domain/social-post/models/social-post-statistic.types';
import type {
  TableViewActiveSortButton,
  TableViewHeaderColumn,
} from '~/shared/types/ui/table-view.types.ts';

import {
  groupStatsByPeriod,
  type SocialPostStatisticGranularity,
} from './socialPostStatistic.utils';
import { SOCIAL_POST_STATISTIC_METRIC_PRIORITY } from './useSocialPostStatisticMetrics';

const TABLE_HEADER_COLUMNS: TableViewHeaderColumn[] = [
  {
    prop: 'date',
    label: 'Дата сбора статистики',
    width: 180,
    sortable: true,
    sortableProp: 'formattedTime',
  },
  {
    prop: 'comments',
    label: 'Комментарии',
    width: 180,
    sortable: true,
    sortableProp: 'comments',
  },
  {
    prop: 'views',
    label: 'Просмотры',
    width: 180,
    sortable: true,
    sortableProp: 'views',
  },
  {
    prop: 'likes',
    label: 'Лайки',
    width: 180,
    sortable: true,
    sortableProp: 'likes',
  },
  {
    prop: 'reposts',
    label: 'Репосты',
    width: 120,
    sortable: true,
    sortableProp: 'reposts',
  },
  {
    prop: 'subscribers',
    label: 'Подписчики',
    width: 120,
    sortable: true,
    sortableProp: 'subscribers',
  },
  {
    prop: 'ctr',
    label: 'CTR (%)',
    width: 120,
    sortable: true,
    sortableProp: 'ctr',
  },
];

/**
 * Composable для табличного представления статистики.
 * Принимает `metricsAccessor` для работы как с `metrics`, так и с `delta`.
 */
function useSocialPostStatisticTable(options: {
  stats: Ref<SocialPostStatisticDynamicItem[] | null>;
  granularity: Ref<SocialPostStatisticGranularity>;
  metricsAccessor: (
    item: SocialPostStatisticDynamicItem,
  ) => SocialPostStatisticMetrics;
}) {
  const tableActiveSortButton = ref<TableViewActiveSortButton>(null);

  const tableData = computed(() => {
    if (!options.stats.value) return [];

    const grouped = groupStatsByPeriod(
      options.stats.value,
      options.granularity.value,
      options.metricsAccessor,
      SOCIAL_POST_STATISTIC_METRIC_PRIORITY,
    );

    const rows = grouped.map((group) => ({
      formattedTime: format(group.periodStart, 'dd.MM.yyyy HH:mm'),
      isoTime: group.periodStart.toISOString(),
      ...group.metrics,
    }));

    const sort = tableActiveSortButton.value;
    if (!sort) return rows;

    const { prop, dir } = sort;

    return [...rows].sort((a, b) => {
      const aValue = a[prop];
      const bValue = b[prop];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue > bValue) return dir === 'asc' ? 1 : -1;
      if (aValue < bValue) return dir === 'asc' ? -1 : 1;
      return 0;
    });
  });

  return {
    TABLE_HEADER_COLUMNS,
    tableActiveSortButton,
    tableData,
  };
}

export default useSocialPostStatisticTable;
