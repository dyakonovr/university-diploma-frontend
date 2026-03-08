<template>
  <section class="subscriptions">
    <account-table-header
      create-link-to="/account/subscriptions/new"
      :with-filters="false"
    />

    <table-view
      v-model:current-page="meta.page"
      with-pagination
      :header-columns="TABLE_HEADER_COLUMNS"
      :table-data="data || []"
      :total-count-value="meta.total"
      :total-pages="meta.total_pages"
      :loading="loading"
      :row-link="(item) => `/account/subscriptions/${item.id}`"
      @update:current-page="getTableData()"
    >
      <template #name="item">
        {{ item.name }}
      </template>

      <template #price="item">
        {{ formatSubscriptionPrice(item.price) }} руб.
      </template>

      <template #tokens_amount="item">
        {{ item.tokens_amount }}
      </template>

      <template #tokens_interval="item">
        {{ item.tokens_interval }}
      </template>

      <template #created_at="item">
        {{ formatDateToNormalized(item.created_at) }}
      </template>

      <template #actions="item">
        <table-action-menu
          :edit-link="`/account/subscriptions/${item.id}`"
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
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import { deleteSubscription } from '~/domain/subscription/api/subscriptions.api';
import type { Subscription } from '~/domain/subscription/models/subscription.types';
import { formatSubscriptionPrice } from '~/domain/subscription/utils/price.utils';
import useSubscriptionsTableData from '~/pages/account/subscriptions/_composables/useSubscriptionsTableData';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { formatDateToNormalized } from '~/shared/utils/core/formatDateToNormalized';
import { parsePaginationFromUrl } from '~/shared/utils/parsePaginationFromUrl';

const { TABLE_HEADER_COLUMNS, data, loading, getTableData, meta } =
  useSubscriptionsTableData();

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  confirmDelete,
  handleDelete,
} = useDeleteTableItem<Subscription>({
  errorMessage: 'Ошибка при удалении подписки',
  successMessage: 'Подписка успешно удалена',
  deleteFunc: deleteSubscription,
  getTableData: () => getTableData(),
  mapFunc: (el) => el.name,
});

onBeforeMount(async () => {
  parsePaginationFromUrl(meta);

  loading.value = true;
  await Promise.all([getTableData()]);
  loading.value = false;
});

// --- SEO ---
const PAGE_TITLE = 'Подписки';
definePageMeta({ title: PAGE_TITLE, middleware: 'admin' });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss" scoped>
.subscriptions {
  width: 100%;
}
</style>
