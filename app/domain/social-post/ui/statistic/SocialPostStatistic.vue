<template>
  <!-- Пустое состояние: заглушка с размытым графиком -->
  <form-container
    v-if="!hasInitialStats && initialized"
    class="divided">
    <template #header>
      <p class="form-container__title">Статистика</p>
    </template>

    <div class="form-container-padding">
      <stat-empty-state />
    </div>
  </form-container>

  <!-- ДИНАМИКА -->
  <form-container
    v-if="hasInitialStats"
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">{{ dynamicTitle }}</p>
    </template>

    <div class="form-container-padding">
      <stat-filters
        v-model:metrics="selectedMetrics"
        v-model:date-range="dateRange"
        v-model:granularity="granularity"
        :metric-options="METRIC_SELECT_OPTIONS"
        :min-date="minDate"
        :max-date="maxDate"
        :granularity-buttons="availableGranularitiesButtons"
        :loading="loading"
        class="social-post-stats__filters-margin"
      />
    </div>

    <div class="form-container-padding">
      <stat-area-chart
        :data="dynamicChartData"
        :categories="categories"
        :x-formatter="dynamicXFormatter"
      />

      <stat-table
        v-model:active-sort-button="dynamicTableActiveSortButton"
        :data="dynamicTableData"
        :columns="TABLE_HEADER_COLUMNS"
      >
        <template #date="item">{{
          item.formattedTime || 'Нет информации'
        }}</template>
        <template #comments="item">{{
          item.comments ?? 'Нет информации'
        }}</template>
        <template #views="item">{{ item.views ?? 'Нет информации' }}</template>
        <template #likes="item">{{ item.likes ?? 'Нет информации' }}</template>
        <template #reposts="item">{{
          item.reposts ?? 'Нет информации'
        }}</template>
        <template #subscribers="item">{{
          item.subscribers ?? 'Нет информации'
        }}</template>
        <template #ctr="item">{{ item.ctr ?? 'Нет информации' }}</template>
      </stat-table>

      <stat-report-coming-soon />
    </div>
  </form-container>

  <!-- ОБЩАЯ СТАТИСТИКА -->
  <form-container
    v-if="hasInitialStats"
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">{{ totalTitle }}</p>
    </template>

    <div class="form-container-padding">
      <stat-filters
        v-model:metrics="selectedMetrics"
        v-model:date-range="dateRange"
        v-model:granularity="granularity"
        :metric-options="METRIC_SELECT_OPTIONS"
        :min-date="minDate"
        :max-date="maxDate"
        :granularity-buttons="availableGranularitiesButtons"
        :loading="loading"
        class="social-post-stats__filters-margin"
      />

      <button-group-ui
        v-model="totalChartType"
        :items="TOTAL_CHART_BUTTONS"
        class="social-post-stats__chart-switch"
      />

      <donut-chart
        v-if="totalChartType === 'donut'"
        :data="totalDonutData"
        :categories="categories"
        :radius="120"
        :height="300"
        :legend-style="{ marginTop: '25px' }"
        :padding="{ bottom: 10, left: 10, right: 0, top: 0 }"
      />

      <stat-area-chart
        v-else
        :data="totalChartData"
        :categories="categories"
        :x-formatter="totalXFormatter"
      />

      <stat-table
        v-model:active-sort-button="totalTableActiveSortButton"
        :data="totalTableData"
        :columns="TABLE_HEADER_COLUMNS"
      >
        <template #date="item">{{
          item.formattedTime || 'Нет информации'
        }}</template>
        <template #comments="item">{{
          item.comments ?? 'Нет информации'
        }}</template>
        <template #views="item">{{ item.views ?? 'Нет информации' }}</template>
        <template #likes="item">{{ item.likes ?? 'Нет информации' }}</template>
        <template #reposts="item">{{
          item.reposts ?? 'Нет информации'
        }}</template>
        <template #subscribers="item">{{
          item.subscribers ?? 'Нет информации'
        }}</template>
        <template #ctr="item">{{ item.ctr ?? 'Нет информации' }}</template>
      </stat-table>

      <stat-report-coming-soon />
    </div>
  </form-container>
</template>

