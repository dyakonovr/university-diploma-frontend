<template>
  <section class="integrations-page">
    <account-table-header :with-filters="false" :with-create-link="false">
      <template #buttons>
        <button-ui :to="`/workspaces/${workspaceId}/integrations/create`">
          Добавить интеграцию
        </button-ui>
      </template>
    </account-table-header>

    <table-view
      :header-columns="TABLE_COLUMNS"
      :table-data="data"
      :loading="loading"
      :with-pagination="false"
      :row-link="(item) => `/workspaces/${workspaceId}/integrations/${item.id}`"
    >
      <template #name="item">
        {{ item.name }}
      </template>
      <template #type="item">
        <tag-ui type="info">
          {{ TYPE_LABELS[item.type] || item.type }}
        </tag-ui>
      </template>
      <template #is_active="item">
        <tag-ui :type="item.is_active ? 'success' : 'error'">
          {{ item.is_active ? 'Активна' : 'Неактивна' }}
        </tag-ui>
      </template>
      <template #last_synced_at="item">
        <span v-if="item.last_synced_at">
          {{ new Date(item.last_synced_at).toLocaleString('ru-RU') }}
        </span>
        <span
          v-else
          style="color: var(--text-light, #999)"
        >—</span>
      </template>
      <template #actions="item">
        <table-action-menu
          :edit-link="`/workspaces/${workspaceId}/integrations/${item.id}`"
          @delete-click="handleDelete(item)"
        />
      </template>
    </table-view>

    <delete-confirmation-dialog
      v-bind="deleteItemDialogContent"
      v-model="deleteDialogVisible"
      @confirm="confirmDelete"
    />
  </section>
</template>

<script setup lang="ts">
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import TableView from '~/components/list-views/TableView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import TagUi from '~/components/ui/TagUi.vue';
import { deleteIntegration } from '~/domain/integration/api/integration.api';
import { TYPE_LABELS } from '~/domain/integration/constants/integration.constants';
import type { Integration } from '~/domain/integration/models/integration.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';

import useIntegrationsData from './_composables/useIntegrationsData';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const TABLE_COLUMNS: TableViewHeaderColumn[] = [
  { prop: 'name', label: 'Название', minWidth: 180 },
  { prop: 'type', label: 'Тип', width: 160 },
  { prop: 'is_active', label: 'Статус', width: 140 },
  { prop: 'last_synced_at', label: 'Последняя синхр.', width: 180 },
  { prop: 'actions', label: 'Действия', fixed: 'right', width: 120 },
];

const { data, loading, getData } = useIntegrationsData(workspaceId);

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  handleDelete,
  confirmDelete,
} = useDeleteTableItem<Integration>({
  deleteFunc: (id) => deleteIntegration(id, workspaceId),
  mapFunc: (el) => el.name,
  successMessage: 'Интеграция удалена',
  errorMessage: 'Ошибка при удалении интеграции',
  getTableData: () => getData(),
});

onBeforeMount(async () => {
  await getData();
});

// --- SEO ---
const PAGE_TITLE = 'Интеграции';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.integrations-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
