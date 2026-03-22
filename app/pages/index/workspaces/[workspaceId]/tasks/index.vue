<template>
  <section class="tasks-page">
    <account-table-header
      :with-create-link="false"
      :filters-props="{ filters, loading }"
      @filters-search="onSearch"
      @filters-reset="onReset"
    >
      <template #filters>
        <select-ui
          v-model="filters.status"
          :options="STATUS_OPTIONS"
          :select-props="{ placeholder: 'Статус', disabled: loading }"
          :searchable="false"
        />
        <select-ui
          v-model="filters.priority"
          :options="PRIORITY_OPTIONS"
          :select-props="{ placeholder: 'Приоритет', disabled: loading }"
          :searchable="false"
        />
      </template>
      <template #buttons>
        <button-ui :to="`/workspaces/${workspaceId}/tasks/create`">
          Создать задачу
        </button-ui>
      </template>
    </account-table-header>

    <table-view
      v-model:current-page="meta.page"
      with-pagination
      :header-columns="TABLE_COLUMNS"
      :table-data="data"
      :total-pages="meta.total_pages"
      :loading="loading"
      :row-link="(item) => `/workspaces/${workspaceId}/tasks/${item.id}`"
      @update:current-page="getTasksData()"
    >
      <template #title="item">
        {{ item.title }}
      </template>
      <template #priority="item">
        <tag-ui :type="PRIORITY_TAG[item.priority]">
          {{ PRIORITY_LABELS[item.priority] }}
        </tag-ui>
      </template>
      <template #status="item">
        <tag-ui :type="STATUS_TAG[item.status]">
          {{ STATUS_LABELS[item.status] }}
        </tag-ui>
      </template>
      <template #external_source="item">
        <tag-ui
          v-if="item.external_source"
          type="info"
        >
          {{ item.external_source }}
        </tag-ui>
        <span
          v-else
          class="tasks-page__no-deadline"
        >—</span>
      </template>
      <template #deadline="item">
        <span v-if="item.deadline">
          {{ new Date(item.deadline).toLocaleDateString('ru-RU') }}
        </span>
        <span
          v-else
          class="tasks-page__no-deadline"
        >—</span>
      </template>
      <template #actions="item">
        <table-action-menu
          :edit-link="`/workspaces/${workspaceId}/tasks/${item.id}`"
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
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import TagUi from '~/components/ui/TagUi.vue';
import { deleteTask } from '~/domain/task/api/task.api';
import {
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  PRIORITY_TAG,
  STATUS_LABELS,
  STATUS_OPTIONS,
  STATUS_TAG,
} from '~/domain/task/constants/task.constants';
import type { Task } from '~/domain/task/models/task.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useTasksData from './_composables/useTasksData';
import useTasksTableFilters from './_composables/useTasksTableFilters';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const TABLE_COLUMNS: TableViewHeaderColumn[] = [
  { prop: 'title', label: 'Название', minWidth: 200 },
  { prop: 'priority', label: 'Приоритет', width: 140 },
  { prop: 'status', label: 'Статус', width: 150 },
  { prop: 'external_source', label: 'Источник', width: 140 },
  { prop: 'deadline', label: 'Дедлайн', width: 140 },
  { prop: 'actions', label: 'Действия', fixed: 'right', width: 120 },
];

const { filters, resetFilters } = useTasksTableFilters();

const { data, loading, meta, getTasksData } = useTasksData(workspaceId, {
  requestParams: () => ({
    status: filters.value.status,
    priority: filters.value.priority,
  }),
});

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  handleDelete,
  confirmDelete,
} = useDeleteTableItem<Task>({
  deleteFunc: (id) => deleteTask(id, workspaceId),
  mapFunc: (el) => el.title,
  successMessage: 'Задача удалена',
  errorMessage: 'Ошибка при удалении задачи',
  getTableData: () => getTasksData(),
});

const onSearch = () => {
  meta.value.page = 1;
  getTasksData();
};

const onReset = () => {
  resetFilters();
  onSearch();
};

onBeforeMount(async () => {
  parsePaginationFromUrl(meta);
  await getTasksData();
});

// --- SEO ---
const PAGE_TITLE = 'Задачи';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.tasks-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__no-deadline {
    color: colors.$text-light;
  }
}
</style>
