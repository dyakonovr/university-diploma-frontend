<template>
  <section>
    <account-table-header
      create-link-to="/account/news-hashtags/create"
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
      :row-link="(item) => `/account/news-hashtags/${item.id}`"
      @update:current-page="() => getTableData()"
    >
      <template #actions="item">
        <table-action-menu
          :edit-link="`/account/news-hashtags/${item.id}`"
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
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import { deleteNewsHashtag } from '~/domain/news-hashtag/api/news-hashtag.api';
import type { NewsHashtag } from '~/domain/news-hashtag/models/news-hashtag.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useNewsHashtagsTableData from './_composables/useNewsHashtagsTableData';
import useNewsHashtagsTableFilters from './_composables/useNewsHashtagsTableFilters';

const { filters, parseFiltersFromUrl, resetFilters } =
  useNewsHashtagsTableFilters();

const { TABLE_HEADER_COLUMNS, data, loading, meta, getTableData } =
  useNewsHashtagsTableData({
    requestParams: () => ({
      name: filters.value.search || null,
    }),
  });

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<NewsHashtag>({
  errorMessage: 'Ошибка при удалении хэштега новостей',
  successMessage: 'Хэштег успешно удалён',
  deleteFunc: deleteNewsHashtag,
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
const PAGE_TITLE = 'Хэштеги новостей';
definePageMeta({ title: PAGE_TITLE, middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>
