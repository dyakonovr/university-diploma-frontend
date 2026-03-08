import {
  createBinaryArtifact,
  createTextArtifact,
  getArtifact,
  updateBinaryArtifact,
  updateTextArtifact,
} from '~/domain/artifact/api/artifacts.api';
import type {
  Artifact,
  ArtifactCreate,
} from '~/domain/artifact/models/artifact.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import { RequestError } from '~/shared/errors/request.errors';
import type { BackendErrors } from '~/shared/types/core/backend-errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  FormErrors,
  FormFields,
  FormRules,
} from '~/shared/types/core/form-validation.types';
import { clearFormValidation, setBackendErrors, validateForm } from '~/shared/utils/core/formValidation';
import { showRequestError } from '~/shared/utils/core/show-request-error';

type ArtifactForm = ArtifactCreate & {
  file: File;
};

function useArtifcatForm() {
  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/artifacts');

  const formData = ref<FormFields<ArtifactForm>>({
    text: null,
    file: null,
    s3_key: null,
    type: null,
    name: null,
  });

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);
  const isEditMode = computed(() => !!editId.value);
  /** Full artifact object from API (available in edit mode for binary preview) */
  const editArtifact = ref<Artifact | null>(null);

  const formErrors = reactive<FormErrors<ArtifactForm>>({
    text: '',
    s3_key: '',
    type: '',
    file: '',
    name: '',
  });
  const formRules = ref<FormRules<ArtifactForm>>({
    type: () => {
      if (!formData.value.type) {
        formErrors.type = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    text: () => {
      if (formData.value.type === 'text' && !formData.value.text) {
        formErrors.text = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    file: () => {
      if (formData.value.type === 'binary' && !formData.value.file) {
        formErrors.file = ERROR_REQUIRED_FIELD;
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
        const response = await getArtifact(editId.value);
        editArtifact.value = response.data;
        formData.value = {
          text: response.data.data,
          s3_key: response.data.s3_key,
          type: response.data.type,
          name: response.data.name,
          file: null,
        };
      }
    } catch (e) {
      toastError('Ошибка при получении данных артефакта');
      showRequestError(e);
    }
  };

  const customSetBackendErrors = (errors: BackendErrors) => {
    setBackendErrors(formErrors, errors);

    // Отдельно обрабатываем поле file
    if (errors['file']) {
      formErrors.file = errors['file'][0] ?? '';
    }
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    if (
      !isEditMode.value &&
      formData.value.type !== 'text' &&
      formData.value.file === null
    ) {
      return;
    }

    try {
      loading.value = true;

      if (formData.value.type === 'text') {
        const body = {
          text: formData.value.text ?? '',
          name: formData.value.name ?? '',
        };

        if (editId.value) await updateTextArtifact(editId.value, body);
        else await createTextArtifact(body);
      } else {
        const fd = new FormData();
        fd.append('file', formData.value.file!);
        if (formData.value.name) fd.append('name', formData.value.name);

        if (editId.value) await updateBinaryArtifact(editId.value, fd);
        else await createBinaryArtifact(fd);
      }

      toastSuccess(editId.value ? 'Артефакт создан!' : 'Артефакт обновлен!');
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in artifact create/update:', e);
        toastError('Ошибка создания или редактирования артефакта');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(
          `Ошибка создания или редактирования артефакта: ${e.message}`,
        );
        return;
      }

      customSetBackendErrors(e.errors);
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
    isEditMode,
    editId,
    editArtifact,
    getData,
    onSubmit,
    getBack,
  };
}

export default useArtifcatForm;
