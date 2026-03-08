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
    </table-filters>

    <public-flow-list
      v-model:current-page="meta.page"
      :data="data || []"
      :total-pages="meta.total_pages"
      :loading="loading"
      :card-link="(item) => `/account/flows/moderation/${item.id}`"
    />
  </section>
</template>

<script setup lang="ts">
import InputUi from '~/components/ui/form/InputUi.vue';
import TableFilters from '~/components/ui/tables/TableFilters.vue';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useRequestsForPublishData from '../../../_composables/requests-for-publish/useRequestsForPublishData';
import useRequestsForPublishFilters from '../../../_composables/requests-for-publish/useRequestsForPublishFilters';
import PublicFlowList from '../PublicFlowList.vue';

defineProps<{
  isFiltersOpened?: boolean;
}>();

const { filters, parseFiltersFromUrl, resetFilters } =
  useRequestsForPublishFilters();

const { data, loading, meta, getTableData } = useRequestsForPublishData({
  requestParams: () => ({
    name: filters.value.name || null,
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
  await getTableData();
  loading.value = false;
});
</script>
