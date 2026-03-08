<template>
  <label
    class="radio-ui"
    :class="{
      'radio-ui--checked': isChecked,
      'radio-ui--disabled': disabled,
    }"
  >
    <input
      type="radio"
      class="radio-ui__input"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
    >

    <span class="radio-ui__control" />

    <span
      v-if="label"
      class="radio-ui__label">
      {{ label }}
    </span>
  </label>
</template>

<script lang="ts" setup>
type Model = string | number | boolean | null;
type Props = {
  value: Model;
  label?: string;
  disabled?: boolean;
};

const props = defineProps<Props>();
const model = defineModel<Model>();

const isChecked = computed(() => model.value === props.value);

const onChange = () => {
  if (props.disabled) return;
  model.value = props.value;
};
</script>

<style lang="scss">
.radio-ui {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  cursor: pointer;
  user-select: none;

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__input {
    display: none;
  }

  &__control {
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-border, #c0c0c0);
    border-radius: 50%;
    position: relative;
    box-sizing: border-box;
  }

  &--checked &__control {
    border-color: var(--color-primary, #409eff);
  }

  &--checked &__control::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: var(--color-primary, #409eff);
  }

  &__label {
    font-size: 14px;
    line-height: 1.2;
  }
}
</style>
