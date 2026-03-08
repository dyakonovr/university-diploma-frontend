import {
  createNews,
  getNewsById,
  updateImage,
  updateNews,
} from '~/domain/news/api/news.api';
import type { NewsCreate } from '~/domain/news/models/news.types';
import { getNewsHashtags } from '~/domain/news-hashtag/api/news-hashtag.api';
import type { NewsHashtag } from '~/domain/news-hashtag/models/news-hashtag.types';
import {
  getNewsSubcategories,
  getNewsSubcategory,
} from '~/domain/news-subcategory/api/news-subcategories.api';
import type { NewsSubcategory } from '~/domain/news-subcategory/models/news-subcategory.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import { RequestError } from '~/shared/errors/request.errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  FormErrors,
  FormFields,
  FormRules,
} from '~/shared/types/core/form-validation.types';
import type { SelectOption } from '~/shared/types/ui/select.types';
import {
  clearFormValidation,
  setBackendErrors,
  validateForm,
} from '~/shared/utils/core/formValidation';
import { showRequestError } from '~/shared/utils/core/show-request-error';

type FormData = Omit<NewsCreate, 'hashtag_ids'> & {
  hashtags: SelectOption<EntityId>[];
};

function useNewsForm() {
  const route = useRoute();
  const router = useRouter();

  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/news');

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);
  const isEditMode = computed(() => editId.value !== null);
  const previewImageUrl = ref<string | null>(null);
  const previewImageFile = ref<File | null>(null);
  const savedUrl = ref<string | null>(null);

  const formData = ref<FormFields<FormData>>({
    title: null,
    content: null,
    subcategory_id: null,
    seo_title: null,
    seo_description: null,
    is_visible: true,
    url: null,
    preview_image_key: '',
    hashtags: [],
  });
  const formErrors = reactive<FormErrors<FormData>>({
    title: '',
    content: '',
    subcategory_id: '',
    seo_description: '',
    seo_title: '',
    is_visible: '',
    url: '',
    hashtags: '',
  });
  const formRules = ref<FormRules<FormData>>({
    title: () => {
      if (!formData.value.title) {
        formErrors.title = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    subcategory_id: () => {
      if (!formData.value.subcategory_id) {
        formErrors.subcategory_id = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    content: () => {
      if (!formData.value.content) {
        formErrors.content = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    preview_image_key: () => {
      if (!formData.value.preview_image_key) {
        formErrors.preview_image_key = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    url: () => {
      if (!formData.value.url) {
        formErrors.url = ERROR_REQUIRED_FIELD;
      }

      if (formData.value.url && !/^[a-z0-9-]+$/i.test(formData.value.url)) {
        formErrors.url =
          'URL может содержать только латинские буквы, цифры и дефис';
        return false;
      }

      return true;
    },
  });

  const subcategories = useSelectInfiniteScroll<NewsSubcategory>({
    mapFunc: (item) => ({
      label: item.name,
      value: item.id,
      is_visible: item.is_visible,
    }),
    requestFunc: getNewsSubcategories,
    errorMessage: 'Ошибка при получении подкатегорий новостей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
    getOneRequestFunc: getNewsSubcategory,
    currentModelValue: () => formData.value.subcategory_id,
  });
  const hashtags = useSelectInfiniteScroll<NewsHashtag>({
    mapFunc: (item) => ({ label: item.name, value: item.id }),
    requestFunc: getNewsHashtags,
    errorMessage: 'Ошибка при получении хэштегов новостей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
  });

  const getData = async () => {
    try {
      if (route.params.id && route.params.id !== 'create') {
        editId.value = route.params.id as EntityId;
        const response = await getNewsById(editId.value);
        formData.value = {
          title: response.data.title,
          content: response.data.content,
          seo_title: response.data.seo_title,
          seo_description: response.data.seo_description,
          subcategory_id: response.data.subcategory_id,
          url: response.data.url,
          is_visible: response.data.is_visible,
          preview_image_key: response.data.preview_image_key,
          hashtags: response.data.hashtags.map((h) => ({
            label: h.name,
            value: h.id,
          })),
        };
        previewImageUrl.value = response.data.preview_image_url || null;
        savedUrl.value = response.data.url || null;
      }
    } catch (e) {
      toastError('Ошибка при получении данных новости');
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

      const body: NewsCreate = {
        ...formData.value,
        hashtag_ids: formData.value.hashtags?.map((h) => h.value) ?? [],
      };

      if (editId.value) {
        await updateNews(editId.value, body);
      } else {
        await createNews(body);
      }

      toastSuccess(editId.value ? 'Новость создана!' : 'Новость обновлена!');
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in news create/update:', e);
        toastError('Ошибка создания или редактирования новости');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка создания или редактирования новости: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  const onPreviewImageUploaded = async (file: File | null) => {
    if (!file) {
      formData.value.preview_image_key = '';
      previewImageUrl.value = null;
      return;
    }

    try {
      const fd = new FormData();
      fd.append('file', file);
      const response = await updateImage(fd);
      formData.value.preview_image_key = response.data.key;
      previewImageUrl.value = response.data.url;
    } catch {
      toastError('Ошибка загрузки изображения');
      previewImageFile.value = null;
    }
  };

  return {
    formData,
    formRules,
    formErrors,
    route,
    router,
    loading,
    isEditMode,
    editId,
    subcategories,
    hashtags,
    previewImageUrl,
    previewImageFile,
    savedUrl,
    getData,
    onSubmit,
    onPreviewImageUploaded,
    getBack,
  };
}

export default useNewsForm;
