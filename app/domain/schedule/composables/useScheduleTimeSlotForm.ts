import {
  createScheduleTimeSlot,
  deleteScheduleTimeSlot,
  updateScheduleTimeSlot,
} from '~/domain/schedule/api/schedule.api';
import type {
  ScheduleTimeSlot,
  ScheduleTimeSlotCreate,
} from '~/domain/schedule/models/schedule.types';
import { getDefaultTime } from '~/domain/schedule/utils/schedule.utils';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { RequestError } from '~/shared/errors/request.errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  FormErrors,
  FormFields,
  FormRules,
} from '~/shared/types/core/form-validation.types';
import {
  clearFormValidation,
  setBackendErrors,
  validateForm,
} from '~/shared/utils/core/formValidation';

type Options = {
  flowId: Ref<EntityId | null>;
  onSuccess?: () => void | Promise<void>;
};

function useScheduleTimeSlotForm(options: Options) {
  const { toastSuccess, toastError } = useCustomToast();

  const loading = ref(false);
  const editingSlot = ref<ScheduleTimeSlot | null>(null);

  const formData = ref<FormFields<ScheduleTimeSlotCreate>>({
    name: null,
    day_of_week: null,
    lead_time_min: 0,
    flow_id: null,
    social_account_ids: null,
    time: null,
    timezone: null,
  });

  const formErrors = reactive<FormErrors<ScheduleTimeSlotCreate>>({
    name: '',
    day_of_week: '',
    lead_time_min: '',
    flow_id: '',
    social_account_ids: '',
    time: '',
    timezone: '',
  });

  const formRules = ref<FormRules<ScheduleTimeSlotCreate>>({
    name: () => {
      if (!formData.value.name?.trim()) {
        formErrors.name = 'Введите название';
        return false;
      }
      return true;
    },
    social_account_ids: () => {
      if (!formData.value.social_account_ids?.length) {
        formErrors.social_account_ids = 'Выберите аккаунт';
        return false;
      }
      return true;
    },
    time: () => {
      if (!formData.value.time) {
        formErrors.time = 'Выберите время';
        return false;
      }
      return true;
    },
  });

  const isEdit = computed(() => !!editingSlot.value);

  const initForm = (dayOfWeek: number, slot?: ScheduleTimeSlot) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (slot) {
      editingSlot.value = slot;
      formData.value = {
        name: slot.name,
        day_of_week: slot.day_of_week,
        lead_time_min: slot.lead_time_min,
        flow_id: slot.flow_id,
        social_account_ids: slot.social_account_ids,
        time: slot.time,
        timezone: slot.timezone,
      };
    } else {
      editingSlot.value = null;
      formData.value = {
        name: null,
        day_of_week: dayOfWeek as ScheduleTimeSlotCreate['day_of_week'],
        lead_time_min: null,
        flow_id: options.flowId.value,
        social_account_ids: null,
        time: getDefaultTime(),
        timezone,
      };
    }

    clearFormValidation(formErrors);
  };

  const onSubmit = async (done: () => void) => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    try {
      loading.value = true;
      const body = {
        ...formData.value,
        flow_id: formData.value.flow_id ?? options.flowId.value,
      } as ScheduleTimeSlotCreate;

      if (editingSlot.value) {
        await updateScheduleTimeSlot(editingSlot.value.id, body);
        toastSuccess('Слот обновлён');
      } else {
        await createScheduleTimeSlot(body);
        toastSuccess('Слот создан');
      }

      done();
      await options.onSuccess?.();
    } catch (e) {
      if (e instanceof RequestError && e.statusCode === 422) {
        setBackendErrors(formErrors, e.errors);
        toastError('Ошибка валидации формы');
        return;
      }
      toastError('Ошибка при сохранении слота');
    } finally {
      loading.value = false;
    }
  };

  const onDelete = async (done: () => void) => {
    if (!editingSlot.value) return;

    try {
      loading.value = true;
      await deleteScheduleTimeSlot(editingSlot.value.id);
      toastSuccess('Слот удалён');
      done();
      await options.onSuccess?.();
    } catch {
      toastError('Ошибка при удалении слота');
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    formData,
    formErrors,
    editingSlot,
    isEdit,
    initForm,
    onSubmit,
    onDelete,
  };
}

export default useScheduleTimeSlotForm;
