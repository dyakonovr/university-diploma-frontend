import { getModel, getModels } from '~/domain/model/api/models.api';
import type { Model } from '~/domain/model/models/model.types';
import {
  getProvider,
  updateProvider,
} from '~/domain/provider/api/providers.api';
import type {
  Provider,
  ProviderUpdate,
} from '~/domain/provider/models/provider.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import { RequestError } from '~/shared/errors/request.errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  FormErrors,
  FormFields,
} from '~/shared/types/core/form-validation.types';
import { setBackendErrors } from '~/shared/utils/core/formValidation';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

import useProviderFormPermissions from './useProviderFormPermissions';

function useProviderForm() {
  const route = useRoute();
  const router = useRouter();

  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/providers');

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);

  const permissionsForm = useProviderFormPermissions(editId, () => getData());

  const formData = ref<FormFields<ProviderUpdate>>({
    computing_type: '',
    content_type: '',
    default_model_id: null,
    is_active: false,
    display_name: null,
    description: null,
  });
  const formErrors = reactive<FormErrors<ProviderUpdate>>({
    computing_type: '',
    content_type: '',
    default_model_id: '',
    is_active: '',
    display_name: '',
    description: '',
  });

  const models = useSelectInfiniteScroll<Model>({
    errorMessage: 'Ошибка при получении моделей',
    mapFunc: (item) => ({
      label: item.display_name || item.name,
      value: item.id,
    }),
    requestFunc: getModels,
    requestParams: (meta, searchValue) => ({
      display_name: searchValue,
      provider_id: editId.value,
    }),
    getOneRequestFunc: getModel,
    currentModelValue: () => formData.value.default_model_id,
  });

  const provider = ref<Provider | null>(null);

  const getData = async () => {
    try {
      if (route.params.id) {
        editId.value = route.params.id as EntityId;

        const queryParams = objectToQueryString({
          include_permissions: true,
        });

        const response = await getProvider(editId.value, queryParams);
        provider.value = response.data;
        formData.value = {
          computing_type: response.data.computing_type || '',
          content_type: response.data.content_type || '',
          default_model_id: response.data.default_model_id,
          is_active: response.data.is_active ?? true,
          display_name: response.data.display_name ?? null,
          description: response.data.description ?? null,
        };
      }
    } catch (e) {
      toastError('Ошибка при получении данных провайдера');
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

      const payload = {
        computing_type: formData.value.computing_type || '',
        content_type: formData.value.content_type || '',
        default_model_id: formData.value.default_model_id || '',
        is_active:
          formData.value.is_active === null ? false : formData.value.is_active,
        display_name: formData.value.display_name || null,
        description: formData.value.description || null,
      };
      await updateProvider(editId.value, payload);

      toastSuccess('Провайдер обновлён!');
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in provider create/update:', e);
        toastError('Ошибка создания или редактирования провайдера');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(
          `Ошибка создания или редактирования провайдера: ${e.message}`,
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
    formErrors,
    route,
    router,
    loading,
    editId,
    provider,

    models,

    permissionsForm,

    getData,
    onSubmit,
    getBack,
  };
}

export default useProviderForm;
