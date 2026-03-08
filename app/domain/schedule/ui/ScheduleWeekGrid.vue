<template>
  <div class="schedule-week-grid">
    <notice-ui
      type="info"
      title="Расписание публикаций">
      <p>Слоты запускаются каждую неделю.</p>
      <p>
        1 слот = 1 генерация + публикация. Учитывайте это при выборе аккаунтов в
        соц. сетях
      </p>
    </notice-ui>

    <loading-wrapper
      :loading="loading"
      class="schedule-week-grid__content">
      <div
        v-for="day in DAYS_OF_WEEK"
        :key="day.value"
        class="schedule-week-grid__day"
      >
        <div class="schedule-week-grid__day-header">
          <span class="schedule-week-grid__day-name">{{ day.label }}</span>
          <button
            type="button"
            class="schedule-week-grid__add-btn"
            @click="openCreateDialog(day.value as number)"
          >
            <plus-icon class="schedule-week-grid__add-icon" />
          </button>
        </div>

        <div class="schedule-week-grid__slots">
          <button
            v-for="slot in getSlotsByDay(day.value as number)"
            :key="slot.id"
            type="button"
            class="schedule-week-grid__slot"
            :class="{
              'schedule-week-grid__slot--paused': slot.status === 'paused',
              'schedule-week-grid__slot--highlighted':
                highlightedSlotId === slot.id,
            }"
            :data-slot-id="slot.id"
            :title="`${slot.time} — ${slot.name}`"
            @click="openEditDialog(slot)"
          >
            <span class="schedule-week-grid__slot-time">{{ slot.time }}</span>
            <span class="schedule-week-grid__slot-name">{{ slot.name }}</span>
          </button>

          <p
            v-if="getSlotsByDay(day.value as number).length === 0"
            class="schedule-week-grid__empty"
          >
            Нет слотов
          </p>
        </div>
      </div>
    </loading-wrapper>

    <schedule-time-slot-dialog
      v-model="dialogVisible"
      :time-slot="selectedSlot"
      :flow-id="flowId"
      :day-of-week="selectedDayOfWeek"
      @saved="$emit('refresh')"
    />
  </div>
</template>

<script lang="ts" setup>
import PlusIcon from '@/assets/images/icons/plus.svg';
import LoadingWrapper from '~/components/ui/LoadingWrapper.vue';
import NoticeUi from '~/components/ui/NoticeUi.vue';
import { DAYS_OF_WEEK } from '~/domain/schedule/constants/schedule.const';
import type { ScheduleTimeSlot } from '~/domain/schedule/models/schedule.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import ScheduleTimeSlotDialog from './ScheduleTimeSlotDialog.vue';

type Props = {
  flowId: EntityId;
  slots: ScheduleTimeSlot[];
  loading?: boolean;
  highlightSlotId?: string | null;
};

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  highlightSlotId: null,
});

defineEmits<{
  (e: 'refresh'): void;
}>();

const dialogVisible = ref(false);
const selectedDayOfWeek = ref(0);
const selectedSlot = ref<ScheduleTimeSlot | undefined>(undefined);
const highlightedSlotId = ref<string | null>(null);

let highlightTimer: ReturnType<typeof setTimeout> | null = null;

const scrollToSlot = (slotId: string) => {
  if (window.innerWidth > 768) return;
  nextTick(() => {
    const el = document.querySelector(`[data-slot-id="${slotId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
};

const startHighlight = (slotId: string) => {
  if (highlightTimer) clearTimeout(highlightTimer);
  highlightedSlotId.value = slotId;
  scrollToSlot(slotId);
  highlightTimer = setTimeout(() => {
    highlightedSlotId.value = null;
  }, 5000);
};

watch(
  [() => props.highlightSlotId, () => props.slots],
  ([slotId, slots]) => {
    if (slotId && slots.some((s) => s.id === slotId)) {
      startHighlight(slotId);
    }
  },
  { immediate: true },
);

const getSlotsByDay = (dayOfWeek: number): ScheduleTimeSlot[] => {
  return props.slots
    .filter((s) => s.day_of_week === dayOfWeek)
    .sort((a, b) => a.time.localeCompare(b.time));
};

const openCreateDialog = (dayOfWeek: number) => {
  selectedDayOfWeek.value = dayOfWeek;
  selectedSlot.value = undefined;
  dialogVisible.value = true;
};

const openEditDialog = (slot: ScheduleTimeSlot) => {
  selectedDayOfWeek.value = slot.day_of_week;
  selectedSlot.value = slot;
  dialogVisible.value = true;
  startHighlight(slot.id);
};
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.schedule-week-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__content {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;

    @media screen and (max-width: 1200px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media screen and (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  &__day {
    border: 1px solid colors.$border;
    border-radius: 8px;
    overflow: hidden;
  }

  &__day-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background-color: colors.$background;
    border-bottom: 1px solid colors.$border;
  }

  &__day-name {
    font-weight: 600;
    font-size: 13px;
    color: colors.$text;
  }

  &__add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    color: colors.$primary;
    transition: background-color 0.15s;

    &:hover {
      background-color: colors.$border;
    }
  }

  &__add-icon {
    width: 14px;
    height: 14px;
  }

  &__slots {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    min-height: 60px;
  }

  &__slot {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border-radius: 6px;
    background-color: colors.$background;
    border: 1px solid colors.$border;
    text-align: left;
    transition:
      background-color 0.15s,
      border-color 0.15s;
    cursor: pointer;

    &:hover {
      border-color: colors.$primary;
      background-color: colors.$white;
    }

    &--paused {
      opacity: 0.5;
    }

    &--highlighted {
      animation: slot-pulse 1.5s ease-in-out 2;
    }
  }

  &__slot-time {
    font-size: 12px;
    font-weight: 600;
    color: colors.$primary;
    white-space: nowrap;
  }

  &__slot-name {
    font-size: 12px;
    color: colors.$text-light;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__empty {
    font-size: 12px;
    color: colors.$text-light;
    text-align: center;
    padding: 8px 0;
  }
}

@keyframes slot-pulse {
  0%,
  100% {
    background-color: colors.$background;
    box-shadow: 0 0 0 0 rgba(colors.$primary, 0);
  }

  50% {
    background-color: rgba(colors.$primary, 0.1);
    box-shadow: 0 0 0 3px rgba(colors.$primary, 0.25);
  }
}
</style>
