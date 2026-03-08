<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <form-wrapper
    :label="label"
    :label-hint="labelHint"
    :description="description"
    :error="error"
    :form-wrapper-class="formWrapperClass"
    :direction="direction"
    :required="required"
  >
    <div
      ref="selectRef"
      class="select-ui"
      :class="{
        'select-ui--disabled': selectProps?.disabled,
        'select-ui--readonly': selectProps?.readonly,
        'select-ui--error': error,
        'select-ui--active': dropdownVisible,
        'select-ui--filled': customIsDefined(model) || dropdownVisible,
      }"
      @keydown="handleKeydown"
    >
      <select-ui-trigger
        ref="triggerRef"
        :placeholder="placeholder"
        :searchable="searchable"
        :clearable="clearable"
        :disabled="selectProps?.disabled"
        :readonly="selectProps?.readonly"
        :dropdown-visible="dropdownVisible"
        :model="model"
        :is-multiple="isMultiple"
        :search-query="searchQuery"
        :multiple-mode="multipleMode"
        :multiple-tags="multipleTags"
        @toggle="toggleDropdown"
        @update:search-query="(val) => (searchQuery = val)"
        @field-clear="fieldClearButtonClick"
        @trigger-focusout="handleTriggerFocusout"
        @close="closeDropdown"
        @delete-tag-button-click="onDeleteTagButtonClick"
      >
        <template
          v-if="$slots.selected"
          #selected="{ value }">
          <slot
            name="selected"
            :value="value" />
        </template>
      </select-ui-trigger>

      <select-ui-dropdown
        ref="dropdownCompRef"
        :visible="dropdownVisible"
        :options="options"
        :loading="loading"
        :value-field="valueField"
        :label-field="labelField"
        :is-multiple="isMultiple"
        :model="model"
        :styles="dropdownStyles"
        :scrollbar-props="scrollbarProps"
        :el-class="dropdownListClass"
        @select="selectItem"
        @reach-end="handleReachEnd"
        @focusout="handleFocusOut"
        @keydown="handleKeydown"
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
      </select-ui-dropdown>
    </div>
  </form-wrapper>

  <!-- <el-dialog
    v-if="afterConfirmMode && confirmDialogContent"
    v-model="confirmVisible"
    width="30%"
    align-center
    :title="confirmDialogContent.title"
  >
    <p v-html="confirmDialogContent.message" />
    <template #footer>
      <div class="flex gap-2 items-center justify-end">
        <el-button @click="onCancel">{{ confirmDialogContent.cancelButtonText }}</el-button>
        <el-button
          type="success"
          @click="onConfirm">{{ confirmDialogContent.confirmButtonText }}</el-button>
      </div>
    </template>
  </el-dialog> -->
</template>

<script lang="ts" setup>
import {
  isDefined,
  onClickOutside,
  useDebounceFn,
  useElementBounding,
} from '@vueuse/core';
import { computed, type CSSProperties, nextTick, ref, watch } from 'vue';

import FormWrapper, { type FormWrapperProps } from '../FormWrapperUi.vue';
import type { CustomScrollProps } from '../ScrollbarUi.vue';
import SelectUiDropdown from './SelectUiDropdown.vue';
import SelectUiTrigger from './SelectUiTrigger.vue';

export type OptionsRecordValue = string | number | unknown;
export type OptionsRecord = Record<string, OptionsRecordValue>;
export type SelectUiMultipleMode = 'default' | 'tags';

/**
 * Пропсы компонента `SelectUi`.
 *
 * @example
 * <select-ui
 *   v-model="selectedId"
 *   v-model:search-query="search"
 *   :options="options"
 *   :searchable="true"
 *   :clearable="true"
 *   label="Выберите значение"
 *   @reach-end="loadMore"
 * />
 */
