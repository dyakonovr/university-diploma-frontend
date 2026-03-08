<template>
  <section>
    <account-table-header
      create-link-to="/account/flow-categories/create"
      :filters-props="{
        filters,
        loading,
      }"
      @filters-search="onSearchFilterClick"
      @filters-reset="onResetFiltersClick"
    >
      <template #filters>
        <input-ui
          v-model="filters.name"
          :input-props="{ placeholder: 'Название', disabled: loading }"
        />
        <select-ui
          v-model="filters.is_public"
          :options="IS_PUBLIC_SELECT_OPTIONS"
          :searchable="false"
          :select-props="{
            placeholder: 'Публичная категория?',
            disabled: loading,
          }"
        />
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
      :row-link="(item) => `/account/flow-categories/${item.id}`"
      @update:current-page="() => getTableData()"
    >
      <template #actions="item">
        <table-action-menu
          :edit-link="`/account/flow-categories/${item.id}`"
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
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import { deletePublicFlowCategory } from '~/domain/flow-category/api/flow-categories.api';
import type { PublicFlowCategory } from '~/domain/flow-category/models/flow-category.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useFlowCategoriesTableData from './_composables/useFlowCategoriesTableData';
import useFlowCategoriesTableFilters from './_composables/useFlowCategoriesTableFilters';

const { IS_PUBLIC_SELECT_OPTIONS, filters, parseFiltersFromUrl, resetFilters } =
  useFlowCategoriesTableFilters();

const { TABLE_HEADER_COLUMNS, data, loading, meta, getTableData } =
  useFlowCategoriesTableData({
    requestParams: () => ({
      name: filters.value.name || null,
      is_public:
        filters.value.is_public === null
          ? null
          : String(filters.value.is_public),
    }),
  });

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<PublicFlowCategory>({
  errorMessage: 'Ошибка при удалении категории шаблонов',
  successMessage: 'Категория шаблона успешно удалена',
  deleteFunc: deletePublicFlowCategory,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.name,
});

const onSearchFilterClick = () => {
  meta.value.page = 1;
  getTableData();
};

const onResetFiltersClick = () => {
  resetFilters();
  onSearchFilterClick();
};

onBeforeMount(async () => {
  parseFiltersFromUrl();
  parsePaginationFromUrl(meta);

  loading.value = true;
  await Promise.all([getTableData()]);
  loading.value = false;
});

// --- SEO ---
const PAGE_TITLE = 'Категории публичных шаблонов';
definePageMeta({ title: 'Категории публичных шаблонов', middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>
