<template>
  <form-wrapper v-bind="props">
    <div class="switch-ui">
      <button
        type="button"
        class="switch"
        :class="{
          'switch--active': model,
          'switch--disabled': switchProps?.disabled,
        }"
        :disabled="switchProps?.disabled"
        @click="toggle"
      >
        <span class="switch__knob" />
      </button>

      <p
        v-if="withLabel"
        class="switch-ui__label">
        {{ model ? enabledLabel : disabledLabel }}
      </p>
    </div>
  </form-wrapper>
</template>

<script lang="ts" setup>
import FormWrapper, { type FormWrapperProps } from './FormWrapperUi.vue';

const model = defineModel<boolean | null>();
const emit = defineEmits<{
  (e: 'change', value: boolean | null): void;
}>();

type Props = FormWrapperProps & {
  enabledLabel?: string;
  disabledLabel?: string;
  withLabel?: boolean;
  switchProps?: {
    disabled?: boolean;
  };
};

const props = withDefaults(defineProps<Props>(), {
  enabledLabel: 'Включен',
  disabledLabel: 'Выключен',
  withLabel: false,
  switchProps: undefined,
});

const toggle = () => {
  if (props.switchProps?.disabled) return;

  model.value = !model.value;
  emit('change', model.value);
};
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as textMixins;

.switch-ui {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;

  &__label {
    @include textMixins.text-12;
    font-weight: 500;
    color: colors.$text;
  }
}

.switch {
  width: 46px;
  height: 25px;
  padding: 2px;
  border-radius: 100px;
  background-color: transparent;
  border: 1px solid colors.$text-light;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease;

  &__knob {
    width: 21px;
    height: 21px;
    border-radius: 50%;
    background-color: colors.$text-light;
    position: absolute;
    top: 1px;
    left: 2px;
    transition: transform 0.2s ease;
  }

  &--active {
    border-color: #7678f2;

    .switch__knob {
      background-color: #7678f2;
      transform: translateX(19px);
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
