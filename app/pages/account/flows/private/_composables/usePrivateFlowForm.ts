import { getPrivateFlow } from '~/domain/flow/api/private-flows.api';
import type { FlowNeededSubscription } from '~/domain/flow/model/flow.general-types';
import type { PrivateFlowCreate } from '~/domain/flow/model/private-flow.types';
import type { Stage } from '~/domain/flow/model/stage.types';
import { validatePrivateFlowName } from '~/domain/flow/rules/private-flow.rules';
import { savePrivateFlow } from '~/domain/flow/usecases/private-flow.usecase';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
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
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function usePrivateFlowForm() {
  const route = useRoute();
  const router = useRouter();

  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/flows');

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);
  const stages = ref<Stage[] | null>(null);
  const accessible = ref(true);
  const neededSubscriptions = ref<FlowNeededSubscription[] | null>(null);

  const formData = ref<FormFields<PrivateFlowCreate>>({
    name: null,
  });
  const formErrors = reactive<FormErrors<PrivateFlowCreate>>({
    name: '',
  });
  const formRules = ref<FormRules<PrivateFlowCreate>>({
    name: () => {
      const res = validatePrivateFlowName(formData.value.name);
      formErrors.name = res.error;

      return res.isValid;
    },
  });

  const getData = async () => {
    try {
      if (route.params.id && route.params.id !== 'create') {
        editId.value = route.params.id as EntityId;

        const params = objectToQueryString({
          include_details: true,
        });

        const response = await getPrivateFlow(editId.value, params);
        formData.value = {
          name: response.data.name,
        };

        stages.value = response.data.stages ?? [];
        accessible.value = response.data.access?.accessible ?? true;
        neededSubscriptions.value =
          response.data.access?.needed_subscriptions ?? null;
      }
    } catch (e) {
      toastError('Ошибка при получении данных шаблона');
      showRequestError(e);
    }
  };

  const refreshAccessInfo = async () => {
    if (!editId.value) return;
    try {
      const params = objectToQueryString({ include_details: false });
      const response = await getPrivateFlow(editId.value, params);
      accessible.value = response.data.access?.accessible ?? true;
      neededSubscriptions.value =
        response.data.access?.needed_subscriptions ?? null;
    } catch {
      // silent — access info is non-critical
    }
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      throw new Error('Ошибка валидации');
    }

    try {
      loading.value = true;
      const response = await savePrivateFlow(
        editId.value,
        formData.value as PrivateFlowCreate,
      );
      return response;
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in flow create/update:', e);
        toastError('Ошибка создания или редактирования Шаблона');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка создания или редактирования Шаблона: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors, e.errors);
      toastError('Ошибка валидации формы');

      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    formData,
    formRules,
    formErrors,
    route,
    router,
    loading,
    editId,

    stages,
    accessible,
    neededSubscriptions,

    getData,
    onSubmit,
    refreshAccessInfo,
    getBack,

    toastSuccess,
    toastError,
  };
}

export default usePrivateFlowForm;
