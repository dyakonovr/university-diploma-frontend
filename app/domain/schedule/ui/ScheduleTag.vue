<template>
  <component
    :is="clickable ? NuxtLink : 'span'"
    v-bind="clickable ? { to: scheduleLink } : {}"
    class="schedule-tag__link"
  >
    <tag-ui type="primary">
      <calendar-clock-icon class="schedule-tag__icon" />
      {{ label }}
    </tag-ui>
  </component>
</template>

<script lang="ts" setup>
import CalendarClockIcon from '@/assets/images/icons/calendar-clock.svg';
import { NuxtLink } from '#components';
import TagUi from '~/components/ui/TagUi.vue';
import { getScheduleTimeSlotById } from '~/domain/schedule/api/schedule.api';
import type { ScheduleTimeSlot } from '~/domain/schedule/models/schedule.types';
import { formatScheduleSlotLabel } from '~/domain/schedule/utils/schedule.utils';
import type { EntityId } from '~/shared/types/core/base-entity.types';

type Props = {
  slot?: ScheduleTimeSlot | null;
  scheduleId?: EntityId | null;
  flowId?: EntityId | null;
  clickable?: boolean;
  fetchSlot?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  slot: null,
  scheduleId: null,
  flowId: null,
  clickable: true,
  fetchSlot: false,
});

const fetchedSlot = ref<ScheduleTimeSlot | null>(null);

const resolvedSlot = computed(() => props.slot ?? fetchedSlot.value);

const label = computed(() => {
  if (resolvedSlot.value) return formatScheduleSlotLabel(resolvedSlot.value);
  return 'По расписанию';
});

const scheduleLink = computed(() => {
  const fId = resolvedSlot.value?.flow_id ?? props.flowId;
  if (fId) {
    const base = `/account/flows/private/${fId}?tab=publish`;
    if (props.scheduleId) return `${base}&slotId=${props.scheduleId}`;
    return base;
  }
  return undefined;
});

watch(
  () => [props.fetchSlot, props.scheduleId] as const,
  async ([shouldFetch, id]) => {
    if (!shouldFetch || !id) {
      fetchedSlot.value = null;
      return;
    }
    try {
      const response = await getScheduleTimeSlotById(id);
      fetchedSlot.value = response.data;
    } catch {
      fetchedSlot.value = null;
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.schedule-tag__link {
  text-decoration: none;
  display: inline-flex;
}

.schedule-tag__icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  margin-right: 4px;
}
</style>