export type SelectUiProps = {
  isMultiple?: boolean;
  multipleMode?: SelectUiMultipleMode;

  options: OptionsRecord[];
  labelField?: string;
  valueField?: string;
  /**
   * `initialOption` нужна для тех случаев, если список может
   * быть огромным и текущее значение может не прийти в ответе сервера
   * (значение находится на последней "странице" данных).
   */
  initialOption?: OptionsRecord | null;
  initialOptionValueField?: string | null;
  initialOptionLabelField?: string | null;

  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  autofocus?: boolean;

  selectProps?: { disabled?: boolean; readonly?: boolean; placeholder?: string };
  scrollbarProps?: CustomScrollProps;

  afterConfirmMode?: boolean;
  confirmDialogContent?: {
    title: string;
    message: string;
    cancelButtonText: string;
    confirmButtonText: string;
  };

  dropdownListClass?: string;
  /** Опция которая позволяет растягиваться `dropdown` шире, чем триггер */
  isWideDropdown?: boolean;
} & FormWrapperProps;

const props = withDefaults(defineProps<SelectUiProps>(), {
  isMultiple: false,
  multipleMode: 'default',
  labelField: 'label',
  valueField: 'value',
  initialOption: undefined,
  initialOptionLabelField: undefined,
  initialOptionValueField: undefined,
  searchable: true,
  loading: false,
  clearable: true,
  selectProps: () => ({}),
  scrollbarProps: () => ({ offset: 8, height: 250 }),
  confirmDialogContent: undefined,
  dropdownListClass: undefined,
  isWideDropdown: false,
});

const searchQuery = defineModel<string | null>('searchQuery', {
  default: null,
});

const selectRef = ref<HTMLElement | null>(null);
const triggerRef = ref<InstanceType<typeof SelectUiTrigger> | null>(null);
const dropdownCompRef = ref<InstanceType<typeof SelectUiDropdown> | null>(null);

const triggerRect = useElementBounding(selectRef);

const emptyPlaceholder = computed(
  () => props.selectProps?.placeholder ?? 'Выбрать',
);

export type SelectUiModelType =
  | OptionsRecordValue
  | OptionsRecordValue[]
  | undefined
  | null;
const model = defineModel<SelectUiModelType>({ required: true });
const dropdownVisible = ref(false);
const dropdownDirection = ref<'top' | 'bottom'>('bottom');

const customIsDefined = (value: unknown) => isDefined(value) && value !== '';

export type SelectUiEmits = {
  (e: 'reach-end'): void;
  (
    e: 'triggerFocusout',
    event: FocusEvent,
    isSelectContainsFocusedEl: boolean,
  ): void;
  (e: 'triggerKeydown', event: KeyboardEvent, isDropdownVisible: boolean): void;
  (e: 'onConfirm', value: SelectUiModelType): void;
};

const emit = defineEmits<SelectUiEmits>();

const focusSearchInput = async () => {
  if (!props.searchable) return;
  await nextTick();
  triggerRef.value?.focusInput();
};

const clearSearchInput = () => {
  searchQuery.value = null;
  focusSearchInput();
};

const fieldClearButtonClick = async () => {
  if (props.selectProps?.readonly) return;
  if (props.searchable && searchQuery.value) clearSearchInput();
  else model.value = null;

  await nextTick();
  triggerRef.value?.focus();
};

const handleReachEnd = async () => {
  if (!props.selectProps?.disabled) {
    emit('reach-end');
  }
};

const measureDropdownHeight = () => {
  return dropdownCompRef.value?.measureHeight?.() ?? 0;
};

/**
 * Вычисляемые стили для позиционирования dropdown (fixed position).
 * Автоматически определяет направление (top/bottom) и корректирует позицию,
 * чтобы dropdown не выходил за границы viewport.
 */
