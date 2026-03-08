<template>
  <section class="roles">
    <account-table-header
      create-link-to="/account/roles/create"
      :with-filters="false"
    />

    <table-view
      v-model:current-page="meta.page"
      with-pagination
      :header-columns="TABLE_HEADER_COLUMNS"
      :table-data="data || []"
      :total-count-value="meta.total"
      :total-pages="meta.total_pages"
      :loading="loading"
      :row-link="(item) => `/account/roles/${item.id}`"
      @update:current-page="getTableData()"
    >
      <template #name="item">
        {{ item.name }}
      </template>

      <template #id="item">
        {{ item.id }}
      </template>

      <template #actions="item">
        <table-action-menu
          :edit-link="`/account/roles/${item.id}`"
          @delete-click="handleDelete(item)"
        />
      </template>
    </table-view>
  </section>

  <delete-confirmation-dialog
    v-bind="deleteItemDialogContent"
    v-model="deleteDialogVisible"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import TableView from '~/components/list-views/TableView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import { deleteRole } from '~/domain/role/api/roles.api';
import type { Role } from '~/domain/role/models/role.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useRolesTableData from './_composables/useRolesTableData';

const { TABLE_HEADER_COLUMNS, data, loading, getTableData, meta } =
  useRolesTableData();

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<Role>({
  errorMessage: 'Ошибка при удалении роли',
  successMessage: 'Роль успешно удалена',
  deleteFunc: deleteRole,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.name,
});

onBeforeMount(async () => {
  parsePaginationFromUrl(meta);

  loading.value = true;
  await Promise.all([getTableData()]);
  loading.value = false;
});

// --- SEO ---
const PAGE_TITLE = 'Роли';
definePageMeta({ title: PAGE_TITLE, middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>
