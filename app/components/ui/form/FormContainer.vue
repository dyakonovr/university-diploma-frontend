<template>
  <loading-wrapper
    class="form-container"
    :class="{ 'form-container--with-header': $slots.header }"
    :loading="loading"
  >
    <div
      v-if="$slots.header"
      class="form-container__header text-18">
      <slot name="header" />
    </div>
    <slot />
  </loading-wrapper>
</template>

<script setup lang="ts">
import LoadingWrapper from '../LoadingWrapper.vue';

type Props = {
  loading?: boolean;
};

withDefaults(defineProps<Props>(), {
  loading: false,
});
</script>

<style lang="scss">
@use '/assets/styles/mixins/text' as textMixins;
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/components/form' as form;

.account-layout__main:has(.form-container) {
  background-color: colors.$background;
}

.form-container {
  border: 1px solid colors.$border;
  border-radius: 12px;
  background-color: colors.$white;
  padding: calc(form.$form-container-fields-gap / 2) 0;

  &:has(.form-container__header) {
    padding-top: 0;
  }

  &:has(> .form-container-padding) {
    padding-bottom: 0;
  }

  &.divided {
    .form-container__header {
      padding: form.$form-container-divided-header-padding;
      border-bottom: 1px solid form.$form-container-border-color;

      // Если нет body
      &:last-child {
        border-bottom: none;
      }
    }
  }

  &--with-header {
    &:not(.divided) {
      .form-wrapper:nth-child(2) {
        padding-top: 0;
      }
    }
  }

  &__header {
    padding: form.$form-container-header-padding;
  }

  &__title {
    font-weight: 600;
  }

  &__description {
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    color: colors.$text-light;
    margin-top: 4px;

    @media screen and (max-width: 768px) {
      font-size: 15px;
    }
  }

  & > .form-wrapper {
    padding: calc(form.$form-container-fields-gap / 2)
      form.$form-container-padding-y;

    // &:not(:last-child):not(.no-border) {
    //   border-bottom: form.$form-container-blocks-separator;
    // }

    // @media screen and (max-width: 992px) {
    //   padding: form.$form-container-padding-mobile;
    // }
  }

  &:first-of-type,
  & + .form-container {
    margin-top: 16px;
  }

  &:last-of-type {
    margin-bottom: 16px;
  }
}

.form-container-padding-x {
  padding: 0 form.$form-container-padding-y;
}

.form-container-padding-y {
  padding: calc(form.$form-container-fields-gap / 2) 0;
}

.form-container-padding {
  padding: form.$form-container-fields-gap;
}

.form-container-top-half-padding {
  padding-top: calc(form.$form-container-fields-gap / 2) !important;
}

.form-container-bottom-half-padding {
  padding-bottom: calc(form.$form-container-fields-gap / 2) !important;
}

.form-container-border-bottom {
  border-bottom: form.$form-container-blocks-separator;
}
</style>
