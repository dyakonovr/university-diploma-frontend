<template>
  <section class="models">
    <account-table-header
      :with-create-link="false"
      :filters-props="{ filters, loading }"
      @filters-search="onSearchFiltersClick"
      @filters-reset="onResetFiltersClick"
    >
      <template #filters>
        <input-ui
          v-model="filters.name"
          :input-props="{
            placeholder: 'Поиск по системному названию',
            disabled: loading,
          }"
        />

        <select-ui
          v-model="filters.provider_id"
          v-model:search-query="providers.searchValue.value"
          :options="providers.data.value || []"
          :initial-option="providers.initialOption.value"
          :select-props="{
            placeholder: 'Провайдер',
            disabled: loading || providers.loading.value,
          }"
          @update:search-query="providers.debouncedGetData(1, true)"
          @reach-end="providers.getData(providers.meta.value.page + 1)"
        />

        <select-ui
          v-model="filters.is_active"
          :select-props="{
            placeholder: 'Статус активности',
            disabled: loading,
          }"
          :searchable="false"
          :options="IS_ACTIVE_SELECT_OPTIONS"
        />

        <select-ui
          v-model="filters.is_configured"
          :select-props="{
            placeholder: 'Статус сконфигурированности',
            disabled: loading,
          }"
          :searchable="false"
          :options="IS_CONFIGURATED_SELECT_OPTIONS"
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
      :row-link="(item) => `/account/models/${item.id}`"
      @update:current-page="() => getTableData()"
    >
      <template #display_name="item">
        {{ item.display_name || 'Не указано' }}
      </template>

      <template #is_configured="item">
        <tag-ui :type="item.is_configured ? 'success' : 'error'">
          {{ item.is_configured ? 'Да' : 'Нет' }}
        </tag-ui>
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
          :can-delete="false"
          :edit-link="`/account/models/${item.id}`"
        />
      </template>
    </table-view>
  </section>
</template>

<script setup lang="ts">
import TableView from '~/components/list-views/TableView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import TagUi from '~/components/ui/TagUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useModelsTableData from './_composables/useModelsTableData';
import useModelsTableFilters from './_composables/useModelsTableFilters';

const {
  filters,
  IS_ACTIVE_SELECT_OPTIONS,
  IS_CONFIGURATED_SELECT_OPTIONS,
  providers,
  parseFiltersFromUrl,
  resetFilters,
} = useModelsTableFilters();

const { TABLE_HEADER_COLUMNS, data, meta, loading, getTableData } =
  useModelsTableData({
    requestParams: () => ({
      name: filters.value.name || null,
      provider_id: filters.value.provider_id,
      is_active:
        filters.value.is_active === null
          ? null
          : String(filters.value.is_active),
      is_configured:
        filters.value.is_configured !== null
          ? String(filters.value.is_configured)
          : null,
    }),
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
  await Promise.all([getTableData(), providers.getData(1)]);
  loading.value = false;
});

// --- SEO ---
const PAGE_TITLE = 'Модели';
definePageMeta({ title: PAGE_TITLE, middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>
