<template>
  <button
    :class="{ 'button-ui text-14 weight-500': true, 'button-ui-with-icon': $slots.postIcon || $slots.preIcon, 'loading': loading, [variant]: variant, [size]: size }">
    <span class="button-ui__content">
      <template v-if="$slots.preIcon">
        <div class="button-ui__icon">
          <slot name="preIcon" />
        </div>
      </template>
      <slot />
      <template v-if="$slots.postIcon">
        <div class="button-ui__icon">
          <slot name="postIcon" />
        </div>
      </template>
    </span>

    <div
      v-show="loading"
      class="button-ui__spinner">
      <loading-icon />
    </div>
  </button>
</template>

<script lang="ts" setup>
import LoadingIcon from '../LoadingIcon.vue';

type Props = {
  loading?: boolean;
  size?: 'large' | 'medium' | 'small';
  variant?: 'primary' | 'secondary' | 'outlined' | 'error';
}

withDefaults(defineProps<Props>(), {
  size: 'large',
  variant: 'primary'
});
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.button-ui {
  position: relative;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
  color: colors.$gray-100;

  // SIZES START
  &.large {
    padding: offsets.$offset-12;
  }

  &.medium {
    padding: offsets.$offset-12 offsets.$offset-16;
  }

  &.small {
    padding: offsets.$offset-8 offsets.$offset-12;
  }

  // SIZES END

  // COLORS START
  &.error {
    color: colors.$white;
    background-color: colors.$danger-normal;

    &:hover {
      background-color: colors.$danger-active;
    }

    &:active,
    &.loading {
      background-color: colors.$danger-active;
    }

    &:disabled {
      color: colors.$gray-500;
      background-color: #EBEDF2;
    }
  }

  &.primary {
    color: colors.$gray-100;
    background-color: colors.$primary-normal;

    &:hover {
      background-color: colors.$primary-active;
    }

    &:active,
    &.loading {
      background-color: colors.$primary-click;
    }

    &:disabled {
      color: colors.$gray-500;
      background-color: #EBEDF2;
    }
  }

  &.secondary {
    color: colors.$gray-700;
    background-color: #E1E4EC;

    &:hover {
      background-color: #EBEDF2;
    }

    &:active,
    &.loading {
      background-color: colors.$gray-100;
    }

    &:disabled {
      color: colors.$gray-500;
      background-color: #EBEDF2;
    }
  }

  &.outlined {
    border: 1px solid colors.$gray-300;
    color: colors.$gray-700;
    background-color: colors.$white;

    &:hover {
      background-color: colors.$gray-100;
    }

    &:active,
    &.loading {
      background-color: colors.$gray-100;
      border-color: colors.$gray-400;
    }

    &:disabled {
      color: colors.$gray-500;
      border-color: colors.$gray-200;
      background-color: colors.$white;
    }
  }

  // COLORS START

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;

    svg path {
      stroke: currentColor;
    }
  }

  &__spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>