<template>
  <div
    class="tag-ui"
    :class="{ [type ?? '']: type, 'tag-ui--loading': loading }">
    <slot />
    <spinner-ui
      v-if="loading"
      class="tag-ui__spinner custom-color"
      :size="12"
      :border="2" />
  </div>
</template>

<script lang="ts" setup>
import type { TagType } from '~/shared/types/ui/tag.types';

import SpinnerUi from './SpinnerUi.vue';

type Props = {
  type?: TagType;
  loading?: boolean;
};

withDefaults(defineProps<Props>(), {
  loading: false,
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.tag-ui {
  display: inline-flex;
  width: fit-content;
  padding: 4px 6px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 12px;
  border: 1px solid transparent;

  &.success {
    color: #059669;
    background-color: #ecfdf5;
    border-color: #a7f3d0;
  }

  &.error {
    color: #dc2626;
    background-color: #fef2f2;
    border-color: #fecaca;
  }

  &.warning {
    color: #d97706;
    background-color: #fffbeb;
    border-color: #fde68a;
  }

  &.info {
    color: #6b7280;
    background-color: #f9fafb;
    border-color: #e5e7eb;
  }

  &.primary {
    color: #4f46e5;
    background-color: #eef2ff;
    border-color: #c7d2fe;
  }

  &.default {
    color: #6b7280;
    background-color: #f9fafb;
    border-color: #e5e7eb;
  }

  &--loading {
    gap: 4px;
    align-items: center;
  }

  &__spinner {
    flex-shrink: 0;
    color: currentColor;
  }

  // Используется в селектах
  &.ml {
    margin-left: 8px;
  }
}
</style>
