import {
  createPublicFlowCategory,
  getPublicFlowCategory,
  updatePublicFlowCategory,
} from '~/domain/flow-category/api/flow-categories.api';
import type { PublicFlowCategoryCreate } from '~/domain/flow-category/models/flow-category.types';
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

function useFlowCategoryForm() {
  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/flow-categories');

  const formData = ref<FormFields<PublicFlowCategoryCreate>>({
    name: null,
  });

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);

  const formErrors = reactive<FormErrors<PublicFlowCategoryCreate>>({
    name: '',
  });
  const formRules = ref<FormRules<PublicFlowCategoryCreate>>({
    name: () => {
      if (!formData.value.name) {
        formErrors.name = ERROR_REQUIRED_FIELD;
        return false;
      }

      if (formData.value.name.length > 255) {
        formErrors.name = ERROR_MAX_LENGTH(255);
        return false;
      }

      return true;
    },
  });

  const route = useRoute();
  const router = useRouter();

  const getData = async () => {
    try {
      if (route.params.id && route.params.id !== 'create') {
        editId.value = route.params.id as EntityId;
        const response = await getPublicFlowCategory(editId.value);
        formData.value = {
          name: response.data.name,
        };
      }
    } catch (e) {
      toastError('Ошибка при получении данных категории шаблона');
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
        await updatePublicFlowCategory(
          editId.value,
          formData.value as PublicFlowCategoryCreate,
        );
      } else {
        await createPublicFlowCategory(
          formData.value as PublicFlowCategoryCreate,
        );
      }

      toastSuccess(
        editId.value
          ? 'Категория шаблона создана!'
          : 'Категория шаблона обновлена!',
      );
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in flow category create/update:', e);
        toastError('Ошибка создания или редактирования категории шаблонов');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(
          `Ошибка создания или редактирования категории шаблонов: ${e.message}`,
        );
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

export default useFlowCategoryForm;
