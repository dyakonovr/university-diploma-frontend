<template>
  <form-wrapper v-bind="$props">
    <vue-date-picker
      v-model="model"
      :locale="ru"
      :placeholder="timePicker ? 'Время' : 'Дата'"
      :config="{ monthChangeOnScroll: false }"
      :formats="{ input: timePicker ? 'HH:mm' : 'dd.MM.yy HH:mm' }"
      :input-attrs="{ alwaysClearable: true }"
      :time-config="{ enableTimePicker: true }"
      :floating="{ placement: 'bottom-start' }"
      :disabled="disabled"
      :readonly="readonly"
      :time-picker="timePicker"
      :minutes-increment="minutesIncrement"
      :teleport="teleportToBody ? 'body' : false"
      prevent-min-max-navigation
      :year-range="yearRange"
      :min-date="minDate"
      :max-date="maxDate"
      :range="range"
      class="datepicker-ui"
      :class="{ 'datepicker-ui--active': model }"
      @open="isOpened = true"
      @closed="isOpened = false"
    >
      <template #input-icon>
        <calendar-icon
          v-if="!isDefined(model)"
          class="datepicker-ui__input-icon datepicker-ui__input-icon--calendar dp__input_icons"
        />
      </template>

      <template
        #month-year="{
          month,
          year,
          years,
          updateMonthYear,
          handleMonthYearChange,
        }"
      >
        <div class="datepicker-ui__header">
          <button
            type="button"
            class="datepicker-ui__arrow"
            variant="outlined"
            size="small"
            @click="handleMonthYearChange?.(false)"
          >
            <chevron-left-icon
              class="datepicker-ui__arrow-icon datepicker-ui__arrow-icon--left"
            />
          </button>
          <div class="datepicker-ui__header-fields">
            <select-ui
              form-wrapper-class="datepicker-ui__select datepicker-ui__select--month"
              :model-value="month ?? null"
              :options="months"
              :clearable="false"
              :searchable="false"
              dropdown-list-class="datepicker-ui__select-list"
              @update:model-value="
                updateMonth($event as number | null, updateMonthYear, year)
              "
            />
            <select-ui
              form-wrapper-class="datepicker-ui__select"
              :model-value="year ?? null"
              :clearable="false"
              :searchable="false"
              :options="years?.reverse() ?? []"
              label-field="text"
              dropdown-list-class="datepicker-ui__select-list"
              @update:model-value="
                updateYear($event as number | null, updateMonthYear, month)
              "
            />
          </div>
          <button
            type="button"
            class="datepicker-ui__arrow"
            size="small"
            @click="handleMonthYearChange?.(true)"
          >
            <chevron-right-icon
              class="datepicker-ui__arrow-icon datepicker-ui__arrow-icon--right"
            />
          </button>
        </div>
      </template>
      <template #clear-icon="{ clear }">
        <clear-field-button-ui
          v-show="isDefined(model)"
          class="datepicker-ui__clear-btn"
          :disabled="disabled"
          @click="clear"
        />
      </template>
    </vue-date-picker>
  </form-wrapper>
</template>

<script lang="ts" setup>
import '@vuepic/vue-datepicker/dist/main.css';

import { VueDatePicker } from '@vuepic/vue-datepicker';
import { isDefined } from '@vueuse/core';
import { getYear } from 'date-fns';
import { ru } from 'date-fns/locale';

import CalendarIcon from '@/assets/images/icons/calendar.svg';
import ChevronLeftIcon from '@/assets/images/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/images/icons/chevron-right.svg';

import ClearFieldButtonUi from './ClearFieldButtonUi.vue';
import FormWrapper, { type FormWrapperProps } from './FormWrapperUi.vue';
import SelectUi from './select/SelectUi.vue';

type UpdateMonthYear = (month: number, year: number, fromNav?: boolean) => void;

type Props = FormWrapperProps & {
  minDate?: Date | string | number;
  maxDate?: Date | string | number;
  disabled?: boolean;
  range?: boolean;
  timePicker?: boolean;
  minutesIncrement?: number;
  readonly?: boolean;
  /** Teleport the datepicker menu to body (useful inside overflow:hidden containers like dialogs) */
  teleportToBody?: boolean;
};

