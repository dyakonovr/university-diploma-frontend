import { getModel, updateModel } from '~/domain/model/api/models.api';
import type { Model, ModelUpdate } from '~/domain/model/models/model.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import { RequestError } from '~/shared/errors/request.errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  FormErrors,
  FormFields,
} from '~/shared/types/core/form-validation.types';
import { setBackendErrors } from '~/shared/utils/core/formValidation';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

import useModelFormPermissions from './useModelFormPermissions';

function useModelForm() {
  const route = useRoute();
  const router = useRouter();

  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/models');

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);

  const permissionsForm = useModelFormPermissions(editId, () => getData());

  const formData = ref<FormFields<ModelUpdate>>({
    is_active: true,
    display_name: null,
    description: null,
  });
  const formErrors = ref<FormErrors<ModelUpdate>>({
    is_active: '',
    display_name: '',
    description: '',
  });

  const model = ref<Model | null>(null);

  const getData = async () => {
    try {
      if (route.params.id) {
        editId.value = route.params.id as EntityId;

        const query = objectToQueryString({
          add_provider_name: true,
          include_permissions: true,
        });

        const response = await getModel(editId.value, query);

        model.value = response.data;
        formData.value = {
          is_active: response.data.is_active ?? true,
          display_name: response.data.display_name ?? null,
          description: response.data.description ?? null,
        };
      }
    } catch (e) {
      toastError('Ошибка при получении данных модели');
      showRequestError(e);
    }
  };

  const onSubmit = async () => {
    // clearFormValidation(formErrors);
    // const valid = validateForm(formRules.value);
    // if (!valid) {
    //   toastError('Ошибка валидации');
    //   return;
    // }

    if (!editId.value) return;

    try {
      loading.value = true;
      await updateModel(editId.value, {
        is_active: formData.value.is_active ?? false,
        display_name: formData.value.display_name || null,
        description: formData.value.description || null,
      });

      toastSuccess('Модель обновлена!');
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in model updating:', e);
        toastError('Ошибка редактирования модели');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка редактирования модели: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors.value, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  return {
    formData,
    formErrors,
    route,
    router,
    loading,
    editId,
    model,
    permissionsForm,

    getData,
    onSubmit,
    getBack,
  };
}

export default useModelForm;