const dropdownStyles = computed<CSSProperties>(() => {
  const rectTop = triggerRect.top.value + window?.scrollY;
  const rectBottom = triggerRect.bottom.value + window?.scrollY;
  const rectLeft = triggerRect.left.value + window?.scrollX;
  const dropdownHeight = measureDropdownHeight();

  // Рассчитываем ширину dropdown
  const widthMultiplier = props.isWideDropdown ? 2 : 1;
  const dropdownWidth = (triggerRect.width.value + 4) * widthMultiplier;

  // Получаем размеры окна
  const windowWidth = window?.innerWidth;
  const windowHeight = window?.innerHeight;

  // Определяем направление открытия (top/bottom)
  const spaceBelow = windowHeight - rectBottom;
  const spaceAbove = rectTop;

  dropdownDirection.value =
    spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove ? 'bottom' : 'top';

  // Рассчитываем позицию по вертикали
  const top =
    dropdownDirection.value === 'bottom'
      ? rectBottom + 2
      : Math.max(2, rectTop - dropdownHeight - 2);

  // Рассчитываем позицию по горизонтали с учетом границ экрана
  let left = rectLeft;
  const maxLeft = windowWidth - dropdownWidth - 10; // 10px отступ от края

  if (left > maxLeft) {
    left = Math.max(10, maxLeft); // Не меньше 10px от левого края
  }

  // Ограничиваем максимальную ширину, чтобы не выходила за экран
  const maxDropdownWidth = windowWidth - left - 10;
  const actualWidth = Math.min(dropdownWidth, maxDropdownWidth);

  return {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    minWidth: 'unset',
    width: '100%',
    maxWidth: `${actualWidth}px`,
    zIndex: 9999, // Убедитесь, что dropdown поверх других элементов
  };
});

const getMultipleSelectPlaceholder = (): string => {
  if (
    !Array.isArray(model.value) ||
    !customIsDefined(model.value) ||
    !props.isMultiple
  )
    return emptyPlaceholder.value;

  const el = props.options.find(
    (op) => op[props.valueField] === (model.value as OptionsRecordValue[])![0],
  );
  if (!el) return emptyPlaceholder.value;

  if (Array.isArray(model.value) && model.value.length < 2) {
    return (el[props.labelField] as string) ?? '';
  }

  return Array.isArray(model.value)
    ? `${el[props.labelField]}, +${model.value.length - 1}`
    : emptyPlaceholder.value;
};

const placeholder = computed<string>(() => {
  if (!customIsDefined(model.value)) return emptyPlaceholder.value;

  if (
    !props.isMultiple &&
    props.initialOption &&
    props.initialOption[props.initialOptionValueField ?? props.valueField] ===
      model.value
  ) {
    return props.initialOption[
      props.initialOptionLabelField ?? props.labelField
    ] as string;
  }

  if (!props.isMultiple) {
    const option = props.options.find(
      (el) => el[props.valueField] === model.value,
    );
    if (!option) return (model.value as string) ?? '';
    return option[props.labelField] as string;
  }

  return getMultipleSelectPlaceholder();
});

export type SelectUiMultipleTag = { label: string; value: SelectUiModelType };
const multipleTags = computed<SelectUiMultipleTag[]>(() => {
  if (
    !props.isMultiple ||
    props.multipleMode !== 'tags' ||
    !model.value ||
    !Array.isArray(model.value)
  )
    return [];

  const selectedOptions = props.options.filter((o) =>
    (model.value as SelectUiModelType[])?.includes(o[props.valueField]),
  );
  return selectedOptions.map((o) => ({
    label: o[props.labelField] as string,
    value: o[props.valueField] as SelectUiModelType,
  }));
});

const onDeleteTagButtonClick = (tag: SelectUiMultipleTag) => {
  if (props.selectProps?.readonly) return;
  if (
    !props.isMultiple ||
    props.multipleMode !== 'tags' ||
    !model.value ||
    !Array.isArray(model.value)
  )
    return;

  const neededTagIdx = model.value.findIndex((v) => v === tag.value);
  if (neededTagIdx < 0) return;

  model.value.splice(neededTagIdx, 1);
};

// CONFIRM LOGIC
const confirmVisible = ref(false);
const pendingValue = ref<SelectUiModelType>(null);
const internalValue = ref<SelectUiModelType>(model.value);

const shouldShowConfirmDialog = (newValue: SelectUiModelType): boolean => {
  // Если новое значение пустое (null/undefined/'') - не показываем диалог
  if (!customIsDefined(newValue)) return false;

  if (!customIsDefined(model.value) && customIsDefined(newValue)) return false;

  // Если значения совпадают - не показываем диалог
  if (newValue === model.value) return false;

  // Если это массивы, сравниваем их содержимое
  // if (Array.isArray(newValue) && Array.isArray(model.value)) {
  //   if (newValue.length === model.value.length &&
  //       newValue.every((val, idx) => val === model.value![idx])) {
  //     return false;
  //   }
  // }

  return true;
};

