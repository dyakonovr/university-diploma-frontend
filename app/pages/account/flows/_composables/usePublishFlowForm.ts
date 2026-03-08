import { publishPrivateFlow } from '~/domain/flow/api/private-flows.api';
import type { PublishPrivateFlowBody } from '~/domain/flow/model/private-flow.types';
import {
  validatePublishFlowCategoryId,
  validatePublishFlowDescription,
  validatePublishFlowName,
  validatePublishFlowSocialNetworks,
} from '~/domain/flow/rules/publish-flow.rules';
import { getPublicFlowCategories } from '~/domain/flow-category/api/flow-categories.api';
import type { PublicFlowCategory } from '~/domain/flow-category/models/flow-category.types';
import type { SocialAccountProvider } from '~/domain/social-account/models/social-account-provider';
import { getSocialAccountProviders } from '~/domain/social-account/usecases/social-account-provider.usecases';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
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

function usePublishFlowForm() {
  const router = useRouter();
  const { toastSuccess, toastError } = useCustomToast();

  const loading = ref(false);

  const formData = ref<FormFields<PublishPrivateFlowBody>>({
    name: null,
    description: null,
    category_id: null,
    social_networks: null,
  });

  const formErrors = reactive<FormErrors<PublishPrivateFlowBody>>({
    name: '',
    description: '',
    category_id: '',
    social_networks: '',
  });

  const formRules = ref<FormRules<PublishPrivateFlowBody>>({
    name: () => {
      const res = validatePublishFlowName(formData.value.name);
      formErrors.name = res.error;
      return res.isValid;
    },
    description: () => {
      const res = validatePublishFlowDescription(formData.value.description);
      formErrors.description = res.error;
      return res.isValid;
    },
    category_id: () => {
      const res = validatePublishFlowCategoryId(formData.value.category_id);
      formErrors.category_id = res.error;
      return res.isValid;
    },
    social_networks: () => {
      const res = validatePublishFlowSocialNetworks(formData.value.social_networks);
      formErrors.social_networks = res.error;
      return res.isValid;
    },
  });

  const categories = useSelectInfiniteScroll<PublicFlowCategory>({
    mapFunc: (item) => ({ label: item.name, value: item.id }),
    requestFunc: getPublicFlowCategories,
    errorMessage: 'Ошибка при получении категорий шаблонов',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
  });

  const socialNetworks = useSelectInfiniteScroll<SocialAccountProvider>({
    mapFunc: (item) => ({ label: item.name, value: item.name }),
    requestFunc: getSocialAccountProviders,
    errorMessage: 'Ошибка при получении соц. сетей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
  });

  const initForm = (flowName: string) => {
    formData.value.name = flowName;
  };

  const loadSelectData = async () => {
    await Promise.all([
      categories.getData(1),
      socialNetworks.getData(1),
    ]);
  };

  const onPublish = async (flowId: EntityId, done?: () => void) => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    try {
      loading.value = true;
      await publishPrivateFlow(flowId, formData.value as PublishPrivateFlowBody);
      toastSuccess('Шаблон успешно опубликован!');
      done?.();
      router.push('/account/flows?tab=myPublic');
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('On publish private flow error:', e);
        toastError('Ошибка при публикации шаблона');
        return;
      }

      if (e.statusCode === 422) {
        setBackendErrors(formErrors, e.errors);
        toastError('Ошибка валидации формы');
        return;
      }

      if (e.statusCode === 409) {
        toastError('Ошибка при публикации шаблона: нельзя опубликовать шаблон повторно');
        return;
      }

      toastError('Ошибка при публикации шаблона');
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    formData,
    formErrors,
    categories,
    socialNetworks,
    initForm,
    loadSelectData,
    onPublish,
  };
}

export default usePublishFlowForm;
