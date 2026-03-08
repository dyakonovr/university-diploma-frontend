<template>
  <component
    :is="componentTag"
    type="button"
    v-bind="componentAttrs"
    :class="['button-ui', size, color, variant, { loading }]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { NuxtLink } from '#components';

type Props = {
  to?: string;
  href?: string;
  tag?: 'button';
  size?: 'large' | 'default' | 'small' | 'icon';
  color?: 'primary' | 'accent' | 'danger' | 'success';
  variant?: 'filled' | 'outlined';
  loading?: boolean;
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  href: undefined,
  tag: 'button',
  size: 'default',
  color: 'primary',
  variant: 'filled',
  loading: false,
  disabled: false,
});

/**
 * Определяем, что рендерить
 */
const componentTag = computed(() => {
  if (props.to) return NuxtLink;
  if (props.href) return 'a';
  return 'button';
});

/**
 * Атрибуты для конкретного тега
 */
const componentAttrs = computed(() => {
  if (props.to) {
    return {
      to: props.to,
      disabled: props.disabled || props.loading,
    };
  }

  if (props.href) {
    return {
      href: props.href,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  return {
    type: 'button',
    disabled: props.disabled || props.loading,
  };
});
</script>

<style lang="scss">
@use '/assets/styles/mixins/button' as buttonMixins;
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.form-button {
  min-width: 100px;
}

.button-ui {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 8px;
  border: 2px solid;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  max-width: fit-content;

  svg {
    width: 16px;
    height: 16px;
  }

  // SIZES START
  &.large {
    padding: 16px;
    min-height: 52px;
  }

  &.default {
    padding: 8px 16px;
    min-height: 40px;
  }
  
  &.small {
    padding: 4px 8px;
    font-size: 14px;
  }

  &.icon {
    justify-content: center;
    max-width: unset;
    width: 40px;
    height: 40px;
  }
  // SIZES END

  // COLORS START
  &.primary {
    border: 2px solid colors.$primary;

    /* ========================
      PRIMARY / FILLED
    ======================== */
    &.filled {
      @include buttonMixins.button-variant(
        $bg: colors.$primary,
        $text: colors.$white,
        $border: colors.$primary,
        $hover-bg: colors.$primary-dark,
        $hover-text: colors.$white,
        $hover-border: colors.$primary-dark,
        $disabled-bg: colors.$primary-disabled,
        $disabled-border: colors.$primary-disabled
      );
    }

    /* ========================
      PRIMARY / OUTLINED
    ======================== */
    &.outlined {
      @include buttonMixins.button-variant(
        $bg: transparent,
        $text: colors.$primary,
        $border: colors.$primary,
        $hover-bg: colors.$primary,
        $hover-text: colors.$white,
        $hover-border: colors.$primary,
        $disabled-bg: transparent,
        $disabled-border: colors.$primary-disabled,
        $disabled-text: colors.$primary-disabled
      );
    }
  }

  // ------------------------------
  // ACCENT
  // ------------------------------
  &.accent {
    &.filled {
      @include buttonMixins.button-variant(
        $bg: colors.$accent,
        $text: colors.$white,
        $border: colors.$accent,
        $hover-bg: colors.$accent-dark,
        $hover-text: colors.$white,
        $hover-border: colors.$accent-dark,
        $disabled-bg: colors.$accent-disabled,
        $disabled-border: colors.$accent-disabled
      );
    }

    &.outlined {
      @include buttonMixins.button-variant(
        $bg: transparent,
        $text: colors.$accent,
        $border: colors.$accent,
        $hover-bg: colors.$accent,
        $hover-text: colors.$white,
        $hover-border: colors.$accent,
        $disabled-bg: transparent,
        $disabled-border: colors.$accent-disabled,
        $disabled-text: colors.$accent-disabled
      );
    }
  }

  // DANGER
  &.danger {
    &.filled {
      @include buttonMixins.button-variant(
        $bg: colors.$danger,
        $text: colors.$white,
        $border: colors.$danger,
        $hover-bg: colors.$danger-dark,
        $hover-text: colors.$white,
        $hover-border: colors.$danger-dark,
        $disabled-border: colors.$danger-disabled,
        $disabled-bg: colors.$danger-disabled
      );
    }

    &.outlined {
      @include buttonMixins.button-variant(
        $bg: transparent,
        $text: colors.$danger,
        $border: colors.$danger,
        $hover-bg: colors.$danger,
        $hover-text: colors.$white,
        $hover-border: colors.$danger,
        $disabled-bg: transparent,
        $disabled-border: colors.$danger-disabled,
        $disabled-text: colors.$danger-disabled
      );
    }
  }

  // ------------------------------
  // SUCCESS
  // ------------------------------
  &.success {
    &.filled {
      @include buttonMixins.button-variant(
        $bg: colors.$success,
        $text: colors.$white,
        $border: colors.$success,
        $hover-bg: colors.$success-dark,
        $hover-text: colors.$white,
        $hover-border: colors.$success-dark,
        $disabled-border: colors.$success-disabled,
        $disabled-bg: colors.$success-disabled
      );
    }

    &.outlined {
      @include buttonMixins.button-variant(
        $bg: transparent,
        $text: colors.$success,
        $border: colors.$success,
        $hover-bg: colors.$success,
        $hover-text: colors.$white,
        $hover-border: colors.$success,
        $disabled-bg: transparent,
        $disabled-border: colors.$success-disabled,
        $disabled-text: colors.$success-disabled
      );
    }
  }
  // COLORS START

  &__content {
  }

  &.loading {
    pointer-events: none;

    .button-ui__content {
      opacity: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
    }
  }

  &__icon {
  }

  &__spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
