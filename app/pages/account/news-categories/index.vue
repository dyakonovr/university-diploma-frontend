<template>
  <section>
    <account-table-header
      create-link-to="/account/news-categories/create"
      :filters-props="{
        filters,
        loading,
      }"
      @filters-search="onSearchFiltersClick"
      @filters-reset="onResetFiltersClick"
    >
      <template #filters>
        <input-ui
          v-model="filters.search"
          :input-props="{ placeholder: 'Название', disabled: loading }"
        />
        <select-ui
          v-model="filters.is_visible"
          :options="IS_VISIBLE_SELECT_OPTIONS"
          :searchable="false"
          :select-props="{ placeholder: 'Видна на сайте?', disabled: loading }"
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
      :row-link="(item) => `/account/news-categories/${item.id}`"
      @update:current-page="() => getTableData()"
    >
      <template #is_visible="item">
        <tag-ui :type="item.is_visible ? 'success' : 'error'">{{
          item.is_visible ? 'Да' : 'Нет'
        }}</tag-ui>
      </template>

      <template #actions="item">
        <table-action-menu
          :edit-link="`/account/news-categories/${item.id}`"
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
import TagUi from '~/components/ui/TagUi.vue';
import { deleteNewsCategory } from '~/domain/news-category/api/news-categories.api';
import type { NewsCategory } from '~/domain/news-category/models/news-category.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useNewsCategoriesTableData from './_composables/useNewsCategoriesTableData';
import useNewsCategoriesTableFilters from './_composables/useNewsCategoriesTableFilters';

const {
  filters,
  IS_VISIBLE_SELECT_OPTIONS,
  parseFiltersFromUrl,
  resetFilters,
} = useNewsCategoriesTableFilters();

const { TABLE_HEADER_COLUMNS, data, loading, meta, getTableData } =
  useNewsCategoriesTableData({
    requestParams: () => ({
      name: filters.value.search || null,
      is_visible: filters.value.is_visible || null,
    }),
  });

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<NewsCategory>({
  errorMessage: 'Ошибка при удалении категории новостей',
  successMessage: 'Категория новостей успешно удалена',
  deleteFunc: deleteNewsCategory,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.name,
});

const onSearchFiltersClick = () => {
  meta.value.page = 1;
  getTableData();
};

const onResetFiltersClick = () => {
  resetFilters();
  onSearchFiltersClick();
};

onBeforeMount(async () => {
  parseFiltersFromUrl();
  parsePaginationFromUrl(meta);

  loading.value = true;
  await Promise.all([getTableData()]);
  loading.value = false;
});

// --- SEO ---
const PAGE_TITLE = 'Категории новостей';
definePageMeta({ title: PAGE_TITLE, middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>
