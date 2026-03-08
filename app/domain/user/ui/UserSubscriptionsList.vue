<template>
  <form-container
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">Подписки</p>
    </template>

    <div class="form-container-padding">
      <table-view
        :table-data="subscriptions"
        :header-columns="columns"
        :loading="loading"
        :with-pagination="false"
        class="user-subscriptions-list"
      >
        <template #tokens_amount="item">
          {{ formatThousands(item.tokens_amount.toString()) }}
        </template>
        <template #expires_at="item">
          {{ formatDateToNormalized(item.expires_at) }}
        </template>
        <template #actions="item">
          <button-ui
            color="danger"
            variant="outlined"
            size="small"
            :disabled="loading || disabled"
            @click="emit('delete', item.id)"
          >
            Удалить
          </button-ui>
        </template>
      </table-view>

      <slot />
    </div>
  </form-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import TableView from '~/components/list-views/TableView.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import type { SubscriptionUserWithDetails } from '~/domain/subscription/models/subscription.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { formatDateToNormalized } from '~/shared/utils/core/formatDateToNormalized';
import { formatThousands } from '~/shared/utils/core/formatThousands';

type Props = {
  subscriptions: SubscriptionUserWithDetails[];
  loading: boolean;
  disabled?: boolean;
  showDelete?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'delete', id: EntityId): void;
}>();

const columns = computed<TableViewHeaderColumn[]>(() => {
  const base: TableViewHeaderColumn[] = [
    { prop: 'subscription_name', label: 'Название' },
    { prop: 'tokens_amount', label: 'Токенов' },
    { prop: 'tokens_interval', label: 'Интервал обновления токенов (ч.)' },
    { prop: 'expires_at', label: 'Действует до' },
  ];
  if (props.showDelete) {
    base.push({ prop: 'actions', label: 'Действия', width: 110 });
  }
  return base;
});
</script>

<style lang="scss">
.user-subscriptions-list {
  margin: 0;
}
</style>
