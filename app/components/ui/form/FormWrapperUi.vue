<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div
    :class="[
      'form-wrapper',
      formWrapperClass,
      direction,
      (label || reserveLabelSpace) && 'with-label',
    ]"
  >
    <label
      v-if="label || reserveLabelSpace"
      class="form-wrapper__label"
      :class="{
        'form-wrapper__label--empty': !label,
        'form-wrapper__label--with-descr': description,
      }"
    >
      <span v-html="label" />
      <span
        v-if="required"
        class="form-wrapper__label-required">*</span>
      <tooltip-ui
        v-if="labelHint"
        :content="labelHint"
        raw-content
        placement="right-center"
      >
        <info-icon tabindex="-1" />
        <!-- <question-circle-icon tabindex="-1" /> -->
      </tooltip-ui>
    </label>
    <div class="form-wrapper__main">
      <div class="form-wrapper__element">
        <slot />
      </div>
      <p
        v-if="description"
        class="form-wrapper__description"
        v-html="description"
      />
      <p
        v-if="error"
        class="form-wrapper__description form-wrapper__description--error"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InfoIcon from '~/assets/images/icons/info.svg';

import TooltipUi from '../TooltipUi.vue';

export type FormWrapperProps = {
  formWrapperClass?: string;
  direction?: 'column' | 'row';
  label?: string | null;
  labelHint?: string | null;
  description?: string | null;
  error?: string | null;
  required?: boolean;
  /** включает место под label, если его нет */
  reserveLabelSpace?: boolean;
};

withDefaults(defineProps<FormWrapperProps>(), {
  formWrapperClass: '',
  direction: 'row',
  label: null,
  labelHint: null,
  description: null,
  error: null,
  required: false,
});

defineOptions({
  inheritAttrs: false,
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as textMixins;
@use '/assets/styles/components/form' as form;

.form-wrapper {
  gap: 16px;

  &,
  &__main {
    display: flex;
  }

  &.column {
    flex-direction: column;
    gap: 4px;
  }

  &.row {
    .form-wrapper__main {
      flex-direction: column;
      width: 100%;
    }

    &.with-label {
      display: grid;
      grid-template-columns: 2fr 8fr;

      .form-wrapper__label {
        min-height: form.$form-item-height;
      }
    }

    @media screen and (max-width: 992px) {
      display: flex !important;
      flex-direction: column;
      gap: 4px;
    }
  }

  &__label {
    @include textMixins.text-14;

    display: flex;
    align-items: center;
    align-self: baseline;
    gap: 4px;
    color: colors.$text;
    font-weight: 500;

    &--empty {
      visibility: hidden;
    }

    &-required {
      color: colors.$danger;
    }

    .tooltip-trigger {
      line-height: 12px;
    }

    svg {
      width: 14px;
      height: 14px;
    }

    // svg {
    //   color: colors.$text-tertiary;
    //   &:hover {
    //     color: colors.$text-primary;
    //   }
    // }

    // &--with-descr {
    //   margin-bottom: 4px;
    // }
  }

  &__main {
    gap: 4px;
  }

  &__element {
    width: 100%;
    margin: auto 0;
  }

  &__description {
    @include textMixins.text-12;

    font-weight: 500;
    color: colors.$text-light;

    &--error {
      color: colors.$danger;
      margin: 4px 0 0;
    }

    @media screen and (max-width: 768px) {
      font-size: 14px;
      line-height: 18px;
    }
  }
}
</style>
