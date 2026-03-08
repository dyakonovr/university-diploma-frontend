<template>
  <account-table-header
    :with-create-link="false"
    :with-filters="false" />

  <div class="dashboard-container">
    <dashboard-create-flow-block />

    <!-- РАСПИСАНИЕ -->
    <schedule-calendar
      :slots="scheduleSlots"
      :loading="scheduleLoading"
      @refresh="loadScheduleSlots"
    />

    <!-- Статистика постов -->
    <template v-if="hasInitialStats">
      <div class="dashboard__stats-grid">
        <dashboard-dynamic-stats
          :chart-data="dynamicChartData"
          :categories="dynamicCategories"
          :x-formatter="dynamicXFormatter"
        />

        <dashboard-total-stats
          :chart-data="totalChartData"
          :categories="totalCategories"
          :x-formatter="totalXFormatter"
        />
      </div>
    </template>

    <form-container
      v-else-if="!loading"
      class="divided"
      :loading="loading">
      <template #header>
        <p class="form-container__title">Статистика</p>
      </template>

      <div class="form-container-padding">
        <stat-empty-state />
      </div>
    </form-container>

    <!-- ТРАНЗАКЦИИ -->
    <dashboard-transaction-stats />
  </div>
</template>

<script lang="ts" setup>
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import useScheduleTimeSlots from '~/domain/schedule/composables/useScheduleTimeSlots';
import ScheduleCalendar from '~/domain/schedule/ui/ScheduleCalendar.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import StatEmptyState from '~/shared/ui/statistic/StatEmptyState.vue';

import DashboardCreateFlowBlock from './_components/DashboardCreateFlowBlock.vue';
import DashboardDynamicStats from './_components/DashboardDynamicStats.vue';
import DashboardTotalStats from './_components/DashboardTotalStats.vue';
import DashboardTransactionStats from './_components/DashboardTransactionStats.vue';
import useDashboardSocialPostStats from './_composables/useDashboardSocialPostStats';

const {
  loading,
  hasInitialStats,
  init,
  dynamicChartData,
  dynamicCategories,
  dynamicXFormatter,
  totalChartData,
  totalCategories,
  totalXFormatter,
} = useDashboardSocialPostStats();

const {
  slots: scheduleSlots,
  loading: scheduleLoading,
  loadSlots: loadScheduleSlots,
} = useScheduleTimeSlots();

onBeforeMount(() => {
  init();
  loadScheduleSlots();
});

// --- SEO ---
const PAGE_TITLE = 'Дашборд';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.dashboard {
  &__stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 16px;
    margin-bottom: 16px;

    @media screen and (max-width: 1200px) {
      grid-template-columns: 1fr;
    }

    > .form-container {
      margin-top: 0;
      margin-bottom: 0;
      min-width: 0;
      overflow: hidden;
    }
  }
}
</style>
