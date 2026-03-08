<template>
  <div class="stat-filters">
    <select-ui
      v-if="metricOptions"
      v-model="metricsModel"
      :is-multiple="true"
      :options="metricOptions"
      :searchable="false"
      :clearable="false"
      :select-props="{
        disabled: loading || disabled,
        placeholder: 'Выберите метрики',
      }"
      form-wrapper-class="stat-filters__field stat-filters__field--metrics"
    />

    <datepicker-ui
      v-if="showDateRange"
      v-model="dateRangeModel"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="loading || disabled"
      range
      form-wrapper-class="stat-filters__field stat-filters__field--range"
    />

    <button-group-ui
      v-model="granularityModel"
      :items="granularityButtons"
      class="stat-filters__field stat-filters__field--granularity"
    />
  </div>
</template>

<script setup lang="ts">
import ButtonGroupUi from '~/components/ui/ButtonGroupUi.vue';
import DatepickerUi from '~/components/ui/form/DatepickerUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import type { ButtonGroupItems } from '~/shared/types/ui/button-group.types';
import type { SelectOption } from '~/shared/types/ui/select.types';

type Props = {
  metricOptions?: SelectOption[];
  minDate?: Date;
  maxDate?: Date;
  granularityButtons: ButtonGroupItems;
  loading?: boolean;
  disabled?: boolean;
  showDateRange?: boolean;
};

withDefaults(defineProps<Props>(), {
  metricOptions: undefined,
  minDate: undefined,
  maxDate: undefined,
  loading: false,
  disabled: false,
  showDateRange: true,
});

const metricsModel = defineModel<string[]>('metrics');
const dateRangeModel = defineModel<Date[]>('dateRange');
const granularityModel = defineModel<string | null>('granularity');
</script>

<style lang="scss">
.stat-filters {
  display: flex;
  align-items: center;
  gap: 16px;

  @media screen and (max-width: 1200px) {
    flex-direction: column;
    align-items: baseline;
  }

  &__field {
    &--metrics {
      width: 400px;
    }

    &--range {
      width: 275px;
    }

    &--metrics, &--range {
      @media screen and (max-width: 1200px) {
        width: 100%;
      }
    }


    &--granularity {
      margin-left: auto;

      @media screen and (max-width: 1200px) {
        margin-left: 0;
      }
    }
  }
}
</style>
