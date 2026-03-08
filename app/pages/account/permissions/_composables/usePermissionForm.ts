import {
  createPermission,
  getPermission,
  updatePermission,
} from '~/domain/permission/api/permissions.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import {
  ERROR_MAX_LENGTH,
  ERROR_REQUIRED_FIELD,
} from '~/shared/constants/core/validation-errors.const';
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

interface PermissionForm {
  code: string | null;
}

function usePermissionForm() {
  const route = useRoute();
  const router = useRouter();

  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/permissions');

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);

  const formData = ref<FormFields<PermissionForm>>({
    code: null,
  });
  const formErrors = reactive<FormErrors<PermissionForm>>({
    code: '',
  });
  const formRules = ref<FormRules<PermissionForm>>({
    code: () => {
      if (!formData.value.code) {
        formErrors.code = ERROR_REQUIRED_FIELD;
        return false;
      }

      if (formData.value.code.length > 255) {
        formErrors.code = ERROR_MAX_LENGTH(255);
        return false;
      }

      return true;
    },
  });

  const getData = async () => {
    try {
      if (route.params.id && route.params.id !== 'create') {
        editId.value = route.params.id as EntityId;
        const response = await getPermission(editId.value);
        formData.value = {
          code: response.data.code,
        };
      }
    } catch (e) {
      toastError('Ошибка при получении данных роли');
      showRequestError(e);
    }
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    try {
      loading.value = true;
      if (editId.value) {
        await updatePermission(
          editId.value,
          formData.value as { code: string },
        );
      } else {
        await createPermission(formData.value as { code: string });
      }

      toastSuccess(editId.value ? 'Доступ обновлен!' : 'Доступ создана!');
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in permission create/update:', e);
        toastError('Ошибка создания или редактирования доступа');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка создания или редактирования доступа: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors, e.errors);
      toastError('Ошибка валидации формы');
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

    getData,
    onSubmit,
    getBack,
  };
}

export default usePermissionForm;
