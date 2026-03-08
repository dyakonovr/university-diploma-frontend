import { getScheduleTimeSlots } from '~/domain/schedule/api/schedule.api';
import type { ScheduleTimeSlot } from '~/domain/schedule/models/schedule.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';

type Options = {
  flowId?: Ref<EntityId | null> | (() => EntityId | null);
};

function useScheduleTimeSlots(options?: Options) {
  const { toastError } = useCustomToast();

  const slots = ref<ScheduleTimeSlot[]>([]);
  const loading = ref(false);

  const loadSlots = async () => {
    try {
      loading.value = true;

      const flowId = options?.flowId
        ? typeof options.flowId === 'function'
          ? options.flowId()
          : options.flowId.value
        : null;

      const params = objectToQueryString({
        per_page: 200,
        ...(flowId ? { flow_id: flowId } : {}),
      });

      const response = await getScheduleTimeSlots(params);
      slots.value = response.data;
    } catch {
      toastError('Ошибка загрузки расписания');
    } finally {
      loading.value = false;
    }
  };

  return {
    slots,
    loading,
    loadSlots,
  };
}

export default useScheduleTimeSlots;
