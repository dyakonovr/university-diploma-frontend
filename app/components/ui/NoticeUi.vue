<template>
  <div
    class="notice-ui"
    :class="`notice-ui--${type}`">
    <div class="notice-ui__icon">{{ iconMap[type] }}</div>
    <div class="notice-ui__content">
      <p class="notice-ui__title">{{ title }}</p>
      <p
        v-if="$slots.default"
        class="notice-ui__text">
        <slot />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NoticeType } from '~/shared/types/ui/notice.types';

type Props = {
  type?: NoticeType;
  title: string;
};

withDefaults(defineProps<Props>(), {
  type: 'info',
});

const iconMap: Record<NoticeType, string> = {
  info: 'i',
  warning: '!',
  error: '!',
  success: '✓',
};
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.notice-ui {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: colors.$white;
    font-weight: 700;
    font-size: 14px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-weight: 600;
    font-size: 14px;
  }

  &__text {
    font-size: 14px;
    color: colors.$text;
    line-height: 1.5;
  }

  // Info
  &--info {
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;

    .notice-ui__icon {
      background-color: colors.$primary;
    }

    .notice-ui__title {
      color: colors.$primary-dark;
    }
  }

  // Warning
  &--warning {
    background-color: #fffbeb;
    border: 1px solid #fde68a;

    .notice-ui__icon {
      background-color: colors.$accent;
    }

    .notice-ui__title {
      color: colors.$accent-dark;
    }
  }

  // Error
  &--error {
    background-color: #fef2f2;
    border: 1px solid #fecaca;

    .notice-ui__icon {
      background-color: colors.$danger;
    }

    .notice-ui__title {
      color: colors.$danger-dark;
    }
  }

  // Success
  &--success {
    background-color: #ecfdf5;
    border: 1px solid #a7f3d0;

    .notice-ui__icon {
      background-color: colors.$success;
    }

    .notice-ui__title {
      color: colors.$success-dark;
    }
  }
}
</style>
