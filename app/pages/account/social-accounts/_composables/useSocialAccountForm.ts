import {
  getSocialAccount,
  getSocialAccountCredentials,
} from '~/domain/social-account/api/social-account.api';
import type { SocialAccountCreate } from '~/domain/social-account/models/social-account.types';
import type { SocialAccountProvider } from '~/domain/social-account/models/social-account-provider';
import {
  validateSocialAccountCredentials,
  validateSocialAccountName,
  validateSocialAccountProvider,
  validateSocialAccountProxyHttp,
} from '~/domain/social-account/services/social-account.validation';
import { saveSocialAccount } from '~/domain/social-account/usecases/social-account.usecases';
import { getSocialAccountProviders } from '~/domain/social-account/usecases/social-account-provider.usecases';
import type {
  SocialAccountCredentialsErrors,
  SocialAccountViewModel,
} from '~/domain/social-account/view-models/social-account.view-models';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import { RequestError } from '~/shared/errors/request.errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  FormErrors,
  FormFields,
  FormRules,
} from '~/shared/types/core/form-validation.types';
import { validateForm } from '~/shared/utils/core/formValidation';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useSocialAccountForm() {
  const route = useRoute();
  const router = useRouter();

  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/social-accounts');

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);
  const isEditMode = computed(() => !!editId.value);

  const credentialsLoading = ref(false);

  const formData = ref<FormFields<SocialAccountViewModel>>({
    account_name: null,
    is_active: true,
    provider: null,
    credentials: null,
    proxy_http: null,
    proxy_https: null,
  });
  const formErrors = reactive<FormErrors<SocialAccountViewModel>>({
    account_name: '',
    is_active: '',
    provider: '',
    proxy_http: '',
    proxy_https: '',
  });
  const credentialsErrors = ref<SocialAccountCredentialsErrors>({});
  const formRules = ref<FormRules<SocialAccountViewModel>>({
    account_name: () => {
      const res = validateSocialAccountName(formData.value.account_name);
      formErrors.account_name = res.error;

      return res.isValid;
    },
    provider: () => {
      const res = validateSocialAccountProvider(formData.value.provider);
      formErrors.provider = res.error;

      return res.isValid;
    },
    proxy_http: () => {
      const res = validateSocialAccountProxyHttp(formData.value.proxy_http);
      formErrors.proxy_http = res.error;

      return res.isValid;
    },
  });

  const providers = useSelectInfiniteScroll<SocialAccountProvider>({
    mapFunc: (item) => ({ label: item.name, value: item.name }),
    requestFunc: getSocialAccountProviders,
    errorMessage: 'Ошибка при получении соц. сетей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
  });
  const currentProvider = computed<SocialAccountProvider | null>(() => {
    if (!formData.value.provider) return null;
    return (
      providers.rawData.value?.find(
        (el) => el.name === formData.value.provider,
      ) ?? null
    );
  });

  const getData = async () => {
    try {
      if (route.params.id && route.params.id !== 'create') {
        editId.value = route.params.id as EntityId;
        const response = await getSocialAccount(editId.value);
        formData.value = {
          account_name: response.data.account_name,
          is_active: response.data.is_active,
          provider: response.data.provider,
          credentials: null, // Нужно получать отдельным запросом, см. fetchCredentials
          proxy_http: response.data.proxy_http,
          proxy_https: response.data.proxy_https,
        };
      }
    } catch (e) {
      toastError('Ошибка при получении данных аккаунта');
      showRequestError(e);
    }
  };

  const fetchCredentials = async () => {
    try {
      credentialsLoading.value = true;

      if (!editId.value)
        throw new Error(
          'Ошибка при получении Credentials: ID аккаунта не найден',
        );

      const response = await getSocialAccountCredentials(editId.value);
      formData.value.credentials = response.data.credentials ?? {};
    } catch (error) {
      console.error('@SocialAccount fetch credentials error:', error);
      toastError('Ошибка при получении данных для подключения аккаунта');
    } finally {
      credentialsLoading.value = false;
    }
  };

  const clearFormValidation = () => {
    formErrors.account_name = '';
    formErrors.is_active = '';
    formErrors.provider = '';

    credentialsErrors.value = {};
  };

  const customValidateForm = (): boolean => {
    if (!currentProvider.value)
      throw new Error('Ошибка при поиске текущего Provider');

    const isMainFormValid = validateForm(formRules.value);
    const credsValidation = validateSocialAccountCredentials(
      formData.value.credentials ?? {},
      currentProvider.value,
    );

    for (const field in credsValidation.errors) {
      if (!Object.hasOwn(credsValidation.errors, field)) continue;

      const validationResult = credsValidation.errors[field];
      if (!validationResult) continue;

      if (!validationResult.isValid) {
        credentialsErrors.value[field] = validationResult.error ?? null;
      }
    }

    return isMainFormValid && credsValidation.isValid;
  };

  const customSetValidationErrors = (errors: Record<string, string[]>) => {
    for (const field in errors) {
      if (field.startsWith('credentials')) {
        const credentialField = field.split('credentials.');
        credentialsErrors.value[credentialField[1] || ''] =
          errors[field]?.[0] ?? '';
      } else if (field in formErrors) {
        formErrors[field] = errors[field]?.[0] ?? '';
      }
    }
  };

  const onSubmit = async () => {
    clearFormValidation();
    const valid = customValidateForm();
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    try {
      loading.value = true;

      const body: SocialAccountCreate = {
        ...(formData.value as SocialAccountCreate),
      };

      // При редактировании пользователь может не запрашивать credentials,
      // из-за чего мы не должны отправлять это поле
      if (isEditMode.value && !body.credentials) {
        delete body.credentials;
      }

      await saveSocialAccount(editId.value, body);
      toastSuccess(editId.value ? 'Аккаунт создан!' : 'Аккаунт обновлён!');
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in social account create/update:', e);
        toastError('Ошибка создания или редактирования аккаунта');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка создания или редактирования аккаунта: ${e.message}`);
        return;
      }

      customSetValidationErrors(e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  return {
    isEditMode,
    editId,
    formData,
    formRules,
    formErrors,
    credentialsErrors,
    route,
    router,
    loading,
    providers,
    credentialsLoading,
    currentProvider,
    getData,
    fetchCredentials,
    onSubmit,
    getBack,
  };
}

export default useSocialAccountForm;
