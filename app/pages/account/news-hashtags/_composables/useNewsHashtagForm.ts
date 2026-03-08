import {
  createNewsHashtag,
  getNewsHashtag,
  updateNewsHashtag,
} from '~/domain/news-hashtag/api/news-hashtag.api';
import { NEWS_HASHTAG_NAME_PATTERN } from '~/domain/news-hashtag/constants/news-hashtag.const';
import type { NewsHashtagCreate } from '~/domain/news-hashtag/models/news-hashtag.types';
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
  const { getBack } = useGetBack('/account/news-hashtags');

  const formData = ref<FormFields<NewsHashtagCreate>>({
    name: null,
  });

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);

  const formErrors = reactive<FormErrors<NewsHashtagCreate>>({
    name: '',
  });
  const formRules = ref<FormRules<NewsHashtagCreate>>({
    name: () => {
      if (!formData.value.name) {
        formErrors.name = ERROR_REQUIRED_FIELD;
        return false;
      }

      if (!NEWS_HASHTAG_NAME_PATTERN.test(formData.value.name)) {
        formErrors.name = 'Допустимы только #, буквы, цифры 1-9 и _';
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
        const response = await getNewsHashtag(editId.value);
        formData.value = {
          name: response.data.name,
        };
      }
    } catch (e) {
      toastError('Ошибка при получении данных хэштега новостей');
      showRequestError(e);
    }
  };

  const save = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      throw new Error('Ошибка валидации');
    }

    try {
      loading.value = true;
      let response;
      if (editId.value) {
        response = await updateNewsHashtag(
          editId.value,
          formData.value as NewsHashtagCreate,
        );
      } else {
        response = await createNewsHashtag(formData.value as NewsHashtagCreate);
      }
      return response;
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in news hashtag create/update:', e);
        toastError('Ошибка создания или редактирования хэштега новостей');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(
          `Ошибка создания или редактирования хэштега новостей: ${e.message}`,
        );
        return;
      }

      setBackendErrors(formErrors, e.errors);
      toastError('Ошибка валидации формы');
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const onSubmit = async () => {
    try {
      await save();
      toastSuccess(editId.value ? 'Хэштег обновлён!' : 'Хэштег создан!');
      getBack();
    } catch {
      // handled in save()
    }
  };

  const onSubmitAndContinue = async () => {
    try {
      await save();
      formData.value.name = null;
      toastSuccess(editId.value ? 'Хэштег сохранён!' : 'Хэштег создан!');
    } catch {
      // handled in save()
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
    onSubmitAndContinue,
    getBack,
  };
}

export default useNewsCategoryForm;
