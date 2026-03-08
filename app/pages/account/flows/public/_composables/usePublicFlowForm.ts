import { getPublicFlow } from '~/domain/flow/api/public-flows.api';
import type { PublicFlowCreate } from '~/domain/flow/model/public-flow.types';
import type { Stage } from '~/domain/flow/model/stage.types';
import {
  validatePublicFlowDescription,
  validatePublicFlowName,
} from '~/domain/flow/rules/public-flow.rules';
import { savePublicFlow } from '~/domain/flow/usecases/public-flow.usecase';
import type { SocialAccountProviderName } from "~/domain/social-account/models/social-account-provider";
import useUserStore from '~/domain/user/stores/user';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
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
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

type PublicFlowFormFields = Pick<PublicFlowCreate, 'name' | 'description'>;

type AvailableSubscription = {
  id: EntityId;
  name: string;
  price: number;
  covers_all: boolean;
};

function usePublicFlowForm() {
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/flows');

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);
  const stages = ref<Stage[] | null>(null);

  const infoData = ref<{
    flowUserId: EntityId | null;
    categoryName: string | null;
    socials: SocialAccountProviderName[] | null;
    declineReason: string | null;
    accessible: boolean;
    neededSubscriptions: AvailableSubscription[] | null;
  }>({
    flowUserId: null,
    categoryName: null,
    socials: null,
    declineReason: null,
    accessible: true,
    neededSubscriptions: null,
  });
  
  const likesCount = ref(0);
  const copyCount = ref(0);
  const isLiked = ref(false);
  const isCopied = ref(false);

  const isOwner = computed(() => {
    if (!infoData.value.flowUserId || !userStore.user?.id) return false;
    return infoData.value.flowUserId === userStore.user.id;
  });

  const formData = ref<FormFields<PublicFlowFormFields>>({
    name: null,
    description: null,
  });
  const formErrors = reactive<FormErrors<PublicFlowFormFields>>({
    name: '',
    description: '',
  });
  const formRules = ref<FormRules<PublicFlowFormFields>>({
    name: () => {
      const res = validatePublicFlowName(formData.value.name);
      formErrors.name = res.error;

      return res.isValid;
    },
    description: () => {
      const res = validatePublicFlowDescription(formData.value.description);
      formErrors.description = res.error;

      return res.isValid;
    },
  });

  const getData = async () => {
    try {
      if (route.params.id && route.params.id !== 'create') {
        editId.value = route.params.id as EntityId;

        const params = objectToQueryString({
          include_details: true,
        });

        const response = await getPublicFlow(editId.value, params);
        formData.value = {
          name: response.data.name,
          description: response.data.description,
        };

        infoData.value = {
          flowUserId: response.data.user_id,
          socials: response.data.social_networks ?? null,
          categoryName: response.data.category?.name ?? null,
          declineReason: response.data.decline_reason ?? null,
          accessible: response.data.access?.accessible ?? true,
          neededSubscriptions: response.data.access?.needed_subscriptions ?? null,
        };
        
        likesCount.value = response.data.likes_count ?? 0;
        copyCount.value = response.data.copy_count ?? 0;
        isLiked.value = response.data.is_liked ?? false;
        isCopied.value = response.data.is_copied ?? false;
        stages.value = response.data.flow_data?.stages ?? [];
      }
    } catch (e) {
      toastError('Ошибка при получении данных публичного шаблона');
      showRequestError(e);
    }
  };

  const refreshAccessInfo = async () => {
    if (!editId.value) return;
    try {
      const params = objectToQueryString({ include_details: false });
      const response = await getPublicFlow(editId.value, params);
      infoData.value.accessible = response.data.access?.accessible ?? true;
      infoData.value.neededSubscriptions = response.data.access?.needed_subscriptions ?? null;
    } catch {
      // silent — access info is non-critical
    }
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      throw new Error('Ошибка валидации');
    }

    try {
      loading.value = true;

      if (!editId.value) {
        throw new Error('Публичный шаблон можно только редактировать');
      }

      await savePublicFlow(editId.value, formData.value as PublicFlowCreate);
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in public flow update:', e);
        toastError('Ошибка редактирования Шаблона');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка редактирования Шаблона: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors, e.errors);
      toastError('Ошибка валидации формы');

      throw e;
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
    isOwner,
    infoData,
    
    likesCount,
    copyCount,
    isLiked,
    isCopied,

    stages,

    getData,
    onSubmit,
    refreshAccessInfo,
    getBack,

    toastSuccess,
    toastError,
  };
}

export default usePublicFlowForm;
