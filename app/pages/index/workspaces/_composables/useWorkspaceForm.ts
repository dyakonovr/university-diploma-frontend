import { createWorkspace } from '~/domain/workspace/api/workspace.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import type { FormErrors, FormRules } from '~/shared/types/core/form-validation.types';
import { clearFormValidation, validateForm } from '~/shared/utils/core/formValidation';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useWorkspaceForm() {
  const { toastSuccess, toastError } = useCustomToast();
  const router = useRouter();
  const { getBack } = useGetBack('/workspaces');

  const loading = ref(false);
  const name = ref('');

  const formErrors = reactive<FormErrors<{ name: string }>>({
    name: '',
  });

  const formRules = ref<FormRules<{ name: string }>>({
    name: () => {
      if (!name.value.trim()) {
        formErrors.name = ERROR_REQUIRED_FIELD;
        return false;
      }
      return true;
    },
  });

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    if (!validateForm(formRules.value as Record<string, () => boolean>)) return;

    loading.value = true;
    try {
      const response = await createWorkspace({ name: name.value, owner_id: '' } as any);
      toastSuccess('Воркспейс создан');
      router.push(`/workspaces/${response.data.id}`);
    } catch (e) {
      toastError('Ошибка при создании воркспейса');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return { loading, name, formErrors, onSubmit, getBack };
}

export default useWorkspaceForm;
