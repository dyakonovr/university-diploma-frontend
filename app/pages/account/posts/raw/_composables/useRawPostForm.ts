import type { RawPost } from '~/domain/raw-post/models/raw-post.types';
import { getRawPostById } from '~/domain/raw-post/usecases/raw-post.usecases';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useRawPostForm() {
  const { toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/posts?tab=raw');

  const data = ref<RawPost | null>(null);
  const editId = ref<EntityId | null>(null);

  const route = useRoute();
  const router = useRouter();

  const getData = async () => {
    try {
      if (route.params.id && route.params.id !== 'create') {
        editId.value = route.params.id as EntityId;
        const response = await getRawPostById(editId.value);
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
    editId,
    getData,
    getBack,
  };
}

export default useRawPostForm;
