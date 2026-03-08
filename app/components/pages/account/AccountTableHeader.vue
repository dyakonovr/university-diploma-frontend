<template>
  <div class="table-header">
    <div class="table-header__top">
      <account-section-title />
      <div class="table-header__buttons">
        <button-ui
          v-if="withFilters"
          variant="outlined"
          class="table-header__button table-header__collapse-button no-hover"
          :class="{
            'table-header__collapse-button--opened': filtersOpened,
          }"
          @click="onFiltersButtonClick"
        >
          <filter-icon class="table-header__collapse-button-pre-icon" />
          Фильтр
          <chevron-down-filled-icon
            class="table-header__collapse-button-chevron"
          />

          <span
            v-if="isCollapseButtonActive"
            class="table-header__collapse-button--active"
          />
        </button-ui>
        <slot name="buttons" />
        <button-ui
          v-if="withCreateLink"
          :to="createLinkTo"
          class="table-header__button">
          <plus-icon />
          {{ createLinkText }}
        </button-ui>
      </div>
    </div>

    <table-filters
      v-if="filtersOpened && $slots.filters"
      v-bind="filtersProps"
      @search="emit('filtersSearch')"
      @reset="emit('filtersReset')"
    >
      <slot name="filters" />
    </table-filters>
  </div>
</template>

<script lang="ts" setup>
import ChevronDownFilledIcon from '~/assets/images/icons/chevron-down-filled.svg';
import FilterIcon from '~/assets/images/icons/filter.svg';
import PlusIcon from '~/assets/images/icons/plus.svg';
import AccountSectionTitle from '~/components/pages/account/AccountSectionTitle.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import TableFilters, {
  type TableFiltersProps,
} from '~/components/ui/tables/TableFilters.vue';

type Props = {
  withFilters?: boolean;
  filtersProps?: TableFiltersProps;

  withCreateLink?: boolean;
  createLinkTo?: string;
  createLinkText?: string;
};

const props = withDefaults(defineProps<Props>(), {
  withFilters: true,
  filtersProps: undefined,
  withCreateLink: true,
  createLinkTo: '',
  createLinkText: 'Добавить',
});

const emit = defineEmits<{
  (e: 'filtersSearch' | 'filtersReset'): void;
}>();

const filtersOpened = defineModel<boolean>('filtersOpened', { default: false });
const isCollapseButtonActive = computed(() => {
  return (
    !filtersOpened.value &&
    props.withFilters &&
    Object.values(props.filtersProps?.filters || {}).some((el) => {
      return Array.isArray(el) ? el.length : isDefined(el);
    })
  );
});

const onFiltersButtonClick = () => {
  if (!props.withFilters) return;
  filtersOpened.value = !filtersOpened.value;
};
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.table-header {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__top {
    display: flex;
    justify-content: space-between;
    gap: 10px;

    @media screen and (max-width: 992px) {
      flex-direction: column;
    }
  }

  &__buttons {
    display: flex;
    align-items: center;
    gap: 8px;

    @media screen and (max-width: 576px) {
      flex-direction: column-reverse;
      align-items: baseline;
    }
  }

  &__button {
    @media screen and (max-width: 992px) {
      max-width: unset;
      width: calc(100% / 2 - 4px); // gap=8 / 2
      height: 100%;
    }

    @media screen and (max-width: 576px) {
      width: 100%;
    }
  }

  &__collapse-button {
    display: flex;
    align-items: center;
    gap: 8px;
    color: colors.$primary;
    position: relative;

    @media screen and (max-width: 992px) {
      min-width: unset;
    }

    &--active {
      position: absolute;
      right: -2px;
      top: -2px;
      width: 10px;
      height: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: colors.$white;

      &::after {
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 100%;
        background-color: colors.$success;
      }
    }

    &--opened {
      .table-header__collapse-button-chevron {
        transform: rotate(180deg);
      }
    }

    &-chevron {
      width: 10px !important;
      height: 10px !important;
      color: currentColor;
      transform: rotate(0);
      transition: transform 0.2s ease-in-out;
    }
  }
}
</style>
