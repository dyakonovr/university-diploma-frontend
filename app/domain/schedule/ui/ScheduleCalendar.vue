<template>
  <form-container
    class="divided schedule-calendar"
    :loading="loading">
    <template #header>
      <p class="form-container__title">Расписание публикаций</p>
    </template>

    <div class="schedule-calendar__wrapper form-container-padding">
      <div class="schedule-calendar__nav">
        <button
          type="button"
          class="schedule-calendar__nav-btn"
          :disabled="isAtMinDate"
          @click="prevMonth"
        >
          <chevron-left-icon class="schedule-calendar__nav-icon" />
        </button>
        <span class="schedule-calendar__month-label">
          {{ monthLabel }}
        </span>
        <button
          type="button"
          class="schedule-calendar__nav-btn"
          :disabled="isAtMaxDate"
          @click="nextMonth"
        >
          <chevron-right-icon class="schedule-calendar__nav-icon" />
        </button>
      </div>

      <div class="schedule-calendar__grid">
        <div
          v-for="dayName in dayNames"
          :key="dayName"
          class="schedule-calendar__header-cell"
        >
          {{ dayName }}
        </div>

        <div
          v-for="(cell, idx) in calendarCells"
          :key="idx"
          class="schedule-calendar__cell"
          :class="{
            'schedule-calendar__cell--other-month': !cell.isCurrentMonth,
            'schedule-calendar__cell--today': cell.isToday,
          }"
        >
          <span class="schedule-calendar__cell-day">{{ cell.day }}</span>
          <div class="schedule-calendar__cell-slots">
            <button
              v-for="slot in cell.slots"
              :key="slot.id"
              type="button"
              class="schedule-calendar__cell-slot"
              :class="{
                'schedule-calendar__cell-slot--paused':
                  slot.status === 'paused',
              }"
              :title="`${slot.time} — ${slot.name}`"
              @click="openSlotDialog(slot)"
            >
              <span class="schedule-calendar__cell-slot-time">{{
                slot.time
              }}</span>
              <span class="schedule-calendar__cell-slot-name">{{
                slot.name
              }}</span>
            </button>
          </div>
        </div>
      </div>

      <button-ui
        class="schedule-calendar__today-btn"
        :class="{ 'schedule-calendar__today-btn--hidden': isCurrentMonth }"
        @click="goToCurrentMonth">
        Сегодня
      </button-ui>
    </div>

    <schedule-time-slot-dialog
      v-if="selectedSlot"
      v-model="dialogVisible"
      :flow-id="selectedSlot.flow_id"
      :day-of-week="selectedSlot.day_of_week"
      :time-slot="selectedSlot"
      readonly
      @saved="$emit('refresh')"
    />
  </form-container>
</template>

<script lang="ts" setup>
import ChevronLeftIcon from '@/assets/images/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/images/icons/chevron-right.svg';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import { DAYS_OF_WEEK_SHORT } from '~/domain/schedule/constants/schedule.const';
import type { ScheduleTimeSlot } from '~/domain/schedule/models/schedule.types';

import ScheduleTimeSlotDialog from './ScheduleTimeSlotDialog.vue';

