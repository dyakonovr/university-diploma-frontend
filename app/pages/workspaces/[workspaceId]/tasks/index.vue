<template>
  <section class="tasks-page">
    <account-table-header
      v-model:filters-opened="filtersOpened"
      :with-filters="true"
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
        <button-ui @click="openCreate">
          Создать задачу
        </button-ui>
      </template>
    </account-table-header>

    <table-view
      v-model:current-page="meta.page"
      with-pagination
      :header-columns="TABLE_HEADER_COLUMNS"
      :table-data="data || []"
      :total-count-value="meta.total"
      :total-pages="meta.total_pages"
      :loading="loading"
      @update:current-page="getTableData()"
    >
      <template #title="item">
        <span class="tasks-page__title-cell">{{ item.title }}</span>
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

      <template #deadline="item">
        {{ item.deadline ? new Date(item.deadline).toLocaleDateString('ru-RU') : '—' }}
      </template>

      <template #actions="item">
        <table-action-menu
          @edit-click="openEdit(item)"
          @delete-click="handleDelete(item)"
        />
      </template>
    </table-view>

    <!-- Create / Edit dialog -->
    <dialog-ui
      v-model="dialogVisible"
      :title="editingTask ? 'Редактировать задачу' : 'Создать задачу'"
      :confirm-button-text="editingTask ? 'Сохранить' : 'Создать'"
      :confirm-button-props="{ loading: formLoading }"
      dialog-class="dialog--wide"
      @confirm="onSubmit">
      <div class="tasks-page__form">
        <input-ui
          v-model="formData.title"
          label="Название *"
          :input-props="{ placeholder: 'Название задачи', disabled: formLoading }"
          :error="formErrors.title"
        />
        <input-ui
          v-model="formData.description"
          label="Описание"
          :input-props="{ placeholder: 'Описание задачи', disabled: formLoading }"
        />
        <select-ui
          v-model="formData.priority"
          label="Приоритет"
          :options="PRIORITY_OPTIONS"
          :searchable="false"
        />
        <select-ui
          v-model="formData.status"
          label="Статус"
          :options="STATUS_OPTIONS"
          :searchable="false"
        />
        <input-ui
          v-model="formData.deadline"
          label="Дедлайн"
          :input-props="{ type: 'date', disabled: formLoading }"
        />
      </div>
    </dialog-ui>

    <!-- Delete confirmation -->
    <delete-confirmation-dialog
      v-bind="deleteItemDialogContent"
      v-model="deleteDialogVisible"
      @confirm="confirmDelete"
    />
  </section>
</template>

<script setup lang="ts">
import TableView from '~/components/list-views/TableView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TagUi from '~/components/ui/TagUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import { deleteTask } from '~/domain/task/api/task.api';
import type { Task, TaskPriority, TaskStatus } from '~/domain/task/models/task.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useTaskForm from './_composables/useTaskForm';
import useTasksTableData from './_composables/useTasksTableData';
import useTasksTableFilters from './_composables/useTasksTableFilters';

const route = useRoute();
const workspaceId = route.params.workspaceId as string;

const { filters, STATUS_OPTIONS, PRIORITY_OPTIONS, resetFilters } = useTasksTableFilters();

const { TABLE_HEADER_COLUMNS, data, loading, meta, getTableData } = useTasksTableData(workspaceId, {
  requestParams: () => ({
    status: filters.value.status,
    priority: filters.value.priority,
  }),
});

const {
  dialogVisible,
  loading: formLoading,
  editingTask,
  formData,
  formErrors,
  openCreate,
  openEdit,
  onSubmit,
} = useTaskForm(workspaceId, () => getTableData());

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
  getTableData: () => getTableData(),
});

const filtersOpened = ref(false);

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Бэклог',
  in_progress: 'В работе',
  review: 'На проверке',
  done: 'Выполнено',
  cancelled: 'Отменено',
};

const PRIORITY_TAG: Record<TaskPriority, string> = {
  low: 'info',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

const STATUS_TAG: Record<TaskStatus, string> = {
  backlog: 'info',
  in_progress: 'warning',
  review: 'warning',
  done: 'success',
  cancelled: 'error',
};

const onSearch = () => {
  meta.value.page = 1;
  getTableData();
};

const onReset = () => {
  resetFilters();
  onSearch();
};

onBeforeMount(async () => {
  parsePaginationFromUrl(meta);
  await getTableData();
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

  &__title-cell {
    font-weight: 500;
  }

  &__form {
    display: flex;
    flex-direction: column;
  }
}
</style>
