<template>
  <div
    class="pricing-card"
    :class="{ 'pricing-card--active': isCurrent }">
    <div class="pricing-card__header">
      <h3>{{ subscription.name }}</h3>
      <tag-ui
        v-if="isCurrent"
        type="success">
        Текущий
      </tag-ui>
    </div>

    <div class="pricing-card__price">
      {{ formatSubscriptionPrice(subscription.price) }} <small>&#8381;/мес</small>
    </div>

    <div class="pricing-card__details">
      <tag-ui type="default">{{ subscription.tokens_amount.toLocaleString('ru-RU') }} токенов</tag-ui>
      <tag-ui type="default">{{ formatSubscriptionInterval(subscription.tokens_interval) }}</tag-ui>
      <tag-ui type="default">30 дней</tag-ui>
    </div>

    <button
      v-if="modelsCount > 0"
      class="pricing-card__models-btn"
      @click="emit('showModels')">
      {{ modelsCount }} {{ pluralizeRu(modelsCount, 'модель', 'модели', 'моделей') }} от {{ providersCount }} {{ pluralizeRu(providersCount, 'провайдера', 'провайдеров', 'провайдеров') }}
    </button>

    <button-ui
      v-if="!isCurrent"
      :disabled="subscribing"
      class="pricing-card__btn"
      @click="emit('subscribe')">
      {{ subscribing ? 'Создание платежа...' : 'Подписаться' }}
    </button-ui>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import TagUi from '~/components/ui/TagUi.vue';
import type { Subscription } from '~/domain/subscription/models/subscription.types';
import { formatSubscriptionInterval } from '~/domain/subscription/utils/interval.utils';
import { formatSubscriptionPrice } from '~/domain/subscription/utils/price.utils';
import { pluralizeRu } from '~/shared/utils/pluralizeRu';

type Props = {
  subscription: Subscription;
  isCurrent: boolean;
  subscribing: boolean;
  modelsCount: number;
  providersCount: number;
};

defineProps<Props>();

const emit = defineEmits<{
  (e: 'subscribe'): void;
  (e: 'showModels'): void;
}>();

</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.pricing-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid colors.$border;
  border-radius: 12px;

  &--active {
    border-color: colors.$primary;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__price {
    font-size: 28px;
    font-weight: 700;

    small {
      font-size: 14px;
      font-weight: 400;
      color: colors.$text-light;
    }
  }

  &__details {
    display: flex;
    flex-wrap: wrap;
    gap: offsets.$offset-8;
  }

  &__models-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: offsets.$offset-8;
    background: colors.$background;
    border: 1px solid colors.$border;
    border-radius: offsets.$offset-8;
    font-size: 13px;
    font-weight: 500;
    color: colors.$primary-dark;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: colors.$border;
    }
  }

  &__btn {
    max-width: 100%;
    margin-top: auto;
  }
}
</style>
