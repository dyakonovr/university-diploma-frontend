import type { SocialPost } from '~/domain/social-post/models/social-post.types';
import { getSocialPost } from '~/domain/social-post/usecases/social-post.usecase';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useSocialPostForm() {
  const { toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/posts?tab=social');

  const data = ref<SocialPost | null>(null);
  
  const loading = ref(false);
  const editId = ref<EntityId | null>(null);

  const route = useRoute();
  const router = useRouter();

  const getData = async () => {
    try {
      if (route.params.id && route.params.id !== 'create') {
        editId.value = route.params.id as EntityId;
        const response = await getSocialPost(editId.value);
        data.value = response.data;
      }
    } catch (e) {
      toastError('Ошибка при получении данных поста');
      showRequestError(e);
    }
  };

  return {
    data,
    route,
    router,
    loading,
    editId,
    getData,
    getBack,
  };
}

export default useSocialPostForm;
