<template>
  <div class="reports-page">
    <div class="reports-page__header">
      <h2 class="reports-page__title">Отчёты</h2>
      <button-ui
        :loading="generating"
        @click="generateReport"
      >
        Сгенерировать AI отчёт
      </button-ui>
    </div>

    <loading-wrapper :loading="loading">
      <div class="reports-page__stats">
        <div class="ws-stat-card">
          <div class="ws-stat-card__value">{{ stats.total }}</div>
          <div class="ws-stat-card__label">Всего задач</div>
        </div>
        <div class="ws-stat-card">
          <div class="ws-stat-card__value">{{ stats.done }}</div>
          <div class="ws-stat-card__label">Выполнено</div>
        </div>
        <div class="ws-stat-card">
          <div class="ws-stat-card__value">{{ stats.inProgress }}</div>
          <div class="ws-stat-card__label">В работе</div>
        </div>
        <div class="ws-stat-card">
          <div class="ws-stat-card__value">{{ completionRate }}%</div>
          <div class="ws-stat-card__label">Процент выполнения</div>
        </div>
      </div>

      <div
        v-if="aiReport"
        class="reports-page__ai-report"
      >
        <h3 class="reports-page__ai-title">AI Отчёт</h3>
        <p class="reports-page__ai-content">{{ aiReport }}</p>
      </div>
    </loading-wrapper>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import LoadingWrapper from '~/components/ui/LoadingWrapper.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

import useReports from './_composables/useReports';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const { loading, generating, aiReport, stats, completionRate, fetchStats, generateReport } =
  useReports(workspaceId);

onBeforeMount(async () => {
  await fetchStats();
});

// --- SEO ---
const PAGE_TITLE = 'Отчёты';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.reports-page {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    color: colors.$text;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  &__ai-report {
    background: colors.$white;
    border: 1px solid colors.$border;
    border-radius: 12px;
    padding: 24px;
  }

  &__ai-title {
    font-size: 16px;
    font-weight: 600;
    color: colors.$text;
    margin-bottom: 12px;
  }

  &__ai-content {
    font-size: 14px;
    line-height: 1.7;
    color: colors.$text;
    white-space: pre-wrap;
  }
}

.ws-stat-card {
  background: colors.$white;
  border: 1px solid colors.$border;
  border-radius: 12px;
  padding: 20px 24px;

  &__value {
    font-size: 36px;
    font-weight: 700;
    color: colors.$primary;
    line-height: 1;
    margin-bottom: 8px;
  }

  &__label {
    font-size: 13px;
    color: colors.$text-light;
    font-weight: 500;
  }
}
</style>
