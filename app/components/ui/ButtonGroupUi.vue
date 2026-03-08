<template>
  <div class="buttons-group">
    <button
      v-for="item in items"
      :key="item.key"
      :class="[
        'buttons-group__button text-14 weight-500',
        { active: model === item.key },
      ]"
      @click="model = item.key"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { ButtonGroupItems } from '~/shared/types/ui/button-group.types';

type Props = {
  items: ButtonGroupItems;
};
defineProps<Props>();

const model = defineModel<string | null>();
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.buttons-group {
  display: flex;
  gap: 8px;
  border-radius: 8px;
  width: fit-content;
  padding: 6px;
  background-color: colors.$border;

  &__button {
    padding: 6px 16px;
    border: 1px solid colors.$border;
    border-radius: 8px;
    background: transparent;
    color: colors.$text-light;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: colors.$text;
      background: colors.$background;
    }

    &.active {
      background: colors.$white;
      color: colors.$black;
      border-color: colors.$white;
    }
  }
}
</style>
