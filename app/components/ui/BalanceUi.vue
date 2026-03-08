<template>
  <div class="balance-ui">
    <span class="balance-ui__label">Баланс: </span>
    <span class="balance-ui__value">
      {{ balance !== null ? formatThousands(String(balance)) : '—' }}
      <span
        v-if="balance !== null"
        class="balance-ui__unit"
      >токенов</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { formatThousands } from '~/shared/utils/core/formatThousands';

type Props = {
  balance: number | null;
};

defineProps<Props>();
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.balance-ui {
  display: flex;
  align-items: center;
  gap: 8px;

  &__label {
    font-size: 13px;
    color: colors.$text-light;
    font-weight: 500;
  }

  &__value {
    font-size: 15px;
    font-weight: 600;
    color: colors.$text;
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  &__unit {
    font-size: 12px;
    font-weight: 400;
    color: colors.$text-light;
  }
}
</style>