const props = defineProps<Props>();

export type TimePickerValue = {
  hours: number;
  minutes: number;
  seconds?: number;
};

const model = defineModel<Date | Date[] | TimePickerValue | null>({
  required: true,
  default: null,
});

// В библиотеке месяца сокращены до Янв.
const months = ref([
  { label: 'Январь', value: 0 },
  { label: 'Февраль', value: 1 },
  { label: 'Март', value: 2 },
  { label: 'Апрель', value: 3 },
  { label: 'Май', value: 4 },
  { label: 'Июнь', value: 5 },
  { label: 'Июль', value: 6 },
  { label: 'Август', value: 7 },
  { label: 'Сентябрь', value: 8 },
  { label: 'Октябрь', value: 9 },
  { label: 'Ноябрь', value: 10 },
  { label: 'Декабрь', value: 11 },
]);
const nowDate = new Date();
const yearRange = computed<[number, number]>(() => [
  props.minDate ? getYear(props.minDate) : 1900,
  props.maxDate ? getYear(props.maxDate) : getYear(nowDate),
]);

const isOpened = ref(false);
const backspaceHandler = ref<((e: KeyboardEvent) => void) | null>(null);

const updateMonth = (
  value: number | null | undefined,
  updateMonthYear: UpdateMonthYear | undefined,
  year: number | null | undefined,
) => {
  updateMonthYear?.(
    value || nowDate.getMonth(),
    year || nowDate.getFullYear(),
    false,
  );
};

const updateYear = (
  value: number | null | undefined,
  updateMonthYear: UpdateMonthYear | undefined,
  month: number | null | undefined,
) => {
  updateMonthYear?.(
    month || nowDate.getMonth(),
    value || nowDate.getFullYear(),
    false,
  );
};

watch(isOpened, (newV) => {
  // Вешаем обработчик Backspace для сброса значения
  if (newV && isDefined(model.value)) {
    const handleBackspace = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && isOpened.value) {
        model.value = null;
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleBackspace);
    backspaceHandler.value = handleBackspace;
  } else if (!newV && backspaceHandler.value) {
    document.removeEventListener('keydown', backspaceHandler.value);
    backspaceHandler.value = null;
  }
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as textMixins;
@use '/assets/styles/components/form' as form;

:root {
  --dp-cell-size: 38px !important;
  --dp-range-between-dates-background-color: colors.$border !important;
}

$dp-cell-color: colors.$border;
$calendar-font-family: 'Montserrat';

.datepicker-ui {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;

    &-fields {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }

  &__select {
    &--month {
      width: 120px;
    }

    &-list {
      z-index: 100000 !important;

      .select-ui {
        &__list-item {
          padding: 4px 2px;
        }
      }
    }
  }

  &__input-icon {
    display: flex;
    width: 14px !important;
    height: 14px !important;
    stroke-width: unset !important;
    inset-inline-start: 0 !important;
    inset-inline-end: 0 !important;
    padding: 0 !important;

    &--calendar {
      padding-top: 3px !important;
      padding-right: 10px !important;
    }
  }

  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 8px !important;
    min-width: 24px;
    max-width: 24px;
    height: 24px;
    border-radius: 6px;
    transition: background-color 0.15s ease-in-out;

    &:hover {
      background-color: colors.$border;
    }

    svg {
      position: absolute;
      left: 50%;
      top: 50%;
    }
  }

  &__arrow-icon {
    width: 10px !important;
    height: 10px !important;

    &--right {
      transform: translate(-50%, -50%);
    }

    &--left {
      transform: translate(-50%, -50%);
    }
  }

  &--active {
    .dp__input {
      background-color: colors.$white;
      border-color: colors.$border;
    }
  }

  &__clear-btn {
    position: relative !important;
    transform: unset;
  }
}

