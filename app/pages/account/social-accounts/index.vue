<template>
  <section>
    <account-table-header
      create-link-to="/account/social-accounts/create"
      :filters-props="{
        filters,
        loading,
      }"
      @filters-search="onSearchFiltersClick"
      @filters-reset="onResetFiltersClick"
    >
      <template #filters>
        <input-ui
          v-model="filters.name"
          :input-props="{ placeholder: 'Название', disabled: loading }"
        />
        <select-ui
          v-model="filters.provider"
          :options="providers.data.value || []"
          :select-props="{
            placeholder: 'Соц. сети',
            disabled: loading || providers.loading.value,
          }"
          :searchable="false"
          @update:search-query="providers.debouncedGetData(1, true)"
          @reach-end="providers.getData(providers.meta.value.page + 1)"
        >
          <template #selected="{ value }">
            <social-badge :provider="value as SocialAccountProviderName" />
          </template>
          <template #option="{ option }">
            <social-badge
              :provider="option.value as SocialAccountProviderName"
            />
          </template>
        </select-ui>

        <select-ui
          v-model="filters.is_active"
          :options="IS_ACTIVE_SELECT_OPTIONS"
          :searchable="false"
          :select-props="{
            placeholder: 'Активный аккаунт?',
            disabled: loading,
          }"
        />
      </template>
    </account-table-header>

    <cards-view
      v-model:current-page="meta.page"
      with-pagination
      :data="data || []"
      :total-pages="meta.total_pages"
      :loading="loading"
      :card-link="(item) => `/account/social-accounts/${item.id}`"
      @update:current-page="() => getTableData()"
    >
      <template #title="{ item }">
        <p class="social-accounts__item-title">
          {{ item.account_name }}
          <social-badge :provider="item.provider" />
        </p>
      </template>

      <template #body="{ item }">
        <tag-ui
          :type="item.is_active ? 'success' : 'error'"
          class="social-accounts__tag"
        >
          {{ item.is_active ? 'Активный' : 'Неактивный' }}
        </tag-ui>
      </template>

      <template #actions="{ item }">
        <table-action-menu
          :edit-link="`/account/social-accounts/${item.id}`"
          @delete-click="handleDelete(item)"
        />
      </template>
    </cards-view>
  </section>

  <social-post-statistic
    :request-func="requestStatistic"
    dynamic-title="Динамика по всем аккаунтам в соц. сетях"
    total-title="Общая статистика всех аккаунтов"
  />

  <delete-confirmation-dialog
    v-bind="deleteItemDialogContent"
    v-model="deleteDialogVisible"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import CardsView from '~/components/list-views/CardsView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import SocialBadge from '~/components/SocialBadge.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import TagUi from '~/components/ui/TagUi.vue';
import { deleteSocialAccount } from '~/domain/social-account/api/social-account.api';
import type { SocialAccount } from '~/domain/social-account/models/social-account.types';
import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';
import { getSocialPostsDynamicStatisticByUserId } from '~/domain/social-post/api/social-post-statistic.api';
import SocialPostStatistic from '~/domain/social-post/ui/statistic/SocialPostStatistic.vue';
import useUserStore from '~/domain/user/stores/user';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import type { QueryParams } from '~/shared/types/core/request.types';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

import useSocialAccountsTableData from './_composables/useSocialAccountsTableData';
import useSocialAccountsTableFilters from './_composables/useSocialAccountsTableFilters';

const {
  filters,
  IS_ACTIVE_SELECT_OPTIONS,
  providers,
  parseFiltersFromUrl,
  resetFilters,
} = useSocialAccountsTableFilters();

const { data, loading, meta, getTableData } = useSocialAccountsTableData({
  requestParams: () => ({
    name: filters.value.name || null,
    is_active: filters.value.is_active || null,
    provider: filters.value.provider || null,
  }),
});

const userStore = useUserStore();

const requestStatistic = async (params: QueryParams) => {
  if (!userStore.user) return [];

  const response = await getSocialPostsDynamicStatisticByUserId(
    userStore.user.id,
    params,
  );
  return response.data.data;
};

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<SocialAccount>({
  errorMessage: 'Ошибка при удалении аккаунта',
  successMessage: 'Аккаунт успешно удалён',
  deleteFunc: deleteSocialAccount,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.account_name,
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
const PAGE_TITLE = 'Аккаунты в соц. сетях';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style scoped lang="scss">
.social-accounts {
  &__item-title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tag {
    vertical-align: middle;
  }
}
</style>
