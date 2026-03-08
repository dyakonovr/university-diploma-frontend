import { deleteWorkspace, getWorkspace, updateWorkspace } from '~/domain/workspace/api/workspace.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import { RequestError } from '~/shared/errors/request.errors';
import type { FormErrors, FormFields, FormRules } from '~/shared/types/core/form-validation.types';
import { clearFormValidation, setBackendErrors, validateForm } from '~/shared/utils/core/formValidation';
import { showRequestError } from '~/shared/utils/core/show-request-error';

type WorkspaceForm = {
  name: string;
};

function useWorkspaceSettings(workspaceId: string) {
  const router = useRouter();
  const { toastSuccess, toastError } = useCustomToast();

  const loading = ref(false);
  const saving = ref(false);
  const deleting = ref(false);
  const deleteDialogVisible = ref(false);

  const formData = ref<FormFields<WorkspaceForm>>({
    name: null,
  });

  const formErrors = reactive<FormErrors<WorkspaceForm>>({
    name: '',
  });

  const formRules = ref<FormRules<WorkspaceForm>>({
    name: () => {
      if (!formData.value.name) {
        formErrors.name = ERROR_REQUIRED_FIELD;
        return false;
      }
      return true;
    },
  });

  const fetchWorkspace = async () => {
    loading.value = true;
    try {
      const response = await getWorkspace(workspaceId);
      formData.value.name = response.data.name;
    } catch (e) {
      toastError('Ошибка при загрузке воркспейса');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  const saveName = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value as Record<string, () => boolean>);
    if (!valid) return;

    saving.value = true;
    try {
      await updateWorkspace(workspaceId, { name: formData.value.name as string, owner_id: '' });
      toastSuccess('Название сохранено');
    } catch (e) {
      if (e instanceof RequestError && e.statusCode === 422) {
        setBackendErrors(formErrors, e.errors);
        toastError('Ошибка валидации');
      } else {
        toastError('Ошибка при сохранении');
        showRequestError(e);
      }
    } finally {
      saving.value = false;
    }
  };

  const confirmDelete = async () => {
    deleting.value = true;
    try {
      await deleteWorkspace(workspaceId);
      toastSuccess('Воркспейс удалён');
      deleteDialogVisible.value = false;
      await router.push('/workspaces');
    } catch (e) {
      toastError('Ошибка при удалении воркспейса');
      showRequestError(e);
    } finally {
      deleting.value = false;
    }
  };

  return {
    loading,
    saving,
    deleting,
    deleteDialogVisible,
    formData,
    formErrors,
    fetchWorkspace,
    saveName,
    confirmDelete,
  };
}

export default useWorkspaceSettings;
