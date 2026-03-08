import { createIntegration } from '~/domain/integration/api/integration.api';
import type { IntegrationCreate } from '~/domain/integration/models/integration.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import { RequestError } from '~/shared/errors/request.errors';
import type { FormErrors, FormFields, FormRules } from '~/shared/types/core/form-validation.types';
import type { SelectOption } from '~/shared/types/ui/select.types';
import { clearFormValidation, setBackendErrors, validateForm } from '~/shared/utils/core/formValidation';
import { showRequestError } from '~/shared/utils/core/show-request-error';

type IntegrationForm = {
  name: string;
  type: string;
};

function useIntegrationForm(workspaceId: string, onSuccess: () => void) {
  const { toastSuccess, toastError } = useCustomToast();

  const dialogVisible = ref(false);
  const loading = ref(false);

  const TYPE_OPTIONS: SelectOption[] = [
    { label: 'Трекер задач', value: 'task_tracker' },
    { label: 'CRM', value: 'crm' },
    { label: 'Мессенджер', value: 'messenger' },
    { label: 'Кастомная', value: 'custom' },
  ];

  const formData = ref<FormFields<IntegrationForm>>({
    name: null,
    type: 'task_tracker',
  });

  const formErrors = reactive<FormErrors<IntegrationForm>>({
    name: '',
    type: '',
  });

  const formRules = ref<FormRules<IntegrationForm>>({
    name: () => {
      if (!formData.value.name) {
        formErrors.name = ERROR_REQUIRED_FIELD;
        return false;
      }
      return true;
    },
  });

  const openDialog = () => {
    formData.value = { name: null, type: 'task_tracker' };
    clearFormValidation(formErrors);
    dialogVisible.value = true;
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value as Record<string, () => boolean>);
    if (!valid) return;

    loading.value = true;
    try {
      await createIntegration(workspaceId, {
        workspace_id: workspaceId,
        name: formData.value.name as string,
        type: formData.value.type as string,
        config: {},
        is_active: true,
        api_token: '',
      } as IntegrationCreate);
      toastSuccess('Интеграция добавлена');
      dialogVisible.value = false;
      onSuccess();
    } catch (e) {
      if (e instanceof RequestError && e.statusCode === 422) {
        setBackendErrors(formErrors, e.errors);
        toastError('Ошибка валидации');
      } else {
        toastError('Ошибка при создании интеграции');
        showRequestError(e);
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    dialogVisible,
    loading,
    formData,
    formErrors,
    TYPE_OPTIONS,
    openDialog,
    onSubmit,
  };
}

export default useIntegrationForm;
