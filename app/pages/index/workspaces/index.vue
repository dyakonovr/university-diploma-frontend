<template>
  <section class="workspaces-page">
    <account-table-header
      :with-filters="false"
      create-link-to="/workspaces/create"
      create-link-text="Создать воркспейс"
    />

    <cards-view
      :data="data"
      :card-link="(item) => `/workspaces/${item.id}`"
      :loading="loading"
      :with-pagination="false"
      empty-html="У вас ещё нет воркспейсов"
    >
      <template #title="{ item }">
        {{ item.name }}
      </template>
      <template #body="{ item }">
        <p>
          Создан: {{ new Date(item.created_at).toLocaleDateString("ru-RU") }}
        </p>
      </template>
      <template #actions="{ item }">
        <table-action-menu
          :edit-link="`/workspaces/${item.id}`"
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
import TableActionMenu from "~/components/ui/tables/dropdowns/TableActionMenu.vue";
import { deleteWorkspace } from "~/domain/workspace/api/workspace.api";
import type { Workspace } from "~/domain/workspace/models/workspace.types";
import useAccountSeoTitle from "~/shared/composables/useAccountSeoTitle";
import useDeleteTableItem from "~/shared/composables/useDeleteTableItem";

import useWorkspacesData from "./_composables/useWorkspacesData";

const { data, loading, getData } = useWorkspacesData();

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  handleDelete,
  confirmDelete,
} = useDeleteTableItem<Workspace>({
  deleteFunc: (id) => deleteWorkspace(id),
  mapFunc: (el) => el.name,
  successMessage: "Воркспейс удалён",
  errorMessage: "Ошибка при удалении воркспейса",
  getTableData: () => getData(),
});

onBeforeMount(async () => {
  await getData();
});

// --- SEO ---
const PAGE_TITLE = "Воркспейсы";
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>
