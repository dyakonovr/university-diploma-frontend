import { getPermissions } from '~/domain/permission/api/permissions.api';
import type { Permission } from '~/domain/permission/models/permission.types';
import {
  bindPermission,
  createSubscription,
  getSubscription,
  getSubscriptionPermissions,
  unbindPermission,
  updateSubscription,
} from '~/domain/subscription/api/subscriptions.api';
import {
  parseSubscriptionPrice,
  prepareSubscriptionPrice,
} from '~/domain/subscription/utils/price.utils';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import {
  ERROR_MORE_OR_EQUAL,
  ERROR_REQUIRED_FIELD,
} from '~/shared/constants/core/validation-errors.const';
import { RequestError } from '~/shared/errors/request.errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  FormErrors,
  FormFields,
  FormRules,
} from '~/shared/types/core/form-validation.types';
import type { SelectOption } from '~/shared/types/ui/select.types';
import {
  setBackendErrors,
  validateForm,
} from '~/shared/utils/core/formValidation';

type FormData = {
  name: string;
  price: number;
  tokens_amount: number;
  tokens_interval: number;
};

function useSubscriptionForm() {
  const { getBack } = useGetBack('/account/subscriptions');

  const router = useRouter();
  const route = useRoute();
  const { toastSuccess, toastError } = useCustomToast();

  const loading = ref(false);
  const editId = ref<string | null>(null);

  const formData = ref<FormFields<FormData>>({
    name: null,
    price: null,
    tokens_amount: null,
    tokens_interval: null,
  });

  const formErrors = ref<FormErrors<FormData>>({
    name: '',
    price: '',
    tokens_amount: '',
    tokens_interval: '',
  });

  // Permissions
  const permissions = useSelectInfiniteScroll<Permission>({
    errorMessage: 'Ошибка при получении доступов',
    mapFunc: (item) => ({ label: item.code, value: item.id }),
    requestFunc: getPermissions,
    requestParams: (meta, searchValue) => ({
      code: searchValue,
      per_page: 30,
    }),
  });
  const selectedPermission = ref<EntityId | null>(null);
  const subscriptionPermissions = ref<SelectOption<EntityId>[]>([]);

  const formRules = ref<FormRules<FormData>>({
    name: () => {
      if (!formData.value.name?.trim()) {
        formErrors.value.name = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    price: () => {
      if (!formData.value.price) {
        formErrors.value.price = ERROR_REQUIRED_FIELD;
        return false;
      }

      if (formData.value.price < 0) {
        formErrors.value.price = ERROR_MORE_OR_EQUAL(0);
        return false;
      }

      return true;
    },
    tokens_amount: () => {
      if (!formData.value.tokens_amount) {
        formErrors.value.tokens_amount = ERROR_REQUIRED_FIELD;
        return false;
      }

      if (formData.value.tokens_amount < 0) {
        formErrors.value.tokens_amount = ERROR_MORE_OR_EQUAL(0);
        return false;
      }

      return true;
    },
    tokens_interval: () => {
      if (!formData.value.tokens_interval) {
        formErrors.value.tokens_interval = ERROR_REQUIRED_FIELD;
        return false;
      }

      if (formData.value.tokens_interval < 0) {
        formErrors.value.tokens_interval = ERROR_MORE_OR_EQUAL(0);
        return false;
      }

      return true;
    },
  });

  const getData = async () => {
    const id = route.params.id as string;
    if (!id || id === 'new') {
      editId.value = null;
      return;
    }

    editId.value = id;

    try {
      const response = await getSubscription(id);
      formData.value = {
        name: response.data.name,
        price: parseSubscriptionPrice(response.data.price),
        tokens_amount: response.data.tokens_amount,
        tokens_interval: response.data.tokens_interval,
      };

      await loadSubscriptionPermissions();
    } catch {
      toastError('Ошибка при загрузке подписки');
      router.push('/account/subscriptions');
    }
  };

  const loadSubscriptionPermissions = async () => {
    if (!editId.value) return;

    try {
      const response = await getSubscriptionPermissions(editId.value);
      subscriptionPermissions.value = response.data.map((el) => ({
        label: el.permission_code,
        value: el.permission_id,
      }));
    } catch {
      toastError('Ошибка при загрузке permissions');
    }
  };

  const onSubmit = async () => {
    if (!validateForm(formRules.value)) {
      toastError('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    try {
      loading.value = true;

      const dataToSend = {
        name: formData.value.name || '',
        price: prepareSubscriptionPrice(formData.value.price || 0),
        tokens_amount: formData.value.tokens_amount || 0,
        tokens_interval: formData.value.tokens_interval || 0,
      };

      if (editId.value) {
        await updateSubscription(editId.value, dataToSend);
        toastSuccess('Подписка успешно обновлена');
      } else {
        await createSubscription(dataToSend);
        toastSuccess('Подписка успешно создана');
      }

      router.push('/account/subscriptions');
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in subscription create/update:', e);
        toastError('Ошибка создания или редактирования подписки');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка создания или редактирования подписки: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors.value, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  const onBindPermission = async () => {
    if (!selectedPermission.value || !editId.value) return;

    try {
      loading.value = true;
      await bindPermission(editId.value, selectedPermission.value);
      toastSuccess('Permission успешно привязан');
      selectedPermission.value = '';
      await loadSubscriptionPermissions();
    } catch {
      toastError('Ошибка при привязке permission');
    } finally {
      loading.value = false;
    }
  };

  const onUnbindPermission = async (permissionId: string) => {
    if (!editId.value) return;

    try {
      loading.value = true;
      await unbindPermission(editId.value, permissionId);
      toastSuccess('Permission успешно отвязан');
      await loadSubscriptionPermissions();
    } catch {
      toastError('Ошибка при отвязке permission');
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    formData,
    formErrors,
    editId,
    subscriptionPermissions,
    permissions,
    selectedPermission,
    getData,
    getBack,
    onSubmit,
    onBindPermission,
    onUnbindPermission,
  };
}

export default useSubscriptionForm;
