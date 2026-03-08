<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <form-wrapper
    :label="label"
    :form-wrapper-class="formWrapperClass"
    :error="error"
    :description="description"
    :label-hint="labelHint"
    :direction="direction"
    :required="required"
  >
    <div
      v-if="!inputProps?.isTextarea"
      class="input-ui__main">
      <div class="input-ui__element-wrapper">
        <template v-if="$slots.preIcon">
          <div class="input-ui__element-icon input-ui__element-icon--pre">
            <slot name="preIcon" />
          </div>
        </template>
        <template v-if="$slots.prepend">
          <div class="input-ui__prepend">
            <slot name="prepend" />
          </div>
        </template>
        <input
          ref="inputRef"
          v-model="model"
          v-focus
          class="input-ui__element"
          v-bind="inputProps"
          :class="{
            'input-ui__element--error': error || isError,
            'input-ui__element--with-preicon': $slots.preIcon,
            'input-ui__element--with-posticon': $slots.postIcon,
            'input-ui__element--clearable':
              clearable && isClearableButtonShowed,
          }"
          @input="onInput"
          @change="onChange"
          @focus="onFocus"
          @blur="onBlur"
          @clear="onClear"
          @keydown="onKeydown"
          @focusout="onFocusOut"
        />
        <template v-if="$slots.postIcon">
          <div
            class="input-ui__element-icon input-ui__element-icon--post"
            :class="{
              'input-ui__element-icon--clearable-showed':
                isClearableButtonShowed,
            }"
          >
            <slot name="postIcon" />
          </div>
        </template>
        <clear-field-button
          v-if="isClearableButtonShowed"
          class="input-ui__element-clear"
          :class="{
            'input-ui__element-clear--with-posticon': $slots.postIcon,
          }"
          :disabled="inputProps.disabled"
          @click="clearInput"
        />
      </div>

      <template v-if="$slots.append">
        <div class="input-ui__append">
          <slot name="append" />
        </div>
      </template>
    </div>
    <textarea
      v-else
      v-model="model"
      class="input-ui__element"
      v-bind="inputProps"
      :class="{ 'input-ui__element--error': error }"
    />
  </form-wrapper>
</template>

<script lang="ts" setup>
import { isDefined } from '@vueuse/core';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'vue';

import ClearFieldButton from './ClearFieldButtonUi.vue';
import FormWrapper, { type FormWrapperProps } from './FormWrapperUi.vue';

export type InputUiProps = FormWrapperProps & {
  clearable?: boolean;
  autofocus?: boolean;
  resetToValue?: string | number | null;
  isError?: boolean;
  inputProps?: {
    isTextarea?: boolean;
  } & InputHTMLAttributes &
    TextareaHTMLAttributes;
};

const inputRef = ref<HTMLInputElement | null>(null);

const model = defineModel<string | number | null>();

const props = withDefaults(defineProps<InputUiProps>(), {
  clearable: true,
  autofocus: false,
  resetToValue: null,
  inputProps: () => ({
    isTextarea: false,
    placeholder: 'Введите текст',
  }),
});

const emit = defineEmits([
  'blur',
  'focus',
  'change',
  'input',
  'clear',
  'keydown',
  'clearButtonClick',
  'focusout',
]);

const onBlur = (event: FocusEvent): void => {
  emit('blur', event);
};

const customIsDefined = (value: unknown) => isDefined(value) && value !== '';
const isClearableButtonShowed = computed(() => {
  return (
    customIsDefined(model.value) &&
    props.clearable &&
    !props.inputProps.readonly
  );
});

const onFocus = (event: FocusEvent): void => {
  emit('focus', event);
};

const onInput = (e: Event): void => {
  const input = e.target as HTMLInputElement;
  emit('input', input.value);
};

const onChange = (e: Event): void => {
  emit('change', (e.target as HTMLInputElement).value);
};

const onClear = (): void => {
  emit('clear');
};

const onKeydown = (e: KeyboardEvent): void => {
  emit('keydown', e);
};

const onFocusOut = (e: FocusEvent) => {
  emit('focusout', e);
};

const clearInput = async () => {
  model.value = props.resetToValue ?? null;
  await nextTick();
  inputRef.value?.focus();
  emit('clearButtonClick');
};

const vFocus = {
  mounted: (el: HTMLInputElement) => {
    if (!props.autofocus) return;
    el.focus();
  },
};
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/components/form' as form;
@use '/assets/styles/mixins/text' as mixins;

.input-ui {
  display: flex;
  flex-direction: column;

  &__label {
    margin: 0 0 8px;
  }

  &__main {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__element-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    vertical-align: middle;
    position: relative;
    width: 100%;
    height: 100%;
  }

  &__element {
    width: 100%;
    height: 100%;
    outline: none;
    border: form.$form-item-border-width solid form.$form-item-border-color;
    border-radius: 6px;
    padding: 0.5em 0.625em;
    min-height: form.$form-item-height;
    color: colors.$text;
    opacity: 1;
    transition:
      border-color 0.2s ease-in-out,
      color 0.2s ease-in-out,
      background-color 0.2s ease-in-out;

    @include mixins.text-14;

    &::placeholder {
      color: colors.$text-light;
      transition: color 0.15s ease-in-out;
    }

    &:hover {
      border-color: colors.$primary-active;
    }

    &:focus {
      border-color: colors.$primary;

      .input-ui__element-icon {
        color: colors.$primary;
      }
    }

    &:active {
      border-color: colors.$primary;
    }

    &--clearable {
      padding: 0.5em 2.5em 0.5em 0.625em;
    }

    &:disabled {
      background-color: form.$form-item-disabled-background-color;
      border-color: form.$form-item-disabled-border-color;
      cursor: not-allowed;

      &,
      &::placeholder {
        color: form.$form-item-disabled-color;
      }
    }

    &:read-only {
      cursor: default;
    }

    &--error {
      border-color: colors.$danger !important;
    }

    &--with-preicon {
      padding-left: 28px;
    }

    &--with-posticon {
      padding-right: 28px;
    }
  }

  &__element-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: colors.$border;

    img,
    svg {
      width: 12px;
      height: 12px;
    }

    &--pre {
      left: 10px;
    }

    &--post {
      right: 10px;

      &.input-ui__element-icon--clearable-showed {
        right: 35px;
      }
    }
  }

  &__prepend {
    border: form.$form-item-border-width solid form.$form-item-border-color;
    border-radius: 6px 0 0 6px;
    padding: 0.5em 0.625em;
    border-right: 0 !important;

    @include mixins.text-14;

    & + .input-ui__element {
      border-radius: 0 6px 6px 0 !important;
    }
  }

  // &__element-clear {
  //   &--with-posticon {
  //     right: 28px;
  //   }
  // }

  textarea.input-ui__element {
    resize: vertical;
  }
}
</style>
