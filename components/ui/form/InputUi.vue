<template>
  <form-wrapper
    :label="label"
    :root-class-name="rootClassName"
    :error="error"
    :description="description">
    <div
      v-if="!inputProps?.isTextarea"
      class="input-ui__element-wrapper">
      <template v-if="$slots.preIcon">
        <div class="input-ui__element-icon">
          <slot name="preIcon" />
        </div>
      </template>
      <input
        v-model="model"
        class="input-ui__element"
        v-bind="inputProps"
        :class="{ 'input-ui__element--error': error, 'input-ui__element--with-preicon': $slots.preIcon }"
        @input="onInput"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
        @clear="onClear"
      >
      <button
        v-if="model && inputProps?.searchable"
        type="button"
        class="input-ui__element-clear"
        @click="model = null">
        <x-icon />
      </button>
    </div>
    <textarea
      v-else
      v-model="model"
      class="input-ui__element"
      v-bind="inputProps"
      :class="{ 'input-ui__element--error': error }"/>
  </form-wrapper>
</template>

<script lang="ts" setup>
import XIcon from '~/assets/images/icons/x-02.svg';
import type { TextareaHTMLAttributes, InputHTMLAttributes } from 'vue';
import FormWrapper, { type FormWrapperProps } from './FormWrapper.vue';

type Props = FormWrapperProps & {
  inputProps?: {
    searchable?: boolean;
    isTextarea?: boolean;
  } & InputHTMLAttributes & TextareaHTMLAttributes;
}

defineProps<Props>();

const model = defineModel<string | number | null>();

const emit = defineEmits(['blur', 'focus', 'change', 'input', 'clear']);

const onBlur = (event: FocusEvent): void => {
  emit('blur', event);
};

const onFocus = (event: FocusEvent): void => {
  emit('focus', event);
};

const onInput = (e: Event): void => {
  emit('input', (e.target as HTMLInputElement).value);
};

const onChange = (e: Event): void => {
  emit('change', (e.target as HTMLInputElement).value);
};

const onClear = (): void => {
  emit('clear');
};
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as mixins;

.input-ui {
  display: flex;
  flex-direction: column;

  &__label {
    margin: 0 0 offsets.$offset-8;
  }

  &__element-wrapper {
    position: relative;
  }

  &__element {
    width: 100%;
    border: 1px solid colors.$gray-300;
    background-color: colors.$white;
    border-radius: 12px;
    padding: 10px offsets.$offset-32 10px offsets.$offset-12;
    opacity: 1;
    transition: all 0.2s ease-in-out;

    @include mixins.text-14;

    &:hover {
      background-color: colors.$gray-100;
      border-color: colors.$gray-400;
    }

    &:focus {
      border-color: colors.$primary-normal;
    }

    &:active {
      background-color: colors.$gray-100;
      border-color: colors.$gray-300;
    }

    &::placeholder {
      color: colors.$gray-600;
    }

    &:disabled {
      background-color: colors.$gray-100;
      border-color: colors.$gray-300;
      color: colors.$gray-400;
    }

    &--error {
      border-color: colors.$danger-normal !important;
    }

    &--with-preicon {
      padding-left: 28px;
    }
  }

  &__element-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);

    img, svg {
      width: 12px;
      height: 12px;
    }
  }

  &__element-clear {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background-color: transparent;
    border: none;
    cursor: pointer;

    img, svg {
      width: 12px;
      height: 12px;
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