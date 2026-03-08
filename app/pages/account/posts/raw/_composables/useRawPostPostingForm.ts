import { getSocialAccounts } from '~/domain/social-account/api/social-account.api';
import type { SocialAccount } from '~/domain/social-account/models/social-account.types';
import type {
  SocialAccountProvider,
  SocialAccountProviderName,
} from '~/domain/social-account/models/social-account-provider';
import { getSocialAccountProviders } from '~/domain/social-account/usecases/social-account-provider.usecases';
import {
  bulkPublishSocialPostRequest,
  publishSocialPostRequest,
} from '~/domain/social-post/api/social-post.api';
import type { SocialPostData } from '~/domain/social-post/models/social-post-preview.types';
import { getSocialPostPreview } from '~/domain/social-post/usecases/social-post-preview.usecase';
import { useRawPostStore } from '~/pages/account/posts/raw/_stores/raw-post-form';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
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

import RawPostFormSuccessPublishToastContent from '../_components/RawPostFormSuccessPublishToastContent.vue';

type Form = {
  social_network: SocialAccountProviderName;
  post_time: Date;
  social_accounts: EntityId[];
};

const today: Date = new Date();
const minDate: Date = today;

export function useRawPostPostingForm() {
  const router = useRouter();

  const { toastSuccess, toastError } = useCustomToast();

  const rawPostStore = useRawPostStore();

  const globalLoading = computed(() => rawPostStore.isGlobalLoading);
  const loading = ref(false);

  const formData = ref<FormFields<Form>>({
    social_accounts: null,
    post_time: today,
    social_network: 'telegram',
  });
  const formErrors = reactive<FormErrors<Form>>({
    social_accounts: '',
    social_network: '',
    post_time: '',
  });
  const publishFormRules = ref<FormRules<Form>>({
    social_accounts: () => {
      if (!formData.value.social_accounts) {
        formErrors.social_accounts = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    post_time: () => {
      if (!formData.value.post_time) {
        formErrors.post_time = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
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

  const socialAccounts = useSelectInfiniteScroll<SocialAccount>({
    mapFunc: (item) => ({ label: item.account_name, value: item.id }),
    requestFunc: getSocialAccounts,
    errorMessage: 'Ошибка при получении аккаунтов соц. сетей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
      provider: formData.value.social_network,
    }),
  });

  // ----- PREVIEW -----

  const preview = ref<SocialPostData | null>(null);
  const previewLoading = ref(false);

  const getPreviewFormRules = ref<FormRules<Form>>({
    social_network: (): boolean => {
      if (!formData.value.social_network) {
        formErrors.social_network = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
  });

  const getPreview = async () => {
    const socialNetwork = formData.value.social_network;

    if (!socialNetwork || !rawPostStore.postId) return;

    rawPostStore.postingLoading = true;
    try {
      clearFormValidation(formErrors);

      const isValid = validateForm(getPreviewFormRules.value);
      if (!isValid) return;

      previewLoading.value = true;

      const response = await getSocialPostPreview({
        post_id: rawPostStore.postId,
        social_network_type: socialNetwork,
      });
      preview.value = response.data;
    } catch (e) {
      console.error(e);
      toastError('Ошибка при получении данных превью');
    } finally {
      previewLoading.value = false;
      rawPostStore.postingLoading = false;
    }
  };

  const publishPost = async () => {
    if (!rawPostStore.postId) return;

    try {
      clearFormValidation(formErrors);

      const isValid = validateForm(publishFormRules.value);
      if (!isValid) return;

      rawPostStore.postingLoading = true;

      if (
        !formData.value.social_accounts ||
        !formData.value.social_accounts.length
      )
        return;

      const isBulkPosting = formData.value.social_accounts.length > 1;
      let postId: EntityId | null = null;

      if (isBulkPosting) {
        await bulkPublishSocialPostRequest({
          accounts_id: formData.value.social_accounts,
          post_id: rawPostStore.postId,
          post_time: formData.value.post_time?.toISOString() || '',
        });
      } else {
        const response = await publishSocialPostRequest({
          account_id: formData.value.social_accounts?.[0] ?? '',
          post_id: rawPostStore.postId!,
          post_time: formData.value.post_time?.toISOString() || '',
        });
        postId = response.data.id;
      }

      rawPostStore.bumpSocialPostsRevision();

      toastSuccess(
        {
          component: RawPostFormSuccessPublishToastContent,
          props: {
            isBulkPosting,
            linkTo: !isBulkPosting && postId
              ? `/account/posts/social/${postId}`
              : '/account/posts?tab=social',
          },
        },
        {
          hideProgressBar: false,
        },
      );
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in raw post posting:', e);
        toastError('Ошибка публикации поста');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка публикации поста: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      rawPostStore.postingLoading = false;
    }
  };

  return {
    formData,
    formErrors,
    globalLoading,
    loading,

    minDate,

    socialAccounts,
    providers,

    preview,
    previewLoading,
    getPreview,
    publishPost,
  };
}
