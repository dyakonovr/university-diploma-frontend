<template>
  <section class="providers">
    <account-table-header
      create-link-to="/account/users/create"
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
      :row-link="(item) => `/account/users/${item.id}`"
      @update:current-page="getTableData()"
    >
      <template #username="item">
        {{ item.username }}
      </template>

      <template #email="item">
        {{ item.email }}
      </template>

      <template #telegram_id="item">
        {{ item.telegram_id || 'Не указан' }}
      </template>

      <template #is_active="item">
        <tag-ui :type="item.is_active ? 'success' : 'error'">
          {{ item.is_active ? 'Активен' : 'Неактивен' }}
        </tag-ui>
      </template>

      <template #created_at="item">
        {{ new Date(item.created_at).toLocaleDateString('ru-RU') }}
      </template>

      <template #actions="item">
        <table-action-menu
          :edit-link="`/account/users/${item.id}`"
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
import TagUi from '~/components/ui/TagUi.vue';
import { deleteUser } from '~/domain/user/api/users/users.admin-api';
import type { User } from '~/domain/user/models/user.types';
import useUsersTableData from '~/pages/users/_composables/useUsersTableData';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

const { TABLE_HEADER_COLUMNS, data, loading, getTableData, meta } =
  useUsersTableData();

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<User>({
  errorMessage: 'Ошибка при удалении пользователя',
  successMessage: 'Пользователь успешно удалён',
  deleteFunc: deleteUser,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.username,
});

onBeforeMount(async () => {
  parsePaginationFromUrl(meta);

  loading.value = true;
  await Promise.all([getTableData()]);
  loading.value = false;
});

// --- SEO ---
const PAGE_TITLE = 'Пользователи';
definePageMeta({ title: PAGE_TITLE, middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>
