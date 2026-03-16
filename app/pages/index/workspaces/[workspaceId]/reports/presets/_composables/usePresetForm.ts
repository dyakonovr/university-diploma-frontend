import {
  createReportPreset,
  getReportPreset,
  updateReportPreset,
} from '~/domain/report/api/report-preset.api';
import type { ReportPresetCreate } from '~/domain/report/models/report.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
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
import { showRequestError } from '~/shared/utils/core/show-request-error';

type PresetForm = {
  title: string;
  description: string;
  prompt: string;
};

function usePresetForm(workspaceId: string) {
  const { toastSuccess, toastError } = useCustomToast();
  const route = useRoute();
  const { getBack } = useGetBack(`/workspaces/${workspaceId}/reports/presets`);

  const loading = ref(false);
  const saving = ref(false);
  const editId = ref<EntityId | null>(null);
  const isEditMode = computed(() => editId.value !== null);

  const formData = ref<FormFields<PresetForm>>({
    title: null,
    description: null,
    prompt: null,
  });

  const formErrors = reactive<FormErrors<PresetForm>>({
    title: '',
    description: '',
    prompt: '',
  });

  const formRules = ref<FormRules<PresetForm>>({
    title: () => {
      if (!formData.value.title) {
        formErrors.title = ERROR_REQUIRED_FIELD;
        return false;
      }
      return true;
    },
    prompt: () => {
      if (!formData.value.prompt) {
        formErrors.prompt = ERROR_REQUIRED_FIELD;
        return false;
      }
      return true;
    },
  });

  const getData = async () => {
    const paramId = route.params.presetId;
    if (paramId && paramId !== 'create') {
      editId.value = paramId as EntityId;
      loading.value = true;
      try {
        const response = await getReportPreset(editId.value, workspaceId);
        const preset = response.data;
        formData.value = {
          title: preset.title,
          description: preset.description,
          prompt: preset.prompt,
        };
      } catch (e) {
        toastError('Ошибка при получении пресета');
        showRequestError(e);
      } finally {
        loading.value = false;
      }
    }
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(
      formRules.value as Record<string, () => boolean>,
    );
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    saving.value = true;
    try {
      const data: ReportPresetCreate = {
        title: formData.value.title as string,
        description: (formData.value.description as string) || '',
        prompt: formData.value.prompt as string,
      };

      if (editId.value) {
        await updateReportPreset(editId.value, workspaceId, data);
        toastSuccess('Пресет обновлён');
      } else {
        await createReportPreset(workspaceId, data);
        toastSuccess('Пресет создан');
      }
      getBack();
    } catch (e) {
      if (e instanceof RequestError && e.statusCode === 422) {
        setBackendErrors(formErrors, e.errors);
        toastError('Ошибка валидации формы');
      } else {
        toastError('Ошибка при сохранении пресета');
        showRequestError(e);
      }
    } finally {
      saving.value = false;
    }
  };

  return {
    loading,
    saving,
    editId,
    isEditMode,
    formData,
    formErrors,
    getData,
    onSubmit,
    getBack,
  };
}

export default usePresetForm;