type Props = {
  slots: ScheduleTimeSlot[];
  loading?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

defineEmits<{
  (e: 'refresh'): void;
}>();

const now = new Date();
const currentDate = ref(new Date());
const dialogVisible = ref(false);
const selectedSlot = ref<ScheduleTimeSlot | undefined>(undefined);

const minDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
const maxDate = new Date(now.getFullYear(), now.getMonth() + 6, 1);

const dayNames = Object.values(DAYS_OF_WEEK_SHORT);

const monthLabel = computed(() => {
  const date = currentDate.value;
  const monthName = date.toLocaleString('ru-RU', { month: 'long' });
  return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${date.getFullYear()}`;
});

const isCurrentMonth = computed(() => {
  return (
    currentDate.value.getMonth() === now.getMonth() &&
    currentDate.value.getFullYear() === now.getFullYear()
  );
});

const isAtMinDate = computed(() => {
  return (
    currentDate.value.getFullYear() === minDate.getFullYear() &&
    currentDate.value.getMonth() === minDate.getMonth()
  );
});

const isAtMaxDate = computed(() => {
  return (
    currentDate.value.getFullYear() === maxDate.getFullYear() &&
    currentDate.value.getMonth() === maxDate.getMonth()
  );
});

const prevMonth = () => {
  if (isAtMinDate.value) return;
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() - 1);
  currentDate.value = d;
};

const nextMonth = () => {
  if (isAtMaxDate.value) return;
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() + 1);
  currentDate.value = d;
};

const goToCurrentMonth = () => {
  currentDate.value = new Date();
};

const openSlotDialog = (slot: ScheduleTimeSlot) => {
  selectedSlot.value = slot;
  dialogVisible.value = true;
};

type CalendarCell = {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayOfWeek: number;
  slots: ScheduleTimeSlot[];
};

const calendarCells = computed<CalendarCell[]>(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const today = new Date();

  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dow = getDayOfWeekForDate(year, month - 1, day);
    cells.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      dayOfWeek: dow,
      slots: getSlotsForDayOfWeek(dow),
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dow = getDayOfWeekForDate(year, month, day);
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    cells.push({
      day,
      isCurrentMonth: true,
      isToday,
      dayOfWeek: dow,
      slots: getSlotsForDayOfWeek(dow),
    });
  }

  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const dow = getDayOfWeekForDate(year, month + 1, day);
    cells.push({
      day,
      isCurrentMonth: false,
      isToday: false,
      dayOfWeek: dow,
      slots: getSlotsForDayOfWeek(dow),
    });
  }

  return cells;
});

function getDayOfWeekForDate(year: number, month: number, day: number): number {
  const d = new Date(year, month, day);
  let dow = d.getDay() - 1;
  if (dow < 0) dow = 6;
  return dow;
}

function getSlotsForDayOfWeek(dayOfWeek: number): ScheduleTimeSlot[] {
  return props.slots
    .filter((s) => s.day_of_week === dayOfWeek)
    .sort((a, b) => a.time.localeCompare(b.time));
}
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.schedule-calendar {
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    transition: background-color 0.15s;

    &:hover:not(:disabled) {
      background-color: colors.$border;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &__nav-icon {
    width: 12px;
    height: 12px;
  }

  &__month-label {
    font-weight: 600;
    font-size: 16px;
    min-width: 180px;
    text-align: center;
  }

  &__today-btn {
    align-self: center;

    &--hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(150px, 1fr));
    gap: 1px;
    background-color: colors.$border;
    border: 1px solid colors.$border;
    border-radius: 8px;
    overflow-x: auto;
  }

  &__header-cell {
    padding: 8px 4px;
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    color: colors.$text-light;
    background-color: colors.$background;
  }

  &__cell {
    background-color: colors.$white;
    min-height: 80px;
    padding: 4px;
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 768px) {
      min-height: 60px;
    }

    &--other-month {
      background-color: colors.$background;

      .schedule-calendar__cell-day {
        color: colors.$text-light;
        opacity: 0.5;
      }
    }

    &--today {
      .schedule-calendar__cell-day {
        background-color: colors.$primary;
        color: colors.$white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  &__cell-day {
    font-size: 12px;
    font-weight: 500;
    color: colors.$text;
    margin-bottom: 2px;
  }

  &__cell-slots {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    overflow-y: auto;
    max-height: 70px;
    min-width: 0;
  }

  &__cell-slot {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    padding: 2px 4px;
    border-radius: 4px;
    background-color: colors.$primary;
    color: colors.$white;
    cursor: pointer;
    border: 1px solid transparent;
    text-align: left;
    min-width: 0;
    width: 100%;
    overflow: hidden;
    transition:
      opacity 0.15s,
      border-color 0.15s,
      box-shadow 0.3s;

    &:hover {
      opacity: 0.85;
    }

    &--paused {
      background-color: colors.$text-light;
      opacity: 0.6;
    }
  }

  &__cell-slot-time {
    font-weight: 600;
    flex-shrink: 0;
  }

  &__cell-slot-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    font-weight: 400;
    max-width: 170px;
  }
}
</style>
