import type { Ref } from 'vue';

import {
  finishPublicFlowModeration,
} from '~/domain/flow/api/public-flows.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { RequestError } from '~/shared/errors/request.errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import {
  clearFormValidation,
  setBackendErrors,
  validateForm,
} from '~/shared/utils/core/formValidation';

/**
 * Composable для формы отклонения шаблона на модерации.
 * Инкапсулирует API-вызов, клиентскую и серверную (422) валидацию.
 *
 * @param flowId - реактивный ID шаблона
 *
 * @example
 * const { formData, formErrors, loading, onSubmit, resetForm } = useDeclineFlowForm(flowId);
 * const success = await onSubmit(); // true — диалог можно закрыть
 */
function useDeclineFlowForm(flowId: Ref<EntityId | null>) {
  const { toastSuccess, toastError } = useCustomToast();

  const formData = ref<{ decline_reason: string | null }>({
    decline_reason: null,
  });

  const formErrors = reactive({
    decline_reason: '',
  });

  const formRules = computed(() => ({
    decline_reason: () => {
      if (!formData.value.decline_reason?.trim()) {
        formErrors.decline_reason = 'Укажите причину отклонения';
        return false;
      }
      return true;
    },
  }));

  const loading = ref(false);

  /**
   * Отправить форму отклонения.
   * @returns `true` если запрос прошёл успешно, `false` при ошибке
   */
  const onSubmit = async (): Promise<boolean> => {
    // clearFormValidation(formErrors);

    // const valid = validateForm(formRules.value);
    // if (!valid) {
    //   toastError('Ошибка валидации');
    //   return false;
    // }

    try {
      loading.value = true;

      await finishPublicFlowModeration(flowId.value!, {
        status: 'Decline',
        decline_reason: formData.value.decline_reason!,
      });

      toastSuccess('Шаблон отклонён');
      return true;
    } catch (e) {
      if (!(e instanceof RequestError)) {
        toastError('Ошибка при отклонении шаблона');
        return false;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка при отклонении шаблона: ${e.message}`);
        return false;
      }

      setBackendErrors(formErrors, e.errors);
      toastError('Ошибка валидации формы');
      return false;
    } finally {
      loading.value = false;
    }
  };

  const resetForm = () => {
    formData.value.decline_reason = null;
    clearFormValidation(formErrors);
  };

  return {
    formData,
    formErrors,
    loading,
    onSubmit,
    resetForm,
  };
}

export default useDeclineFlowForm;