const onChange = (value: OptionsRecord) => {
  const newValue = value[props.valueField];

  if (props.afterConfirmMode && shouldShowConfirmDialog(newValue)) {
    pendingValue.value = newValue;
    confirmVisible.value = true;
    internalValue.value = model.value; // сохраняем текущее значение
  } else {
    // Если режим подтверждения выключен, значение пустое (сейчас или было до этого) - применяем сразу
    model.value = newValue;
    if (!props.isMultiple) {
      dropdownVisible.value = false;
    }
  }
};

const onConfirm = () => {
  if (pendingValue.value !== null) {
    model.value = pendingValue.value;
  }
  confirmVisible.value = false;
  emit('onConfirm', pendingValue.value);
  pendingValue.value = null;
  selectRef.value?.blur();
};

const onCancel = () => {
  confirmVisible.value = false;
  pendingValue.value = null;
  // Возвращаем предыдущее значение
  model.value = internalValue.value;
  selectRef.value?.blur();
};
// CONFIRM LOGIC END

/**
 * Обработчик выбора элемента из dropdown.
 * Поддерживает одиночный выбор (с/без confirm-диалога) и множественный.
 */
const selectItem = (item: OptionsRecord) => {
  if (!props.isMultiple && !props.afterConfirmMode) {
    dropdownVisible.value = false;
    model.value = item[props.valueField];
  } else if (!props.isMultiple && props.afterConfirmMode) {
    onChange(item);
  } else if (Array.isArray(model.value) || !isDefined(model.value)) {
    const value = item[props.valueField];
    let result = (!isDefined(model.value) ? model.value : [...model.value]) as
      | SelectUiModelType[]
      | null;
    if (value) {
      if (result?.includes(value))
        result =
          result.length === 1 ? null : result.filter((el) => el !== value);
      else if (model.value === null) result = [value];
      else result?.push(value);
    }
    model.value = result;
  }
};

/**
 * Переключает видимость dropdown и фокусирует поисковое поле при открытии.
 * @param skipFocusSearch — если true, не фокусировать search-поле (при открытии стрелками фокус идёт на опцию)
 */
const toggleDropdown = async (skipFocusSearch = false) => {
  if (props.selectProps?.disabled || props.selectProps?.readonly) return;

  if (!dropdownVisible.value && selectRef.value) {
    const rect = selectRef.value.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    dropdownDirection.value =
      spaceBelow < measureDropdownHeight() && spaceAbove > spaceBelow
        ? 'top'
        : 'bottom';
  }

  dropdownVisible.value = !dropdownVisible.value;

  if (dropdownVisible.value && props.searchable && !skipFocusSearch) {
    // if (searchQuery.value) clearSearchInput();
    focusSearchInput();
  }
};

/**
 * Enter: если dropdown открыт — выбирает активный элемент и закрывает,
 * если закрыт — открывает dropdown.
 */
const handleEnter = (e: KeyboardEvent) => {
  e.preventDefault();

  if (dropdownVisible.value) {
    dropdownCompRef.value?.handleEnter?.();
    dropdownVisible.value = false;
    triggerRef.value?.focus();
  } else {
    toggleDropdown();
  }
};

/** Space: открывает dropdown, если он закрыт (не срабатывает при вводе в search). */
const handleSpace = (e: KeyboardEvent) => {
  // Не перехватываем Space при вводе в поисковое поле
  if (dropdownVisible.value && props.searchable) return;

  e.preventDefault();
  if (!dropdownVisible.value) {
    toggleDropdown();
  }
};

/** ArrowUp/ArrowDown: открывает dropdown (если закрыт) и навигирует по опциям. */
const handleArrowClick = async (e: KeyboardEvent, type: 'up' | 'down') => {
  e.preventDefault();

  if (!dropdownVisible.value) {
    await toggleDropdown(true);
    await nextTick();
  }

  if (props.options.length === 0 || props.loading) return;

  await dropdownCompRef.value?.handleArrow?.(type);
};

