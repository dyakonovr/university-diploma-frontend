<template>
  <form-container
    class="divided"
    :loading="!chartData.length">
    <template #header>
      <p class="form-container__title">Динамика по всем аккаунтам в соц. сетях</p>
    </template>

    <div class="form-container-padding">
      <stat-area-chart
        :data="chartData"
        :categories="categories"
        :x-formatter="xFormatter"
      />

      <stat-report-coming-soon />
    </div>
  </form-container>
</template>

<script setup lang="ts">
import FormContainer from '~/components/ui/form/FormContainer.vue';
import StatAreaChart from '~/shared/ui/statistic/StatAreaChart.vue';
import StatReportComingSoon from '~/shared/ui/statistic/StatReportComingSoon.vue';

type Props = {
  chartData: Record<string, unknown>[];
  categories: Record<string, BulletLegendItemInterface>;
  xFormatter: (tick: number) => string;
};

defineProps<Props>();
</script>
