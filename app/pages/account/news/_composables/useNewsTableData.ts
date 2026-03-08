import { useDebounceFn } from '@vueuse/core';

import { getNewsList } from '~/domain/news/api/news.api';
import type { News } from '~/domain/news/models/news.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type {
  JsonSerializable,
  ResponsePagination,
} from '~/shared/types/core/request.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useNewsTableData(options?: {
  requestParams?: () => Record<string, JsonSerializable>;
}) {
  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<News[] | null>(null);
  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 10,
    per_page: 10,
    total: 10,
  });

  const getTableData = async (sortableProp?: string, sortableDir?: string) => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
        // sortBy: sortableProp ?? 'created_at',
        // sortDirection: sortableDir ?? 'desc',
        ...options?.requestParams?.(),
      });

      const response = await getNewsList(params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении новостей');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  const debouncedGetTableData = useDebounceFn(getTableData, 500);

  return {
    loading,
    data,
    meta,
    getTableData,
    debouncedGetTableData,
  };
}

export default useNewsTableData;
