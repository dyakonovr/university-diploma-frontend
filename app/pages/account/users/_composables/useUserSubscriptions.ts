import { getSubscriptions } from '~/domain/subscription/api/subscriptions.api';
import {
  assignSubscriptionToUser,
  removeSubscriptionFromUser,
} from '~/domain/subscription/api/user-subscription-control.api';
import type {
  Subscription,
  SubscriptionUserWithDetails,
} from '~/domain/subscription/models/subscription.types';
import { getUserSubscriptions } from '~/domain/user/api/tarification/tarification.admin-api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  FormErrors,
  FormFields,
  FormRules,
} from '~/shared/types/core/form-validation.types';
import {
  clearFormValidation,
  validateForm,
} from '~/shared/utils/core/formValidation';

type AssignDescriptionForm = {
  selectedSubscriptionId: EntityId;
  expiresAt: Date;
};

function useUserSubscriptions(userId: Ref<EntityId | null>) {
  const { toastSuccess, toastError } = useCustomToast();

  const loading = ref(false);

  const userSubscriptions = ref<SubscriptionUserWithDetails[]>([]);

  const availableSubscriptions = useSelectInfiniteScroll<Subscription>({
    errorMessage: 'Ошибка при получении подписок',
    mapFunc: (item) => ({ label: item.name, value: item.id }),
    requestFunc: getSubscriptions,
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
  });

  const formData = ref<FormFields<AssignDescriptionForm>>({
    selectedSubscriptionId: null,
    expiresAt: null,
  });
  const formErrors = ref<FormErrors<AssignDescriptionForm>>({
    expiresAt: '',
    selectedSubscriptionId: '',
  });
  const formRules = ref<FormRules<AssignDescriptionForm>>({
    expiresAt: () => {
      if (formData.value.expiresAt === null) {
        formErrors.value.expiresAt = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    selectedSubscriptionId: () => {
      if (formData.value.selectedSubscriptionId === null) {
        formErrors.value.selectedSubscriptionId = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
  });

  const resetForm = () => {
    formData.value = {
      expiresAt: null,
      selectedSubscriptionId: null,
    };
  };

  const loadUserSubscriptions = async () => {
    if (!userId.value) return;

    try {
      loading.value = true;

      const response = await getUserSubscriptions(userId.value);
      userSubscriptions.value = response.data;
    } catch {
      toastError('Ошибка загрузки данных подписок пользователя');
    } finally {
      loading.value = false;
    }
  };

  const assignSubscription = async () => {
    if (!userId.value) return;

    try {
      clearFormValidation(formErrors.value);

      const isValid = validateForm(formRules.value);
      if (!isValid) {
        toastError('Ошибка валидации');
        return;
      }

      loading.value = true;
      await assignSubscriptionToUser({
        user_id: userId.value,
        subscription_id: formData.value.selectedSubscriptionId || '',
        expires_at: formData.value.expiresAt?.toISOString() ?? '',
      });
      toastSuccess('Подписка назначена, информация обновится в течении 5-10 минут');
      resetForm();
      await loadUserSubscriptions();
    } catch {
      toastError('Ошибка назначения подписки');
    } finally {
      loading.value = false;
    }
  };

  const removeSubscription = async (subscriptionUserId: EntityId) => {
    try {
      loading.value = true;
      await removeSubscriptionFromUser(subscriptionUserId);
      toastSuccess('Подписка удалена');
      // TODO: просто удалить из массива?
      await loadUserSubscriptions();
    } catch {
      toastError('Ошибка удаления подписки');
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    userSubscriptions,
    availableSubscriptions,

    formData,
    formErrors,
    formRules,

    loadUserSubscriptions,
    assignSubscription,
    removeSubscription,
  };
}

export default useUserSubscriptions;