.dp {
  &__inner_nav {
    &:hover {
      border-radius: 6px !important;
    }
  }

  &--header-wrap {
    margin-bottom: 12px;
  }

  &__input {
    width: 100%;
    height: 100%;
    outline: none;
    border: form.$form-item-border-width solid form.$form-item-border-color;
    border-radius: 6px;
    padding: 0.5em 0.625em;
    min-height: form.$form-item-height;
    font-family: $calendar-font-family;
    color: colors.$text;
    opacity: 1;
    transition:
      border-color 0.2s ease-in-out,
      color 0.2s ease-in-out,
      background-color 0.2s ease-in-out;

    @include textMixins.text-14;

    &::placeholder {
      color: colors.$text-light;
      transition: color 0.15s ease-in-out;
    }

    &:hover {
      border-color: colors.$primary-active !important;
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

    &--error {
      border-color: colors.$danger !important;
    }
  }

  &__menu {
    box-shadow: 0px 4px 16px 0px #181c321a;
    border-radius: 16px;
    border: none !important;
    z-index: 2100 !important;
  }

  &__menu_inner,
  &__overlay_container {
    padding: 16px !important;
  }

  &__outer_menu_wrap {
    @include textMixins.text-14;
  }

  &__month_year_wrap {
    display: flex;
    justify-content: space-evenly;
  }

  &__month_year_select {
    width: 45% !important;
    font-weight: 500;

    @include textMixins.text-14;
  }

  &__calendar_header {
    justify-content: space-around;
  }

  &__calendar_header_item {
    max-width: var(--dp-cell-size);
    color: colors.$border;
    font-weight: 400 !important;
    text-transform: capitalize;

    @include textMixins.text-12;

    &:nth-child(6),
    &:nth-child(7) {
      color: colors.$border;
    }
  }

  &__calendar_item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: colors.$text !important;
    border-color: transparent !important;

    @include textMixins.text-14;
  }

  &__cell_offset {
    color: colors.$text-light;
  }

  &__cell_inner {
    font-family: $calendar-font-family;
    border-color: transparent !important;
  }

  &__active_date {
    background: colors.$primary !important;
  }

  &__date_hover:hover {
    background: $dp-cell-color !important;
    opacity: 1 !important;
  }

  &__date_hover_start:hover {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  &__date_hover_end:hover {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  &__calendar_header_separator,
  &__arrow_top {
    display: none;
  }

  &__overlay_col {
    font-family: $calendar-font-family;
  }

  &__overlay_cell_active {
    background-color: colors.$primary !important;
  }

  &__input_icon {
    inset-inline-start: unset !important;
    inset-inline-end: 0 !important;
  }

  // &--clear-btn {
  //   inset-inline-end: 20px !important;
  // }

  &__calendar_row {
    .dp__calendar_item:has(.dp__range_between):last-child {
      position: relative;

      &,
      & .dp__range_between {
        border-top-right-radius: 6px !important;
        border-bottom-right-radius: 6px !important;
      }
    }

    .dp__calendar_item:has(.dp__range_between):first-child {
      position: relative;

      &,
      & .dp__range_between {
        border-top-left-radius: 6px !important;
        border-bottom-left-radius: 6px !important;
      }
    }
  }

  &__calendar_item:has(.dp__range_start),
  &__calendar_item:has(.dp__date_hover_start) {
    border-top-left-radius: 6px !important;
    border-bottom-left-radius: 6px !important;
  }

  &__calendar_item:has(.dp__date_hover_start) {
    background-color: $dp-cell-color !important;
  }

  &__calendar_item:has(.dp__range_start) {
    border-top-left-radius: 6px !important;
    border-bottom-left-radius: 6px !important;
    background-color: $dp-cell-color !important;
  }

  &__calendar_item:has(.dp__range_end),
  &__calendar_item:has(.dp__date_hover_end) {
    border-top-right-radius: 6px !important;
    border-bottom-right-radius: 6px !important;
    background-color: $dp-cell-color !important;
  }

  &__today {
    border: 1px solid colors.$text !important;
    border-radius: 6px !important;
  }

  &__range_start,
  &__range_end {
    background-color: colors.$text !important;
    color: colors.$white !important;
    border-radius: 6px !important;
  }

  &__range_start {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  &__range_end {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  &__range_between {
    --dp-range-between-border-color: $dp-cell-color;
    border-radius: 0 !important;
    background: $dp-cell-color;
  }

  &__overlay {
    border-radius: 16px !important;
  }

  &__overlay_action {
    display: none;
  }
}
</style>
