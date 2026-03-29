<template>
  <section class="admin-workspaces-page">
    <account-table-header :with-filters="false" :with-create-link="false" />

    <table-view
      v-model:current-page="meta.page"
      with-pagination
      :header-columns="TABLE_COLUMNS"
      :table-data="data"
      :total-pages="meta.total_pages"
      :loading="loading"
      @update:current-page="getData()"
    >
      <template #name="item">
        {{ item.name }}
      </template>

      <template #owner="item">
        <div>
          <span>{{ item.owner_name }}</span>
          <br />
          <span class="text-12 text-light">{{ item.owner_email }}</span>
        </div>
      </template>

      <template #member_count="item">
        {{ item.member_count }}
      </template>

      <template #created_at="item">
        {{ new Date(item.created_at).toLocaleDateString("ru-RU") }}
      </template>

      <template #actions="item">
        <table-action-menu
          :can-edit="false"
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
import DeleteConfirmationDialog from "~/components/dialogs/DeleteConfirmationDialog.vue";
import TableView from "~/components/list-views/TableView.vue";
import AccountTableHeader from "~/components/pages/account/AccountTableHeader.vue";
import TableActionMenu from "~/components/ui/tables/dropdowns/TableActionMenu.vue";
import { deleteAdminWorkspace } from "~/domain/admin/api/admin-workspaces.api";
import type { AdminWorkspace } from "~/domain/admin/models/admin.types";
import useAccountSeoTitle from "~/shared/composables/useAccountSeoTitle";
import useDeleteTableItem from "~/shared/composables/useDeleteTableItem";

import useAdminWorkspacesData from "./_composables/useAdminWorkspacesData";

const { TABLE_COLUMNS, data, loading, meta, getData } =
  useAdminWorkspacesData();

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  handleDelete,
  confirmDelete,
} = useDeleteTableItem<AdminWorkspace>({
  deleteFunc: deleteAdminWorkspace,
  mapFunc: (el) => el.name,
  successMessage: "Воркспейс удалён",
  errorMessage: "Ошибка при удалении воркспейса",
  getTableData: () => getData(),
});

onBeforeMount(async () => {
  await getData();
});

// --- SEO ---
const PAGE_TITLE = "Воркспейсы (админ)";
definePageMeta({ title: PAGE_TITLE, middleware: "admin" });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use "/assets/styles/base/colors" as colors;

.admin-workspaces-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.text-light {
  color: colors.$text-light;
}
</style>
