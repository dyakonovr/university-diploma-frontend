import { getTasks } from '~/domain/task/api/task.api';
import type { Task } from '~/domain/task/models/task.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { ResponsePagination } from '~/shared/types/core/request.types';
import { mapPagination } from '~/shared/utils/core/mapPagination';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useTasksData(
  workspaceId: string,
  options?: {
    requestParams?: () => Record<string, string | null | number>;
  },
) {
  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<Task[]>([]);
  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 1,
    per_page: 20,
    total: 0,
  });

  const getTasksData = async () => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
        ...options?.requestParams?.(),
      });

      const response = await getTasks(workspaceId, params);

      data.value = response.data;
      meta.value = mapPagination(response.meta.pagination);
    } catch (e) {
      console.error(e);
      toastError('Ошибка при получении задач');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    data,
    meta,
    getTasksData,
  };
}

export default useTasksData;