<script setup lang="ts">
import ButtonGroupUi from '~/components/ui/ButtonGroupUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import type { SocialPostStatisticDynamicItem } from '~/domain/social-post/models/social-post-statistic.types';
import type { QueryParams } from '~/shared/types/core/request.types';
import type { ButtonGroupItems } from '~/shared/types/ui/button-group.types';
import StatAreaChart from '~/shared/ui/statistic/StatAreaChart.vue';
import StatEmptyState from '~/shared/ui/statistic/StatEmptyState.vue';
import StatFilters from '~/shared/ui/statistic/StatFilters.vue';
import StatReportComingSoon from '~/shared/ui/statistic/StatReportComingSoon.vue';
import StatTable from '~/shared/ui/statistic/StatTable.vue';

import useSocialPostStatisticChart from './_composables/useSocialPostStatisticChart';
import useSocialPostStatisticFetch from './_composables/useSocialPostStatisticFetch';
import useSocialPostStatisticFilters from './_composables/useSocialPostStatisticFilters';
import useSocialPostStatisticMetrics from './_composables/useSocialPostStatisticMetrics';
import useSocialPostStatisticTable from './_composables/useSocialPostStatisticTable';

type Props = {
  requestFunc: (
    params: QueryParams,
  ) => Promise<SocialPostStatisticDynamicItem[]>;
  dynamicTitle?: string;
  totalTitle?: string;
};
const props = withDefaults(defineProps<Props>(), {
  dynamicTitle: 'Динамика',
  totalTitle: 'Общая статистика',
});

const { loading, stats, minDate, maxDate, fetchData } =
  useSocialPostStatisticFetch(props.requestFunc);

const { granularity, availableGranularitiesButtons, dateRange } =
  useSocialPostStatisticFilters({
    minDate,
    maxDate,
  });

const {
  METRIC_SELECT_OPTIONS,
  selectMetricsByPriority,
  selectedMetrics,
  categories,
} = useSocialPostStatisticMetrics();

// Total (cumulative metrics)
const {
  chartData: totalChartData,
  donutData: totalDonutData,
  xFormatter: totalXFormatter,
} = useSocialPostStatisticChart({
  stats,
  granularity,
  selectedMetrics,
  metricsAccessor: (item) => item.metrics,
});
const {
  TABLE_HEADER_COLUMNS,
  tableActiveSortButton: totalTableActiveSortButton,
  tableData: totalTableData,
} = useSocialPostStatisticTable({
  stats,
  granularity,
  metricsAccessor: (item) => item.metrics,
});

// Dynamic (delta per period)
const { chartData: dynamicChartData, xFormatter: dynamicXFormatter } =
  useSocialPostStatisticChart({
    stats,
    granularity,
    selectedMetrics,
    metricsAccessor: (item) => item.delta,
  });
const {
  tableActiveSortButton: dynamicTableActiveSortButton,
  tableData: dynamicTableData,
} = useSocialPostStatisticTable({
  stats,
  granularity,
  metricsAccessor: (item) => item.delta,
});

type TotalChartModes = 'donut' | 'area';
const totalChartType = ref<TotalChartModes>('donut');
const TOTAL_CHART_BUTTONS: ButtonGroupItems<TotalChartModes> = [
  { label: 'Donut', key: 'donut' },
  { label: 'Chart', key: 'area' },
];

const hasInitialStats = ref(false);
const initialized = ref(false);

const getData = () =>
  fetchData(
    dateRange.value?.[0] || null,
    dateRange.value?.[1] || null,
    granularity.value,
  );

watch(
  () => [dateRange.value, granularity.value],
  () => {
    if (!initialized.value) return;
    getData();
  },
  { deep: true },
);

onBeforeMount(async () => {
  loading.value = true;
  await fetchData(null, null, granularity.value);

  if (stats.value?.length) {
    hasInitialStats.value = true;
    dateRange.value = [minDate.value, maxDate.value];
  }

  selectMetricsByPriority(stats.value);
  loading.value = false;

  await nextTick();
  initialized.value = true;
});
</script>

<style lang="scss">
.social-post-stats {
  &__filters-margin {
    margin-bottom: 16px;
  }

  &__chart-switch {
    margin-bottom: 16px;
  }
}
</style>
