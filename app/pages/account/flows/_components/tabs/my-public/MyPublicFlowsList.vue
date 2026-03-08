<template>
  <section>
    <table-filters
      v-if="isFiltersOpened"
      :filters="filters"
      :loading="loading"
      @search="onSearchFiltersClick"
      @reset="onResetFiltersClick"
    >
      <input-ui
        v-model="filters.name"
        :input-props="{ placeholder: 'Название', disabled: loading }"
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
      />
      <select-ui
        v-model="filters.status"
        :options="STATUS_SELECT_OPTIONS"
        :select-props="{
          placeholder: 'Статус',
          disabled: loading,
        }"
        :searchable="false"
      />
      <select-ui
        v-model="filters.social_network"
        :options="socialNetworks.data.value || []"
        :select-props="{
          placeholder: 'Соц. сети',
          disabled: loading || socialNetworks.loading.value,
        }"
        :searchable="false"
      >
        <template #selected="{ value }">
          <social-badge :provider="value as SocialAccountProviderName" />
        </template>
        <template #option="{ option }">
          <social-badge :provider="option.value as SocialAccountProviderName" />
        </template>
      </select-ui>
      <select-ui
        v-model="filters.models"
        is-multiple
        :options="models.data.value || []"
        :select-props="{
          placeholder: 'Модели',
          disabled: loading || models.loading.value,
        }"
        @update:search-query="models.debouncedGetData(1, true)"
        @reach-end="models.getData(models.meta.value.page + 1)"
      />
    </table-filters>

    <public-flow-list
      v-model:current-page="meta.page"
      :data="data || []"
      :total-pages="meta.total_pages"
      :loading="loading"
      show-status
      show-actions
      show-copy
      :empty-html="MY_PUBLIC_FLOWS_EMPTY_DESCRIPTION"
      @delete="handleDelete"
      @copy="onCopy"
    />

    <delete-confirmation-dialog
      v-model="deleteDialogVisible"
      v-bind="deleteItemDialogContent"
      @confirm="confirmDelete"
    />
  </section>
</template>

<script setup lang="ts">
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import SocialBadge from '~/components/SocialBadge.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableFilters from '~/components/ui/tables/TableFilters.vue';
import { deletePublicFlow } from '~/domain/flow/api/public-flows.api';
import type { PublicFlow } from '~/domain/flow/model/public-flow.types';
import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { MY_PUBLIC_FLOWS_EMPTY_DESCRIPTION } from '~/shared/constants/empty-descriptions.const';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useMyPublicFlowsData from '../../../_composables/my-public-flows/useMyPublicFlowsData';
import useMyPublicFlowsFilters from '../../../_composables/my-public-flows/useMyPublicFlowsFilters';
import useCopyPublicFlow from '../../../_composables/useCopyPublicFlow';
import PublicFlowList from '../PublicFlowList.vue';

defineProps<{
  isFiltersOpened?: boolean;
}>();

const {
  filters,
  STATUS_SELECT_OPTIONS,
  categories,
  models,
  socialNetworks,
  parseFiltersFromUrl,
  resetFilters,
} = useMyPublicFlowsFilters();

const { data, loading, meta, getTableData } = useMyPublicFlowsData({
  requestParams: () => ({
    name: filters.value.name || null,
    category_id: filters.value.category_id,
    status: filters.value.status,
    social_network: filters.value.social_network || [],
  }),
});

const { onCopy } = useCopyPublicFlow({ data });

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<PublicFlow>({
  errorMessage: 'Ошибка при удалении публичного шаблона',
  successMessage: 'Публичный шаблон успешно удалён',
  deleteFunc: deletePublicFlow,
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
  await Promise.all([
    getTableData(),
    categories.getData(1),
    socialNetworks.getData(1),
    models.getData(1),
  ]);
  loading.value = false;
});
</script>
