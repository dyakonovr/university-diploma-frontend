<template>
  <button
    type="button"
    class="badge-ui"
    :class="{ [variant]: variant, [size]: size, [color]: color }">
    <div class="badge-ui__circle" />
    <slot />
  </button>
</template>

<script lang="ts" setup>
type Props = {
  color?: 'primary' | 'success' | 'danger' | 'info' | 'warning' | 'grey';
  variant?: 'default' | 'outlined';
  size?: 'large' | 'medium' | 'small' | 'extra-small';
};

withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'default',
  size: 'large'
});
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as textMixins;

.badge-ui {
  display: flex;
  align-items: center;
  border-radius: 100px;
  width: fit-content;

  // COLORS
  &.primary {
    &.default {
      color: colors.$white;
      background-color: colors.$primary-normal;
    }

    &.outlined {
      color: colors.$primary-active;
      border: 1px solid colors.$primary-clarity-20;
      background-color: colors.$primary-light;
    }
  }

  &.success {
    &.default {
      color: colors.$white;
      background-color: colors.$success-normal;
    }

    &.outlined {
      color: colors.$success-active;
      border: 1px solid colors.$success-clarity-20;
      background-color: colors.$success-light;
    }
  }

  &.danger {
    &.default {
      color: colors.$white;
      background-color: colors.$danger-normal;
    }

    &.outlined {
      color: colors.$danger-normal;
      border: 1px solid colors.$danger-clarity-20;
      background-color: colors.$danger-light;
    }
  }

  &.info {
    color: colors.$gray-900;

    &.default {
      background-color: colors.$info-normal;
    }

    &.outlined {
      border: 1px solid colors.$info-clarity-20;
      background-color: colors.$info-light;
    }
  }

  &.warning {
    &.default {
      color: colors.$white;
      background-color: colors.$warning-normal;
    }

    &.outlined {
      color: colors.$warning-active;
      border: 1px solid colors.$warning-clarity-20;
      background-color: colors.$warning-light;
    }
  }

  &.grey {
    &.default {
      color: colors.$gray-700;
      background-color: colors.$gray-200;
    }

    &.outlined {
      color: colors.$gray-600;
      border: 1px solid colors.$gray-300;
      background-color: colors.$gray-100;
    }
  }
  // COLORS END

  // SIZES
  &.large {
    padding: 9px offsets.$offset-12;
    gap: 7px;

    @include textMixins.text-14;

    .badge-ui__circle {
      width: 7px;
      height: 7px;
    }
  }

  &.medium {
    padding: offsets.$offset-8 10px;
    gap: 6px;

    @include textMixins.text-12;

    .badge-ui__circle {
      width: 6px;
      height: 6px;
    }
  }

  &.small {
    padding: 5px;
    gap: 5px;

    @include textMixins.text-10;

    .badge-ui__circle {
      width: 5px;
      height: 5px;
    }
  }
  
  &.extra-small {
    padding: 3px;
    gap: 4px;

    @include textMixins.text-10;

    .badge-ui__circle {
      width: 4px;
      height: 4px;
    }
  }
  // SIZES END

  &__circle {
    border-radius: 100%;
    background-color: currentColor;
  }
}
</style>