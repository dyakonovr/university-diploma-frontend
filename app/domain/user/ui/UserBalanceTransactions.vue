<template>
  <form-container
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">Баланс и транзакции</p>
    </template>

    <div class="form-container-padding">
      <balance-ui :balance="balance" />

      <table-view
        v-model:current-page="page"
        with-pagination
        class="user-balance-transactions__table"
        :table-data="transactions"
        :header-columns="columns"
        :loading="loading"
        :total-pages="totalPages"
      >
        <template #type="item">
          <span
            :class="[
              'user-balance-transactions__tx-type',
              `user-balance-transactions__tx-type--${item.reason}`,
            ]"
          >
            {{ TRANSACTIONS_LABEL[item.reason] ?? 'Неизвестно' }}
          </span>
          <nuxt-link
            v-if="item.reason === 'step_usage' && item.post_id"
            :to="`/account/posts/raw/${item.post_id}`"
            class="user-balance-transactions__tx-link"
          >
            Перейти к генерации
          </nuxt-link>
        </template>
        <template #amount="item">
          <span
            :class="[
              'user-balance-transactions__tx-amount',
              `user-balance-transactions__tx-amount--${item.reason}`,
            ]"
          >
            {{ item.amount > 0 ? '+' : '-' }}
            {{ formatThousands(Math.abs(item.amount).toString()) }}
          </span>
        </template>
        <template #created_at="item">
          {{ formatDateToNormalized(item.created_at) }}
        </template>
      </table-view>
    </div>
  </form-container>
</template>

<script lang="ts" setup>
import TableView from '~/components/list-views/TableView.vue';
import BalanceUi from '~/components/ui/BalanceUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import { TRANSACTIONS_LABEL } from '~/domain/subscription/constants/transactions.const';
import type { Transaction } from '~/domain/subscription/models/subscription.types';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { formatDateToNormalized } from '~/shared/utils/core/formatDateToNormalized';
import { formatThousands } from '~/shared/utils/core/formatThousands';

type Props = {
  balance: number | null;
  transactions: Transaction[];
  loading: boolean;

  totalPages: number;
};

defineProps<Props>();

const page = defineModel<number>('currentPage');

const columns: TableViewHeaderColumn[] = [
  { prop: 'type', label: 'Тип', minWidth: 150 },
  { prop: 'amount', label: 'Сумма (токены)', minWidth: 200 },
  { prop: 'created_at', label: 'Дата', width: 200 },
];
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.user-balance-transactions {
  &__table {
    margin-top: 16px;
    margin-bottom: 0;
  }

  &__tx-type,
  &__tx-amount {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;

    &--subscription_initial,
    &--subscription_renewal,
    &--admin_grant {
      background: rgba(colors.$success, 0.12);
      color: colors.$success-dark;
    }

    &--step_usage {
      background: rgba(colors.$danger, 0.1);
      color: colors.$danger-dark;
    }
  }

  &__tx-link {
    display: block;
    margin-top: 4px;
    font-size: 13px;
    color: colors.$primary;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
