<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <!-- <custom-tooltip
    :content="placeholder"
    :disabled="!isTextTruncated"
    :trigger-keys="[]"
    :trigger="['focus', 'hover']"
  > -->
  <div
    ref="triggerRoot"
    class="select-ui__trigger"
    :tabindex="disabled ? -1 : 0"
    @click="onToggle"
    @focusout="onFocusOut"
  >
    <template v-if="dropdownVisible && searchable">
      <!-- <search-icon class="select-ui__search-icon" /> -->
      <input
        ref="searchInputRef"
        v-model="searchQuery"
        class="select-ui__search"
        type="text"
        :placeholder="(placeholder || '').toString()"
        :readonly="disabled || readonly"
        @click.stop
        @keydown.escape.stop="onClose"
      >
    </template>

    <template v-else>
      <p
        v-if="
          multipleMode === 'default' ||
            !customIsDefined(model) ||
            (Array.isArray(model) && !model.length)
        "
        class="select-ui__placeholder"
        :class="{
          'select-ui__placeholder--with-clearable':
            clearable && customIsDefined(model),
          'select-ui__placeholder--slot':
            $slots.selected && customIsDefined(model),
        }"
      >
        <slot
          v-if="!isMultiple && customIsDefined(model)"
          name="selected"
          :value="model">
          {{ placeholder }}
        </slot>
        <span
          v-else-if="isMultiple && Array.isArray(model) && model.length && $slots.selected"
          class="select-ui__selected-multiple">
          <slot
            v-for="val in model"
            :key="String(val)"
            name="selected"
            :value="val" />
        </span>
        <template v-else>{{ placeholder }}</template>
      </p>

      <div
        v-else-if="isMultiple && multipleMode === 'tags'"
        class="select-ui__tags"
      >
        <div
          v-for="tag in multipleTags"
          :key="tag.label"
          class="select-ui__tag"
        >
          {{ tag.label }}

          <clear-field-button-ui
            v-if="!readonly"
            @click.stop="emit('deleteTagButtonClick', tag)"
          />
        </div>
      </div>

      <span
        v-show="!isFieldClearButtonShowed"
        class="select-ui__arrow"
        :class="{ open: dropdownVisible }"
      >
        <chevron-down-filled-icon />
      </span>
    </template>

    <clear-field-button-ui
      v-if="isFieldClearButtonShowed"
      class="select-ui__element-clear"
      :disabled="disabled"
      @click.stop.prevent="onFieldClear"
      @keydown.enter.stop.prevent="onFieldClear"
    />
  </div>
  <!-- </custom-tooltip> -->
</template>

<script lang="ts" setup>
import { isDefined } from '@vueuse/core';

import ChevronDownFilledIcon from '@/assets/images/icons/chevron-down.svg';

import ClearFieldButtonUi from '../ClearFieldButtonUi.vue';
import type {
  SelectUiModelType,
  SelectUiMultipleMode,
  SelectUiMultipleTag,
} from './SelectUi.vue';

type Props = {
  placeholder: string;
  model: SelectUiModelType;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  dropdownVisible?: boolean;
  isMultiple?: boolean;
  multipleMode?: SelectUiMultipleMode;
  multipleTags: SelectUiMultipleTag[];
};

const props = withDefaults(defineProps<Props>(), {
  multipleMode: 'default',
});
const emit = defineEmits<{
  (e: 'field-clear' | 'close' | 'toggle'): void;
  (e: 'update:searchQuery', value: string | null): void;
  (e: 'triggerFocusout', ev: FocusEvent): void;
  (e: 'deleteTagButtonClick', tag: SelectUiMultipleTag): void;
}>();

const searchInputRef = ref<HTMLInputElement | null>(null);
const triggerRoot = ref<HTMLElement | null>(null);

const searchQuery = defineModel<string | null>('searchQuery', {
  default: null,
});

const isTextTruncated = ref(false);

const checkTruncation = async () => {
  await nextTick();

  const el = triggerRoot.value?.querySelector('.select-ui__placeholder');
  if (!el) return;

  const style = getComputedStyle(el);

  // создаём невидимый измеряющий элемент
  const measure = document.createElement('span');
  measure.style.position = 'absolute';
  measure.style.visibility = 'hidden';
  measure.style.whiteSpace = 'nowrap';
  measure.style.font = style.font;
  measure.textContent = el.textContent ?? '';

  document.body.appendChild(measure);

  isTextTruncated.value = measure.clientWidth > el.clientWidth;

  document.body.removeChild(measure);
};

// Watch for model changes and also window resize
watch(() => props.model, checkTruncation, { immediate: true });
watch(() => props.placeholder, checkTruncation); // Also watch placeholder changes

const customIsDefined = (value: SelectUiModelType) => {
  if (props.isMultiple && Array.isArray(value)) return isDefined(value) && !!value.length;
  return isDefined(value) && value !== '';
};

const isFieldClearButtonShowed = computed(
  () =>
    !props.readonly &&
    ((props.dropdownVisible && props.searchable && !!searchQuery.value) ||
      (customIsDefined(props.model) && props.clearable)),
);

const onToggle = () => {
  if (props.disabled || props.readonly) return;
  emit('toggle');
};

const onFieldClear = async () => {
  if (props.searchable && searchQuery.value) {
    searchQuery.value = null;
    await nextTick();
    searchInputRef.value?.focus();
  } else {
    emit('field-clear');
  }
};

const onFocusOut = (event: FocusEvent) => {
  emit('triggerFocusout', event);
};

const focus = async () => {
  await nextTick();
  triggerRoot.value?.focus();
};

const focusInput = async () => {
  await nextTick();
  searchInputRef.value?.focus();
};

const onClose = () => emit('close');

defineExpose({
  focus,
  focusInput,
});
</script>
