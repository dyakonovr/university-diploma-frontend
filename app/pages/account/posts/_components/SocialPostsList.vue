<template>
  <section>
    <table-filters
      v-if="isFiltersOpened"
      :filters="filters"
      :loading="loading"
      @search="onSearchFiltersClick"
      @reset="onResetFiltersClick"
    >
      <select-ui
        v-model="filters.social_account_id"
        :options="socialAccounts.data.value || []"
        :initial-option="socialAccounts.initialOption.value"
        :select-props="{
          placeholder: 'Аккаунт',
          disabled: loading || socialAccounts.loading.value,
        }"
        @update:search-query="socialAccounts.debouncedGetData(1, true)"
        @reach-end="socialAccounts.getData(socialAccounts.meta.value.page + 1)"
      />
      <select-ui
        v-model="filters.post_id"
        :options="rawPosts.data.value || []"
        :initial-option="rawPosts.initialOption.value"
        :select-props="{
          placeholder: 'Сырой шаблон',
          disabled: loading || rawPosts.loading.value,
        }"
        @update:search-query="rawPosts.debouncedGetData(1, true)"
        @reach-end="rawPosts.getData(rawPosts.meta.value.page + 1)"
      />
      <select-ui
        v-model="filters.schedule_id"
        :options="scheduleSlots.data.value || []"
        :select-props="{
          placeholder: 'Слот расписания',
          disabled: loading || scheduleSlots.loading.value,
        }"
        @update:search-query="scheduleSlots.debouncedGetData(1, true)"
        @reach-end="scheduleSlots.getData(scheduleSlots.meta.value.page + 1)"
      />
    </table-filters>

    <social-post-cards-view
      v-model:pagination="meta"
      :loading="loading"
      :data="data"
      :empty-html="SOCIAL_POSTS_EMPTY_DESCRIPTION"
    />
  </section>
</template>

<script setup lang="ts">
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableFilters from '~/components/ui/tables/TableFilters.vue';
import useSocialPostsTableData from '~/domain/social-post/composables/useSocialPostsTableData';
import SocialPostCardsView from '~/domain/social-post/ui/SocialPostCardsView.vue';
import { SOCIAL_POSTS_EMPTY_DESCRIPTION } from '~/shared/constants/empty-descriptions.const';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useSocialPostsTableFilters from '../_composables/social-posts/useSocialPostsTableFilters';

defineProps<{
  isFiltersOpened?: boolean;
}>();

const {
  filters,
  rawPosts,
  socialAccounts,
  scheduleSlots,
  parseFiltersFromUrl,
  resetFilters,
} = useSocialPostsTableFilters();

const { data, loading, meta, getTableData } = useSocialPostsTableData({
  requestParams: () => ({
    post_id: filters.value.post_id || null,
    social_account_id: filters.value.social_account_id || null,
    schedule_id: filters.value.schedule_id || null,
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
  await Promise.all([
    getTableData(),
    rawPosts.getData(1),
    socialAccounts.getData(1),
    scheduleSlots.getData(1),
  ]);
  loading.value = false;
});
</script>
