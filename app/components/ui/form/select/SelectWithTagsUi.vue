<template>
  <form-wrapper-ui
    :label="label"
    :label-hint="labelHint"
    :description="description"
    :error="error"
    :required="required"
    :form-wrapper-class="formWrapperClass"
    :direction="direction"
  >
    <div class="select-with-tags">
      <div
        v-if="model && model.length"
        class="select-with-tags__tags">
        <div
          v-for="tag in visibleTags"
          :key="String(tag.value)"
          class="select-with-tags__tag"
        >
          <slot
            name="tag"
            :tag="tag">
            <span class="select-with-tags__tag-label">{{ tag.label }}</span>
          </slot>
          <button
            v-if="!isTagRemovable || isTagRemovable(tag)"
            type="button"
            class="select-with-tags__tag-remove"
            :disabled="selectProps?.disabled || selectProps?.readonly"
            @click="removeTag(tag)"
          >
            <x-icon />
          </button>
        </div>
        <button
          v-if="hasHiddenTags"
          type="button"
          class="select-with-tags__toggle-btn"
          @click="isTagsExpanded = !isTagsExpanded"
        >
          {{ isTagsExpanded ? 'Скрыть' : `Показать все (${model.length})` }}
        </button>
      </div>

      <select-ui
        v-model="internalValue"
        v-model:search-query="searchQuery"
        :options="options"
        :label-field="labelField"
        :value-field="valueField"
        :initial-option="initialOption"
        :initial-option-value-field="initialOptionValueField"
        :initial-option-label-field="initialOptionLabelField"
        :searchable="searchable"
        :clearable="clearable"
        :loading="loading"
        :autofocus="autofocus"
        :select-props="selectProps"
        :scrollbar-props="scrollbarProps"
        :after-confirm-mode="afterConfirmMode"
        :confirm-dialog-content="confirmDialogContent"
        :dropdown-list-class="dropdownListClass"
        :is-wide-dropdown="isWideDropdown"
        form-wrapper-class="select-with-tags__select"
        @update:model-value="onSelectChange"
        @reach-end="emit('reach-end')"
        @trigger-focusout="
          (ev, contains) => emit('triggerFocusout', ev, contains)
        "
        @trigger-keydown="(ev, visible) => emit('triggerKeydown', ev, visible)"
        @on-confirm="(val) => emit('onConfirm', val)"
      >
        <template
          v-if="$slots.option"
          #option="{ option }">
          <slot
            name="option"
            :option="option" />
        </template>
        <template
          v-if="$slots.dropdownFooter"
          #dropdownFooter>
          <slot name="dropdownFooter" />
        </template>
      </select-ui>
    </div>
  </form-wrapper-ui>
</template>

<script lang="ts" setup>
import XIcon from '@/assets/images/icons/x.svg';
import type { SelectOption } from '~/shared/types/ui/select.types';

import FormWrapperUi from '../FormWrapperUi.vue';
import type {
  SelectUiEmits,
  SelectUiModelType,
  SelectUiProps,
} from './SelectUi.vue';
import SelectUi from './SelectUi.vue';

type Props = Omit<SelectUiProps, 'isMultiple' | 'multipleMode'> & {
  isTagRemovable?: (tag: SelectOption) => boolean;
  allowDuplicates?: boolean;
  /** При включении будут скрыты `totalTagsCount - visibleTagsCount`-тэгов и отображена кнопка "Показать всё" */
  collapsibleTags?: boolean;
  visibleTagsCount?: number;
};

const props = withDefaults(defineProps<Props>(), {
  labelField: 'label',
  valueField: 'value',
  initialOption: undefined,
  initialOptionValueField: undefined,
  initialOptionLabelField: undefined,
  searchable: true,
  clearable: true,
  loading: false,
  autofocus: false,
  selectProps: () => ({}),
  scrollbarProps: () => ({ offset: 8, height: 250 }),
  confirmDialogContent: undefined,
  dropdownListClass: undefined,
  isWideDropdown: false,
  isTagRemovable: undefined,
  allowDuplicates: false,
  collapsibleTags: false,
  visibleTagsCount: 5,
});

const model = defineModel<SelectOption[] | null>({ default: null });
const searchQuery = defineModel<string | null>('searchQuery', {
  default: null,
});

const internalValue = ref<SelectUiModelType>(null);
const isTagsExpanded = ref(false);

const hasHiddenTags = computed(() => {
  return (
    props.collapsibleTags &&
    (model.value?.length ?? 0) > props.visibleTagsCount!
  );
});

const visibleTags = computed(() => {
  if (!model.value) return [];
  if (!hasHiddenTags.value || isTagsExpanded.value) return model.value;
  return model.value.slice(0, props.visibleTagsCount!);
});

const emit = defineEmits<
  SelectUiEmits & {
    (e: 'select', tag: SelectOption): void;
    (e: 'remove', tag: SelectOption): void;
  }
>();

const onSelectChange = (val: SelectUiModelType) => {
  if (val === null || val === undefined) return;

  const option = props.options.find((o) => o[props.valueField!] === val);
  if (!option) return;

  if (!props.allowDuplicates && model.value?.some((t) => t.value === val)) {
    internalValue.value = null;
    return;
  }

  const tag: SelectOption = {
    label: option[props.labelField!] as string,
    value: val as SelectOption['value'],
  };

  model.value = model.value ? [...model.value, tag] : [tag];
  emit('select', tag);

  nextTick(() => {
    internalValue.value = null;
  });
};

const removeTag = (tag: SelectOption) => {
  if (!model.value || props.selectProps?.readonly) return;

  const next = model.value.filter((t) => t.value !== tag.value);
  model.value = next.length ? next : null;
  emit('remove', tag);
};
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.form-wrapper.full {
  .select-with-tags__select {
    max-width: unset;
  }
}

.select-with-tags {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px 4px 10px;
    border-radius: 20px;
    border: 1px solid colors.$primary-light;
    background-color: rgba(99, 102, 241, 0.08);
    font-size: 13px;
    font-weight: 500;
    color: colors.$primary-dark;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: rgba(99, 102, 241, 0.14);
    }
  }

  &__tag-label {
    line-height: 1.4;
  }

  &__tag-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: colors.$primary-light;
    cursor: pointer;
    transition:
      color 0.15s ease,
      background-color 0.15s ease;

    svg {
      width: 8px;
      height: 8px;
    }

    &:hover:not(:disabled) {
      color: colors.$primary-dark;
      background-color: rgba(99, 102, 241, 0.18);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__toggle-btn {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 20px;
    border: 1px dashed colors.$primary-light;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    color: colors.$primary;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease;

    &:hover {
      background-color: rgba(99, 102, 241, 0.08);
      border-color: colors.$primary;
    }
  }

  &__select {
    max-width: 600px;
  }
}
</style>
