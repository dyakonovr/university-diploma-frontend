<template>
  <div class="reports-page">
    <div class="reports-page__header">
      <h2 class="reports-page__title">Отчёты</h2>
      <button-ui
        variant="outlined"
        :to="`/workspaces/${workspaceId}/reports/presets`"
      >
        Управление пресетами
      </button-ui>
    </div>

    <loading-wrapper :loading="presetsLoading">
      <p
        v-if="!presets.length"
        class="reports-page__empty"
      >
        Нет пресетов для генерации отчётов
      </p>

      <div
        v-else
        class="reports-page__presets"
      >
        <div
          v-for="preset in presets"
          :key="preset.id"
          class="reports-page__preset-card"
        >
          <div class="reports-page__preset-info">
            <p class="reports-page__preset-title">{{ preset.title }}</p>
            <p
              v-if="preset.description"
              class="reports-page__preset-description"
            >
              {{ preset.description }}
            </p>
          </div>
          <textarea
            v-model="additionalQueries[preset.id]"
            class="reports-page__preset-query"
            placeholder="Дополнительный запрос (необязательно)..."
            rows="2"
          />
          <button-ui
            :loading="generatingPresetId === preset.id"
            :disabled="generating && generatingPresetId !== preset.id"
            @click="generate(preset)"
          >
            Сгенерировать
          </button-ui>
        </div>
      </div>
    </loading-wrapper>

    <div
      v-if="reportHtml"
      class="reports-page__report"
    >
      <h3 class="reports-page__report-title">
        {{ activePresetTitle }}
      </h3>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        class="reports-page__report-content"
        v-html="reportHtml"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import LoadingWrapper from '~/components/ui/LoadingWrapper.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

import useReports from './_composables/useReports';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const {
  presets,
  presetsLoading,
  additionalQueries,
  generating,
  generatingPresetId,
  reportHtml,
  activePresetTitle,
  fetchPresets,
  generate,
} = useReports(workspaceId);

onBeforeMount(async () => {
  await fetchPresets();
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

  &__empty {
    text-align: center;
    color: colors.$text-light;
    font-size: 14px;
    padding: 40px 0;
  }

  &__presets {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }

  &__preset-card {
    background: colors.$white;
    border: 1px solid colors.$border;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__preset-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__preset-title {
    font-size: 15px;
    font-weight: 600;
    color: colors.$text;
  }

  &__preset-description {
    font-size: 13px;
    color: colors.$text-light;
    line-height: 1.4;
  }

  &__preset-query {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid colors.$border;
    border-radius: 8px;
    font-size: 13px;
    font-family: inherit;
    resize: vertical;
    color: colors.$text;
    background: colors.$white;

    &:focus {
      outline: none;
      border-color: colors.$primary;
    }
  }

  &__report {
    background: colors.$white;
    border: 1px solid colors.$border;
    border-radius: 12px;
    padding: 24px;
  }

  &__report-title {
    font-size: 16px;
    font-weight: 600;
    color: colors.$text;
    margin-bottom: 16px;
  }

  &__report-content {
    font-size: 14px;
    line-height: 1.7;
    color: colors.$text;

    h1,
    h2,
    h3,
    h4 {
      margin-top: 16px;
      margin-bottom: 8px;
      color: colors.$text;
    }

    p {
      margin-bottom: 8px;
    }

    ul,
    ol {
      padding-left: 24px;
      margin-bottom: 8px;
    }

    li {
      margin-bottom: 4px;
    }

    code {
      background: colors.$background;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 13px;
    }

    pre {
      background: colors.$background;
      padding: 12px 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin-bottom: 8px;

      code {
        background: none;
        padding: 0;
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;

      th,
      td {
        border: 1px solid colors.$border;
        padding: 8px 12px;
        text-align: left;
      }

      th {
        background: colors.$background;
        font-weight: 600;
      }
    }
  }
}
</style>
