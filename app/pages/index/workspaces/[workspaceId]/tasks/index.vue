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

    <cards-view
      v-model:current-page="meta.page"
      :data="data"
      :card-link="(item) => `/workspaces/${workspaceId}/tasks/${item.id}`"
      :loading="loading"
      with-pagination
      :total-pages="meta.total_pages"
      empty-html="Нет задач"
      @update:current-page="getTasksData()"
    >
      <template #title="{ item }">
        {{ item.title }}
      </template>
      <template #body="{ item }">
        <div class="tasks-page__card-tags">
          <tag-ui :type="PRIORITY_TAG[item.priority]">
            {{ PRIORITY_LABELS[item.priority] }}
          </tag-ui>
          <tag-ui :type="STATUS_TAG[item.status]">
            {{ STATUS_LABELS[item.status] }}
          </tag-ui>
        </div>
        <p v-if="item.deadline" class="tasks-page__deadline">
          {{ new Date(item.deadline).toLocaleDateString("ru-RU") }}
        </p>
      </template>
      <template #actions="{ item }">
        <table-action-menu
          :edit-link="`/workspaces/${workspaceId}/tasks/${item.id}`"
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
import CardsView from "~/components/list-views/CardsView.vue";
import DeleteConfirmationDialog from "~/components/dialogs/DeleteConfirmationDialog.vue";
import AccountTableHeader from "~/components/pages/account/AccountTableHeader.vue";
import ButtonUi from "~/components/ui/ButtonUi.vue";
import SelectUi from "~/components/ui/form/select/SelectUi.vue";
import TableActionMenu from "~/components/ui/tables/dropdowns/TableActionMenu.vue";
import TagUi from "~/components/ui/TagUi.vue";
import { deleteTask } from "~/domain/task/api/task.api";
import {
  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  PRIORITY_TAG,
  STATUS_LABELS,
  STATUS_OPTIONS,
  STATUS_TAG,
} from "~/domain/task/constants/task.constants";
import type { Task } from "~/domain/task/models/task.types";
import useAccountSeoTitle from "~/shared/composables/useAccountSeoTitle";
import useDeleteTableItem from "~/shared/composables/useDeleteTableItem";
import { WORKSPACE_ID_KEY } from "~/shared/constants/provide-keys";
import { parsePaginationFromUrl } from "~/shared/utils/parsePaginationFromUrl";

import useTasksData from "./_composables/useTasksData";
import useTasksTableFilters from "./_composables/useTasksTableFilters";

const workspaceId = inject(WORKSPACE_ID_KEY)!;

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
  successMessage: "Задача удалена",
  errorMessage: "Ошибка при удалении задачи",
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
const PAGE_TITLE = "Задачи";
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use "/assets/styles/base/colors" as colors;

.tasks-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }

  &__deadline {
    font-size: 12px;
    color: colors.$text-light;
  }
}
</style>
