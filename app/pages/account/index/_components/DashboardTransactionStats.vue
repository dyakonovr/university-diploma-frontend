<template>
  <form-container
    class="divided"
    :loading="loading">
    <template #header>
      <div class="dashboard-tx__header">
        <p class="form-container__title">Изменение баланса</p>
        <nuxt-link
          to="/account/profile"
          class="dashboard-tx__link">
          Подробнее в профиле
        </nuxt-link>
      </div>
    </template>

    <div class="form-container-padding">
      <stat-area-chart
        v-if="chartData.length"
        :data="chartData"
        :categories="TX_CATEGORIES"
        :x-formatter="xFormatter"
        :y-formatter="yFormatter"
      />

      <stat-empty-state
        v-else-if="!loading"
        message="Нет данных о транзакциях."
      />

      <stat-report-coming-soon />
    </div>
  </form-container>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import useTransactionStatistic from '~/domain/user/composables/useTransactionStatistic';
import StatAreaChart from '~/shared/ui/statistic/StatAreaChart.vue';
import StatEmptyState from '~/shared/ui/statistic/StatEmptyState.vue';
import StatReportComingSoon from '~/shared/ui/statistic/StatReportComingSoon.vue';

const TX_CATEGORIES = {
  amount: { name: 'Токены', color: '#6366f1' },
};

const { chartData, loading, xFormatter, yFormatter, fetchData } =
  useTransactionStatistic();

onBeforeMount(() => fetchData());
</script>

<style lang="scss">
.dashboard-tx {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__link {
    font-size: 14px;
    font-weight: 500;
    color: #6366f1;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
