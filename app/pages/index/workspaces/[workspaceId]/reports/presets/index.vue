<template>
  <section class="presets-page">
    <account-table-header
      :with-filters="false"
      :with-create-link="false"
    >
      <template #buttons>
        <button-ui
          variant="outlined"
          :to="`/workspaces/${workspaceId}/reports`"
        >
          Генерация отчётов
        </button-ui>
        <button-ui :to="`/workspaces/${workspaceId}/reports/presets/create`">
          Создать пресет
        </button-ui>
      </template>
    </account-table-header>

    <cards-view
      :data="data"
      :card-link="(item) => `/workspaces/${workspaceId}/reports/presets/${item.id}`"
      :loading="loading"
      :with-pagination="false"
      empty-html="Нет пресетов"
    >
      <template #title="{ item }">
        {{ item.title }}
      </template>
      <template #body="{ item }">
        <p class="presets-page__card-description">
          {{ item.description || 'Без описания' }}
        </p>
      </template>
      <template #actions="{ item }">
        <table-action-menu
          :edit-link="`/workspaces/${workspaceId}/reports/presets/${item.id}`"
          @delete-click="handleDelete(item)"
        />
      </template>
    </cards-view>

    <delete-confirmation-dialog
      v-bind="deleteItemDialogContent"
      v-model="deleteDialogVisible"
      @confirm="confirmDelete"
    />
  </section>
</template>

<script setup lang="ts">
import CardsView from '~/components/list-views/CardsView.vue';
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import { deleteReportPreset } from '~/domain/report/api/report-preset.api';
import type { ReportPreset } from '~/domain/report/models/report.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

import usePresetsData from './_composables/usePresetsData';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const { data, loading, getData } = usePresetsData(workspaceId);

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  handleDelete,
  confirmDelete,
} = useDeleteTableItem<ReportPreset>({
  deleteFunc: (id) => deleteReportPreset(id, workspaceId),
  mapFunc: (el) => el.title,
  successMessage: 'Пресет удалён',
  errorMessage: 'Ошибка при удалении пресета',
  getTableData: () => getData(),
});

onBeforeMount(async () => {
  await getData();
});

// --- SEO ---
const PAGE_TITLE = 'Пресеты отчётов';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.presets-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__card-description {
    font-size: 13px;
    color: colors.$text-light;
    line-height: 1.4;
  }
}
</style>