/** Закрывает dropdown и возвращает фокус на trigger. */
const closeDropdown = async () => {
  dropdownVisible.value = false;
  await nextTick();
  const el = selectRef.value?.querySelector(
    '.select-ui__trigger',
  ) as HTMLElement | null;
  el?.focus();
};

/** Escape: закрывает dropdown. */
const handleEscape = async () => {
  closeDropdown();
};

/**
 * Backspace: очищает значение модели.
 * Игнорируется, если dropdown открыт и активен поиск (чтобы не сбрасывать
 * значение при удалении символов из поисковой строки).
 */
const handleBackspace = () => {
  if (dropdownVisible.value && props.searchable) return;
  model.value = null;
};

/**
 * Tab: при открытом dropdown закрывает его и переводит фокус
 * на следующий tabbable элемент после select.
 */
const handleTriggerTab = (e: KeyboardEvent) => {
  if (dropdownVisible.value) {
    const dropdownButtons =
      dropdownCompRef.value?.dropdownEl?.querySelectorAll('button');
    const lastButton = dropdownButtons?.[dropdownButtons.length - 1] as
      | HTMLElement
      | undefined;

    // Если мы на последней кнопке dropdown и нажали Tab
    if (document.activeElement === lastButton && !e.shiftKey) {
      e.preventDefault();

      dropdownVisible.value = false;

      // Ищем следующий tabbable элемент после select trigger
      const focusableEls = Array.from(
        document.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'));

      const triggerEl = selectRef.value?.querySelector(
        '.select-ui__trigger',
      ) as HTMLElement | null;
      const triggerIdx = triggerEl ? focusableEls.indexOf(triggerEl) : -1;

      if (triggerIdx >= 0 && triggerIdx + 1 < focusableEls.length) {
        const next = focusableEls[triggerIdx + 1];
        next?.focus();
      }
    }
  }
};

/**
 * Центральный обработчик клавиатурных событий на компоненте Select.
 *
 * Обрабатывает: Enter, Space, ArrowUp/Down, Escape, Backspace, Tab.
 * Игнорируется при `loading` или `readonly`.
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (props.loading || props.selectProps?.readonly) return;

  switch (e.key) {
    case 'Enter':
      handleEnter(e);
      break;
    case ' ':
      handleSpace(e);
      break;
    case 'ArrowDown':
      handleArrowClick(e, 'down');
      break;
    case 'ArrowUp':
      handleArrowClick(e, 'up');
      break;
    case 'Escape':
      handleEscape();
      break;
    case 'Backspace':
      handleBackspace();
      break;
    case 'Tab':
      handleTriggerTab(e);
      break;
    default:
      break;
  }

  emit('triggerKeydown', e, dropdownVisible.value);
};

const handleFocusOut = (event: FocusEvent) => {
  if (
    !event.relatedTarget ||
    !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)
  ) {
    dropdownVisible.value = false;
  }
};

const handleTriggerFocusout = (event: FocusEvent) => {
  const isSelectContainsFocusedEl =
    selectRef.value?.contains(event.relatedTarget as Node) ?? false;

  emit('triggerFocusout', event, isSelectContainsFocusedEl);
};

const resetScrollOnSearchChange = () => {
  const scroll = dropdownCompRef.value?.$refs?.scrollRef;
  if (scroll) {
    const { resize } = scroll;
    if (resize) resize.scrollTop = 0;

    scroll.shouldSetHeightCalc?.();
    scroll.update?.();
  }
};
const debouncedResetScrollOnSearchChange = useDebounceFn(
  resetScrollOnSearchChange,
  750,
);

watch(searchQuery, async () => {
  // дождались рендера новых данных (после очистки списка)
  await nextTick();
  debouncedResetScrollOnSearchChange();
});

onClickOutside(selectRef, (event) => {
  if (dropdownCompRef.value?.contains?.(event.target as Node)) return;
  if (props.selectProps?.disabled || !dropdownVisible.value) return;
  toggleDropdown();
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as textMixins;
@use '/assets/styles/components/form' as form;

.select-ui {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
  border: form.$form-item-border-width solid form.$form-item-border-color;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;

  &--filled {
    .select-ui__trigger, .select-ui__placeholder {
      color: colors.$text;
    }
  }

  &:hover,
  &--active {
    border-color: colors.$primary-active;
  }

  &--disabled {
    background-color: form.$form-item-disabled-background-color !important;

    .select-ui__trigger {
      background-color: form.$form-item-disabled-background-color;
      border-color: form.$form-item-disabled-border-color;
      cursor: not-allowed;
    }
  }

  &--readonly {
    .select-ui__trigger {
      cursor: default;
    }
  }

  &__trigger {
    @include textMixins.text-14;

    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
    width: 100%;
    min-height: calc(form.$form-item-height - form.$form-item-border-width * 2);
    padding: form.$form-item-padding;
    border-radius: 6px;
    background-color: colors.$white;
    transition:
      background 0.15s ease-in-out,
      color 0.15s ease-in-out;
    color: colors.$text-light;
    user-select: none;
    cursor: pointer;

    &:focus {
      outline: form.$form-item-border-width solid colors.$primary !important;
    }
  }

  &__placeholder {
    // display: -webkit-box;
    // line-clamp: 1;
    // -webkit-line-clamp: 1;
    // -webkit-box-orient: vertical;
    // overflow: hidden;
    // text-overflow: ellipsis;
    color: colors.$text-light;

    &--with-clearable {
      max-width: 85%;
    }

    &--slot {
      display: flex;
      align-items: center;
      margin: -3px 0;
    }
  }

  &__selected-multiple {
    display: flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;
  }

  &__tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__tag {
    display: flex;
    align-items: center;
    gap: 4px;
    border: 1px solid form.$form-item-border-color;
    border-radius: 6px;
    padding: 2.5px 6px;

    .fcb {
      position: relative !important;
      top: unset;
      right: unset;
      transform: none !important;
    }
  }

  &__search-icon {
    width: 16px;
  }

  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 0 10px;
    color: colors.$text;
    transition: transform 0.15s ease;

    &.open {
      transform: rotate(180deg);
    }
  }

  &__list {
    position: absolute;
    min-width: calc(100% + form.$form-item-border-width * 2);
    list-style: none;
    margin: 0;
    padding: form.$form-item-padding;
    top: calc(100% + 2px);
    left: calc(form.$form-item-border-width * -1);
    bottom: auto;
    border-bottom: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background: #fff;
    z-index: 20;
    border-radius: 12px;
    scrollbar-color: grey;

    &--with-footer {
      border-radius: 12px;
    }
  }

  &__list-item {
    @include textMixins.text-14;

    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 6px 8px;
    cursor: pointer;
    text-align: start;
    user-select: none;
    color: colors.$text-light;
    border-radius: 8px;
    transition:
      color 0.15s ease-in-out,
      background-color 0.15s ease-in-out;

    &:not(:last-child) {
      margin: 0 0 2px;
    }

    &.picked,
    &.active,
    &:hover {
      color: colors.$text;
      background-color: #00000025;
    }

    &:focus {
      outline-color: colors.$primary;
      outline-offset: -1px;
    }
  }

  &__dropdown-footer {
    border-top: 1px solid form.$form-item-border-color;
  }

  &__loading {
    @include textMixins.text-14;

    padding: 12px 8px;
    // color: colors.$text-secondary;
    text-align: center;
  }

  &--error {
    border-color: colors.$danger !important;
  }

  &__checkbox.checkbox-ui {
    &:hover:not(.is-disabled) .checkbox-ui__inner {
      border-color: #dcdfe6 !important;
    }

    &__inner {
      background-color: colors.$border;
    }
  }

  &__search {
    @include textMixins.text-14;

    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    margin: 0;
    color: colors.$text-light;

    &::placeholder {
      color: colors.$text-light;
    }
  }
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
}
</style>
