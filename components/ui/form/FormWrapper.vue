<template>
  <div :class="['form-wrapper', rootClassName]">
    <label
      v-if="label"
      class="form-wrapper__label text-14 weight-500">{{ label }}</label>
    <slot />
    <p
      v-if="description"
      class="form-wrapper__description text-10">{{ description }}</p>
    <transition name="fade">
      <p
        v-if="error"
        class="form-wrapper__description form-wrapper__description--error text-10">{{ error }}</p>
    </transition>
  </div>
</template>

<script lang="ts" setup>
export type FormWrapperProps = {
  rootClassName?: string;
  label?: string;
  description?: string;
  error?: string;
}

defineProps<FormWrapperProps>();
defineOptions({
  inheritAttrs: false
});
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as mixins;

.form-wrapper {
  display: flex;
  flex-direction: column;

  &__label {
    margin: 0 0 offsets.$offset-8;
  }

  &__element {
    border: 1px solid colors.$gray-300;
    background-color: colors.$white;
    border-radius: 12px;
    padding: 10px offsets.$offset-12;
    opacity: 1;
    transition: border-color 0.3s ease-in-out, opacity 0.3s ease-in-out;

    @include mixins.text-14;

    &::placeholder {
      color: colors.$gray-600;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &--error {
      border-color: colors.$danger-normal;
    }
  }

  textarea.input-ui__element {
    resize: vertical;
  }

  &__description {
    margin: 2px 0 0;
    color: colors.$gray-600;

    &--error {
      color: colors.$danger-normal;
    }
  }
}
</style>