<template>
  <form-wrapper v-bind="$props">
    <vue-date-picker
      v-model="model"
      locale="ru-RU"
      placeholder="Выберите дату"
      :enable-time-picker="false"
      :auto-apply="true"
      :preview-format="undefined"
      :month-change-on-scroll="false"
      format="dd.MM.yyyy"
      class="datepicker-ui"
      :min-date="minDate"
      :max-date="tomorrow"
      v-bind="datepickerProps">
      <template #input-icon>
        <calendar-icon class="datepicker-ui__input-icon datepicker-ui__input-icon--calendar dp__input_icons" />
      </template>

      <template #clear-icon="{ clear }">
        <x-icon
          class="datepicker-ui__input-icon datepicker-ui__input-icon--x dp__input_icons"
          @click="clearFunc(clear)" />
      </template>

      <template #arrow-left>
        <button-ui
          type="button"
          class="datepicker-ui__arrow"
          variant="outlined"
          size="small">
          <chevron-down-icon class="datepicker-ui__arrow-icon datepicker-ui__arrow-icon--left" />
        </button-ui>
      </template>

      <template #arrow-right>
        <button-ui
          type="button"
          class="datepicker-ui__arrow"
          variant="outlined"
          size="small">
          <chevron-down-icon class="datepicker-ui__arrow-icon datepicker-ui__arrow-icon--right" />
        </button-ui>
      </template>
    </vue-date-picker>
  </form-wrapper>
</template>

<script lang="ts" setup>
import FormWrapper, { type FormWrapperProps } from './FormWrapper.vue';
import ButtonUi from './ButtonUi.vue';
import XIcon from '~/assets/images/icons/x-02.svg';
import ChevronDownIcon from '~/assets/images/icons/chevron-down.svg';
import CalendarIcon from '~/assets/images/icons/calendar.svg';
import VueDatePicker, { type VueDatePickerProps } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

type Props = FormWrapperProps & { datepickerProps?: VueDatePickerProps };
defineProps<Props>();

const model = defineModel<Date | string>();

const minDate = computed(() => {
  return new Date('01.01.1900');
});

const tomorrow = computed(() => {
  const today = new Date();
  return new Date(today.setDate(today.getDate() + 1));
});

const clearFunc = (clearInstance: (ev?: Event) => void) => {
  clearInstance();
  model.value = undefined;
};
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/mixins/text' as mixins;
@use '/assets/styles/base/fonts' as fonts;

.datepicker-ui {
  &__input-icon {
    width: 14px !important;
    height: 14px !important;
    stroke-width: unset !important;
    inset-inline-start: 0 !important;
    inset-inline-end: 0 !important;
    padding: 0 !important;

    &--calendar {
      padding-top: 1px !important;
      padding-right: 12px !important;
    }

    &--x {
      width: 14px;
      height: 14px;
      color: colors.$gray-600 !important;
    }
  }

  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: offsets.$offset-8 !important;
    min-width: 32px;
    max-width: 32px;
    height: 32px;
  }

  &__arrow-icon {
    width: auto !important;
    height: auto !important;

    &--left {
      transform: rotate(90deg);
    }

    &--right {
      transform: rotate(-90deg);
    }
  }
}

.dp {
  &__input { // InputUi.vue
    width: 100% !important;
    border: 1px solid colors.$gray-300 !important;
    background-color: colors.$white !important;
    border-radius: 12px !important;
    padding: 10px 50px 10px offsets.$offset-12 !important;
    transition: all 0.2s ease-in-out !important;
    font-family: fonts.$font1 !important;

    @include mixins.text-14;

    &:hover {
      background-color: colors.$gray-100 !important;
      border-color: colors.$gray-400;
    }

    &_focus {
      border-color: colors.$primary-normal !important;
    }

    &:active {
      background-color: colors.$gray-100 !important;
      border-color: colors.$gray-300 !important;
    }

    &:disabled {
      background-color: colors.$gray-100 !important;
      border-color: colors.$gray-300 !important;
      color: colors.$gray-400 !important;
    }

    &--error {
      border-color: colors.$danger-normal !important;
    }
  }

  &__menu {
    border-radius: 12px;
    border: 1px solid colors.$gray-200 !important;
    box-shadow: 0px 7px 15px 0px #0000000F;
  }

  &__menu_inner {
    padding: offsets.$offset-8 !important;
  }

  &__outer_menu_wrap {
    @include mixins.text-14;
  }

  &__month_year_wrap {
    display: flex;
    justify-content: space-evenly;
  }

  &__month_year_select {
    width: 45% !important;
    @include mixins.text-14;
    @include mixins.weight-500;
  }

  &__calendar_header_item {
    color: colors.$gray-600;

    @include mixins.text-14;
  }

  &__calendar_item {
    color: colors.$gray-900 !important;

    @include mixins.text-14;
  }

  &__cell_inner {
    font-family: fonts.$font1;
    border-radius: 16px !important;
  }

  &__today {
    border: none;
    background: colors.$primary-light !important;
  }

  &__active_date {
    background: colors.$primary-normal !important;
  }

  &__date_hover:hover {
    background: colors.$gray-100 !important;
  }

  &__calendar_header_separator, &__arrow_top {
    display: none;
  }

  &__overlay_col {
    font-family: fonts.$font1;
  }

  &__overlay_cell_active {
    background-color: colors.$primary-normal !important;
  }

  &__input_icon {
    inset-inline-start: unset !important;
    inset-inline-end: 0 !important;
  }

  &--clear-btn {
    inset-inline-end: 37px !important;
  }
}
</style>