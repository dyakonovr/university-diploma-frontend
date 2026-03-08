<template>
  <dialog-ui
    v-model="visible"
    :title="subscription?.name ?? ''"
    dialog-class="sub-dialog">
    <template v-if="subscription">
      <div class="sub-dialog__info">
        <div class="sub-dialog__price">
          {{ formatSubscriptionPrice(subscription.price) }} <small>&#8381;/мес</small>
        </div>
        <div class="sub-dialog__meta">
          <tag-ui type="default">{{ formatThousands(subscription.tokens_amount.toString()) }} токенов</tag-ui>
          <tag-ui type="default">{{ formatSubscriptionInterval(subscription.tokens_interval) }}</tag-ui>
          <tag-ui type="default">30 дней</tag-ui>
        </div>
      </div>

      <div class="sub-dialog__divider" />

      <div class="sub-dialog__models-header">
        Доступные модели
        <small>{{ totalModels }}</small>
      </div>

      <div class="sub-dialog__models">
        <div
          v-for="group in groups"
          :key="group.provider"
          class="sub-dialog__provider">
          <div class="sub-dialog__provider-name">{{ group.provider }}</div>
          <div class="sub-dialog__tags">
            <tag-ui
              v-for="model in group.models"
              :key="model.id"
              type="primary">
              {{ model.name }}
            </tag-ui>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <button-ui
        v-if="subscription && !isCurrent"
        :disabled="subscribing"
        @click="emit('subscribe')">
        {{ subscribing ? 'Создание платежа...' : 'Подписаться' }}
      </button-ui>
      <button-ui
        variant="outlined"
        @click="visible = false">
        Закрыть
      </button-ui>
    </template>
  </dialog-ui>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import TagUi from '~/components/ui/TagUi.vue';
import type { Subscription } from '~/domain/subscription/models/subscription.types';
import { formatSubscriptionInterval } from '~/domain/subscription/utils/interval.utils';
import { formatSubscriptionPrice } from '~/domain/subscription/utils/price.utils';
import type { ProviderGroup } from '~/pages/account/pricing/_composables/usePricingData';
import { formatThousands } from '~/shared/utils/core/formatThousands';

type Props = {
  subscription: Subscription | null;
  groups: ProviderGroup[];
  totalModels: number;
  isCurrent: boolean;
  subscribing: boolean;
};

defineProps<Props>();

const visible = defineModel<boolean>({ required: true });

const emit = defineEmits<{
  (e: 'subscribe'): void;
}>();
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.sub-dialog {
  width: 520px;
  max-width: 90vw;
}

.sub-dialog {
  &__info {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: offsets.$offset-16;
    flex-wrap: wrap;
  }

  &__price {
    font-size: offsets.$offset-24;
    font-weight: 700;

    small {
      font-size: 13px;
      font-weight: 400;
      color: colors.$text-light;
    }
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: offsets.$offset-8;
  }

  &__divider {
    height: 1px;
    background: colors.$border;
    margin: offsets.$offset-16 0;
  }

  &__models-header {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: colors.$text-light;
    margin-bottom: offsets.$offset-16;

    small {
      font-weight: 400;
    }
  }

  &__models {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-16;
    max-height: 50vh;
    overflow-y: auto;
  }

  &__provider {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-8;
  }

  &__provider-name {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: colors.$primary-dark;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: offsets.$offset-8;
  }
}
</style>
