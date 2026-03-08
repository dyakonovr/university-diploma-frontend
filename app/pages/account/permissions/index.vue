<template>
  <section class="permissions">
    <account-table-header
      create-link-to="/account/permissions/create"
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
      :row-link="(item) => `/account/permissions/${item.id}`"
      @update:current-page="getTableData()"
    >
      <template #code="item">
        {{ item.code }}
      </template>

      <template #id="item">
        {{ item.id }}
      </template>

      <template #actions="item">
        <table-action-menu
          :edit-link="`/account/permissions/${item.id}`"
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
import { deletePermission } from '~/domain/permission/api/permissions.api';
import type { Permission } from '~/domain/permission/models/permission.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import usePermissionsTableData from './_composables/usePermissionsTableData';

const { TABLE_HEADER_COLUMNS, data, loading, getTableData, meta } =
  usePermissionsTableData();

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<Permission>({
  errorMessage: 'Ошибка при удалении доступа',
  successMessage: 'Доступ успешно удалён',
  deleteFunc: deletePermission,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.code,
});

onBeforeMount(async () => {
  parsePaginationFromUrl(meta);

  loading.value = true;
  await Promise.all([getTableData()]);
  loading.value = false;
});

// --- SEO ---
const PAGE_TITLE = 'Доступы';
definePageMeta({ title: PAGE_TITLE, middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>
