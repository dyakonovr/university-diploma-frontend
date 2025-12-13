<template>
  <form-wrapper
    :label="label"
    :root-class-name="rootClassName"
    :error="error"
    :description="description">
    <div
      ref="selectRef"
      class="select-ui"
      :class="{ 'select-ui--disabled': selectProps?.disabled, 'active': dropdownVisible, 'select-ui--error': error }">
      <div
        class="select-ui__trigger text-14"
        @click="toggleDropdown"
        @keydown="toggleDropdown">
        {{ currentLabel }}
        <span
          class="select-ui__arrow"
          :class="{ 'open': dropdownVisible }"><chevron-down-icon /></span>
      </div>
      <transition name="dropdown-fade">
        <ul
          v-show="dropdownVisible"
          class="select-ui__list list-reset">
          <scrollbar-ui>
            <button
              v-for="item in options"
              :key="String(item[valueField])"
              type="button"
              :class="{ 'select-ui__list-item text-14': true, picked: item[valueField] === model }"
              @click="selectItem(item)">{{ item[labelField] }}</button>
          </scrollbar-ui>
        </ul>
      </transition>
    </div>
  </form-wrapper>
</template>

<script lang="ts" setup>
import ChevronDownIcon from '~/assets/images/icons/chevron-down.svg';
import FormWrapper, { type FormWrapperProps } from '../FormWrapper.vue';
import ScrollbarUi from './ScrollbarUi.vue';
import { onClickOutside } from '@vueuse/core';

const model = defineModel<string | number | null>();
const dropdownVisible = ref(false);

type OptionsRecordValue =
  | string
  | number;
type OptionsRecord = Record<string, OptionsRecordValue>;

type Props = FormWrapperProps & {
  // TODO: сделать обработку массива строк
  options: OptionsRecord[],
  labelField?: string,
  valueField?: string,
  selectProps?: { disabled?: boolean }
}

const props = withDefaults(defineProps<Props>(), {
  labelField: 'label',
  valueField: 'value',
  selectProps: undefined
});

// Вычисляемое свойство для текущего отображаемого значения
const currentLabel = computed(() => {
  if (!model.value) return 'Выбрать';
  
  const selectedItem = props.options.find(item => item[props.valueField] === model.value);
  return selectedItem ? selectedItem[props.labelField] : 'Выбрать';
});

const toggleDropdown = () => {
  if (props.selectProps?.disabled) return;
  dropdownVisible.value = !dropdownVisible.value;
};

const selectItem = (item: OptionsRecord) => {
  model.value = (item[props.valueField] ?? null) as string | number | null;
  dropdownVisible.value = false;
};

const selectRef = ref<HTMLElement | null>(null);

onClickOutside(selectRef, () => {
  dropdownVisible.value = false;
});
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.select-ui {
  position: relative;
  border: 1px solid colors.$gray-300;
  border-radius: 12px;
  background: colors.$white;
  transition: all 0.2s ease-in-out;

  &.active {
    border-color: colors.$primary-normal;
  }

  &--disabled {
    background-color: colors.$gray-100;
    color: colors.$gray-400;
    
    .select-ui__trigger {
      cursor: not-allowed;
    }
  }

  &__trigger {
    padding: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.3s ease;
    user-select: none;
  }

  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
    stroke: colors.$black;

    &.open {
      transform: rotate(180deg);
    }
  }

  &__list {
    position: absolute;
    width: 100%;
    list-style: none;
    margin: 0;
    padding: offsets.$offset-8 0 offsets.$offset-8 offsets.$offset-8;
    top: calc(100% + 1px);
    border-bottom: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background: #fff;
    z-index: 10;
    border-radius: 12px;
    scrollbar-color: colors.$gray-200;
  }

  &__list-item {
    width: 100%;
    padding: 10px;
    cursor: pointer;
    text-align: start;
    user-select: none;
    color: colors.$gray-700;
    border-radius: 8px;

    &.picked,
    &:hover {
      color: colors.$gray-900;
      background-color: colors.$gray-100;
    }
  }

  &--error {
    border-color: colors.$danger-normal;
  }
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
}
</style>