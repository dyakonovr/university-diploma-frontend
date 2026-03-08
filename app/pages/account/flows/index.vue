<template>
  <account-table-header
    v-model:filters-opened="isFiltersOpened"
    create-link-to="/account/flows/private/create"
    create-link-text="Создать приватный шаблон"
  />

  <tabs-ui
    v-model="activeTab"
    :tabs="TABS"
    class="flows">
    <template #myPrivate>
      <my-private-flows-list :is-filters-opened="isFiltersOpened" />
    </template>

    <template #myPublic>
      <my-public-flows-list :is-filters-opened="isFiltersOpened" />
    </template>

    <template #marketplace>
      <marketplace-flows-list :is-filters-opened="isFiltersOpened" />
    </template>

    <template #requestsForPublish>
      <requests-for-publish-flows-list :is-filters-opened="isFiltersOpened" />
    </template>
  </tabs-ui>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import TabsUi from '~/components/ui/TabsUi.vue';
import useUserStore from '~/domain/user/stores/user';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import type { TabItem } from '~/shared/types/ui/tabs.types';

import MarketplaceFlowsList from './_components/tabs/marketplace/MarketplaceFlowsList.vue';
import MyPrivateFlowsList from './_components/tabs/my-private/MyPrivateFlowsList.vue';
import MyPublicFlowsList from './_components/tabs/my-public/MyPublicFlowsList.vue';
import RequestsForPublishFlowsList from './_components/tabs/requests/RequestsForPublishFlowsList.vue';

type TabKey = 'myPrivate' | 'myPublic' | 'marketplace' | 'requestsForPublish';

const userStore = useUserStore();

const TABS = computed<TabItem<TabKey>[]>(() => [
  { label: 'Мои приватные шаблоны', value: 'myPrivate' },
  { label: 'Мои публичные шаблоны', value: 'myPublic' },
  { label: 'Маркетплейс', value: 'marketplace' },
  {
    label: 'Запросы на публикацию',
    value: 'requestsForPublish',
    visible: userStore.isAdmin,
  },
]);
const activeTab = ref<TabKey>('myPrivate');
const isFiltersOpened = ref(false);

// --- SEO ---
const PAGE_TITLE = 'Шаблоны';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(
  computed(() => {
    const tabLabel = TABS.value.find((t) => t.value === activeTab.value)?.label;
    return tabLabel ? `${PAGE_TITLE}: ${tabLabel}` : PAGE_TITLE;
  }),
);
</script>

<style lang="scss">
.flows {
  margin-top: 20px;
}
</style>
