<template>
  <account-table-header
    v-model:filters-opened="isFiltersOpened"
    :with-create-link="false"
  />

  <tabs-ui
    v-model="activeTab"
    :tabs="TABS"
    class="posts">
    <template #raw>
      <raw-posts-list :is-filters-opened="isFiltersOpened" />
    </template>

    <template #social>
      <social-posts-list :is-filters-opened="isFiltersOpened" />
    </template>
  </tabs-ui>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import TabsUi from '~/components/ui/TabsUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import type { TabItem } from '~/shared/types/ui/tabs.types';

import RawPostsList from './_components/RawPostsList.vue';
import SocialPostsList from './_components/SocialPostsList.vue';

type TabKey = 'raw' | 'social';
const TABS: TabItem<TabKey>[] = [
  { label: 'Результаты генераций', value: 'raw' },
  { label: 'Посты в соц. сетях', value: 'social' },
];
const activeTab = ref<TabKey>('raw');

const isFiltersOpened = ref(false);

// --- SEO ---
const PAGE_TITLE = 'Посты';
definePageMeta({ title: 'Посты' });
useAccountSeoTitle(
  computed(() => {
    const tabLabel = TABS.find((t) => t.value === activeTab.value)?.label;
    return tabLabel ? `${PAGE_TITLE}: ${tabLabel}` : PAGE_TITLE;
  }),
);
</script>

<style lang="scss">
.posts {
  margin-top: 20px;
}
</style>
