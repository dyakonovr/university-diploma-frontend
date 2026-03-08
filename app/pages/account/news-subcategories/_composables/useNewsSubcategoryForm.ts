import {
  getNewsCategories,
  getNewsCategory,
} from '~/domain/news-category/api/news-categories.api';
import type { NewsCategory } from '~/domain/news-category/models/news-category.types';
import {
  createNewsSubcategory,
  getNewsSubcategory,
  updateNewsSubcategory,
} from '~/domain/news-subcategory/api/news-subcategories.api';
import type { NewsSubcategoryCreate } from '~/domain/news-subcategory/models/news-subcategory.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
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

function useNewsSubcategoryForm() {
  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/news-subcategories');

  const formData = ref<FormFields<NewsSubcategoryCreate>>({
    name: null,
    is_visible: null,
    category_id: null,
  });

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);

  const categories = useSelectInfiniteScroll<NewsCategory>({
    mapFunc: (item) => ({
      label: item.name,
      value: item.id,
      is_visible: item.is_visible,
    }),
    requestFunc: getNewsCategories,
    errorMessage: 'Ошибка при получении категорий новостей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
    getOneRequestFunc: getNewsCategory,
    currentModelValue: () => formData.value.category_id,
  });

  const formErrors = reactive<FormErrors<NewsSubcategoryCreate>>({
    name: '',
    is_visible: '',
    category_id: '',
  });
  const formRules = ref<FormRules<NewsSubcategoryCreate>>({
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
    category_id: () => {
      if (!formData.value.category_id) {
        formErrors.category_id = ERROR_REQUIRED_FIELD;
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
        const response = await getNewsSubcategory(editId.value);
        formData.value = {
          name: response.data.name,
          is_visible: response.data.is_visible,
          category_id: response.data.category_id,
        };
      }
    } catch (e) {
      toastError('Ошибка при получении данных подкатегории новостей');
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
        await updateNewsSubcategory(
          editId.value,
          formData.value as NewsSubcategoryCreate,
        );
      } else {
        await createNewsSubcategory(formData.value as NewsSubcategoryCreate);
      }

      toastSuccess(
        editId.value
          ? 'Подкатегория новостей создана!'
          : 'Подкатегория новостей обновлена!',
      );
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in news subcategory create/update:', e);
        toastError('Ошибка создания или редактирования подкатегории новостей');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(
          `Ошибка создания или редактирования подкатегории новостей: ${e.message}`,
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
    categories,
    getData,
    onSubmit,
    getBack,
  };
}

export default useNewsSubcategoryForm;
