<template>
  <section>
    <table-filters
      v-if="isFiltersOpened"
      :filters="filters"
      :loading="loading"
      @search="onSearchFilterClick"
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
        v-model="filters.user_id"
        :options="users.data.value || []"
        :initial-option="users.initialOption.value"
        :select-props="{
          placeholder: 'Пользователь',
          disabled: loading || users.loading.value,
        }"
        @update:search-query="users.debouncedGetData(1, true)"
        @reach-end="users.getData(users.meta.value.page + 1)"
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
      show-like
      show-copy
      :empty-html="MARKETPLACE_FLOWS_EMPTY_DESCRIPTION"
      @toggle-like="onToggleLike"
      @copy="onCopy"
    />
  </section>
</template>

<script setup lang="ts">
import SocialBadge from '~/components/SocialBadge.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableFilters from '~/components/ui/tables/TableFilters.vue';
import { toggleLikePublicFlow } from '~/domain/flow/api/public-flows.api';
import type { PublicFlow } from '~/domain/flow/model/public-flow.types';
import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { MARKETPLACE_FLOWS_EMPTY_DESCRIPTION } from '~/shared/constants/empty-descriptions.const';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useMarketplaceFlowsData from '../../../_composables/marketplace-flows/useMarketplaceFlowsData';
import useMarketplaceFlowsFilters from '../../../_composables/marketplace-flows/useMarketplaceFlowsFilters';
import useCopyPublicFlow from '../../../_composables/useCopyPublicFlow';
import PublicFlowList from '../PublicFlowList.vue';

defineProps<{
  isFiltersOpened?: boolean;
}>();

const { toastError } = useCustomToast();

const {
  filters,
  users,
  categories,
  socialNetworks,
  parseFiltersFromUrl,
  models,
  resetFilters,
} = useMarketplaceFlowsFilters();

const { data, loading, meta, getTableData } = useMarketplaceFlowsData({
  requestParams: () => ({
    name: filters.value.name || null,
    category_id: filters.value.category_id,
    user_id: filters.value.user_id,
    social_network: filters.value.social_network || [],
  }),
});

const { onCopy } = useCopyPublicFlow({ data });

const onToggleLike = async (item: PublicFlow) => {
  try {
    const response = await toggleLikePublicFlow(item.id);
    const idx = data.value?.findIndex((f) => f.id === item.id);
    if (idx !== undefined && idx !== -1 && data.value) {
      data.value[idx]!.is_liked = response.data.liked;
      data.value[idx]!.likes_count = response.data.likes_count;
    }
  } catch {
    toastError('Ошибка при обновлении лайка');
  }
};

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
  await Promise.all([
    getTableData(),
    users.getData(1),
    categories.getData(1),
    socialNetworks.getData(1),
    models.getData(1),
  ]);
  loading.value = false;
});
</script>
