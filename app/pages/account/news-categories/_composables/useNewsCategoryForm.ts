import {
  createNewsCategory,
  getNewsCategory,
  updateNewsCategory,
} from '~/domain/news-category/api/news-categories.api';
import type { NewsCategoryCreate } from '~/domain/news-category/models/news-category.types';
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

function useNewsCategoryForm() {
  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/news-categories');

  const formData = ref<FormFields<NewsCategoryCreate>>({
    name: null,
    is_visible: null,
  });

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);

  const formErrors = reactive<FormErrors<NewsCategoryCreate>>({
    name: '',
    is_visible: '',
  });
  const formRules = ref<FormRules<NewsCategoryCreate>>({
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
        const response = await getNewsCategory(editId.value);
        formData.value = {
          name: response.data.name,
          is_visible: response.data.is_visible,
        };
      }
    } catch (e) {
      toastError('Ошибка при получении данных категории новостей');
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
        await updateNewsCategory(
          editId.value,
          formData.value as NewsCategoryCreate,
        );
      } else {
        await createNewsCategory(formData.value as NewsCategoryCreate);
      }

      toastSuccess(
        editId.value
          ? 'Категория новости создана!'
          : 'Категория новости обновлена!',
      );
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in news category create/update:', e);
        toastError('Ошибка создания или редактирования категории новостей');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(
          `Ошибка создания или редактирования категории новостей: ${e.message}`,
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

export default useNewsCategoryForm;
