<template>
  <section>
    <account-table-header
      create-link-to="/account/news-subcategories/create"
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
        <select-ui
          v-model="filters.category_id"
          :options="categories.data.value || []"
          :initial-option="categories.initialOption.value"
          :select-props="{
            placeholder: 'Категория',
            disabled: loading || categories.loading.value,
          }"
          @update:search-query="categories.debouncedGetData(1, true)"
          @reach-end="categories.getData(categories.meta.value.page + 1)"
        >
          <template #option="{ option }">
            {{ option.label }}
            <tag-ui :type="option.is_visible ? 'success' : 'error'">
              {{ option.is_visible ? 'Видна' : 'Скрыта' }}
            </tag-ui>
          </template>
          <template #selected="{ value }">
            {{ findCategoryOption(value)?.label }}
            <tag-ui
              v-if="findCategoryOption(value)"
              :type="
                findCategoryOption(value)?.is_visible ? 'success' : 'error'
              "
              class="ml"
            >
              {{ findCategoryOption(value)?.is_visible ? 'Видна' : 'Скрыта' }}
            </tag-ui>
          </template>
        </select-ui>
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
      :row-link="(item) => `/account/news-subcategories/${item.id}`"
      @update:current-page="() => getTableData()"
    >
      <template #category="item">
        {{ item.category?.name ?? 'Неизвестно' }}
      </template>

      <template #is_visible="item">
        <tag-ui :type="isSubcategoryVisible(item) ? 'success' : 'error'">{{
          isSubcategoryVisible(item) ? 'Да' : 'Нет'
        }}</tag-ui>
      </template>

      <template #actions="item">
        <table-action-menu
          :edit-link="`/account/news-subcategories/${item.id}`"
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
import { deleteNewsSubcategory } from '~/domain/news-subcategory/api/news-subcategories.api';
import type { NewsSubcategory } from '~/domain/news-subcategory/models/news-subcategory.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import type { SelectOption } from '~/shared/types/ui/select.types';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useNewsSubcategoriesTableData from './_composables/useNewsSubcategoriesTableData';
import useNewsSubcategoriesTableFilters from './_composables/useNewsSubcategoriesTableFilters';

const {
  filters,
  IS_VISIBLE_SELECT_OPTIONS,
  categories,
  parseFiltersFromUrl,
  resetFilters,
} = useNewsSubcategoriesTableFilters();

const { TABLE_HEADER_COLUMNS, data, loading, meta, getTableData } =
  useNewsSubcategoriesTableData({
    requestParams: () => ({
      name: filters.value.search || null,
      category_id: filters.value.category_id || null,
      is_visible: filters.value.is_visible || null,
    }),
  });

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<NewsSubcategory>({
  errorMessage: 'Ошибка при удалении подкатегории новостей',
  successMessage: 'Подкатегория новостей успешно удалена',
  deleteFunc: deleteNewsSubcategory,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.name,
});

function findCategoryOption(value: unknown): SelectOption | null {
  const opt = (categories.data.value || []).find((o) => o.value === value);
  if (opt) return opt;
  const initial = categories.initialOption.value;
  return initial?.value === value ? initial : null;
}

function isSubcategoryVisible(item: NewsSubcategory) {
  return item.is_visible && item.category.is_visible;
}

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
  await Promise.all([getTableData(), categories.getData(1)]);
  loading.value = false;
});

// --- SEO ---
const PAGE_TITLE = 'Подкатегории новостей';
definePageMeta({ title: PAGE_TITLE, middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>
