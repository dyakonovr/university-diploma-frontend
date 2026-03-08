<template>
  <notice-ui
    v-if="subscriptions?.length"
    type="warning"
    title="Нет доступа к генерации"
  >
    <p class="needed-subscriptions__label">
      Для запуска генерации требуются подписки:
    </p>
    <ul class="needed-subscriptions__list">
      <li
        v-for="sub in subscriptions"
        :key="sub.id"
        class="needed-subscriptions__item"
      >
        {{ sub.name }}
        <span class="needed-subscriptions__price">
          {{ formatSubscriptionPrice(sub.price) }} руб.
        </span>
      </li>
    </ul>
  </notice-ui>
</template>

<script setup lang="ts">
import NoticeUi from '~/components/ui/NoticeUi.vue';
import { formatSubscriptionPrice } from '~/domain/subscription/utils/price.utils';

import type { FlowNeededSubscription } from '../model/flow.general-types';

defineProps<{
  subscriptions: FlowNeededSubscription[];
}>();
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.needed-subscriptions {
  &__label {
    margin-bottom: 8px;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: rgba(colors.$accent, 0.08);
    border-radius: 6px;
    font-size: 14px;
  }

  &__price {
    font-weight: 600;
    white-space: nowrap;
  }
}
</style>
