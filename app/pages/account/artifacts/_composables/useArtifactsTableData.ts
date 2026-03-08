import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';

import { getArtifacts } from '~/domain/artifact/api/artifacts.api';
import type { Artifact } from '~/domain/artifact/models/artifact.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type {
  JsonSerializable,
  ResponsePagination,
} from '~/shared/types/core/request.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useArtifactsTableData(options?: {
  requestParams?: () => Record<string, JsonSerializable>;
}) {
  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<Artifact[] | null>(null);
  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 10,
    per_page: 12,
    total: 10,
  });

  const getTableData = async (sortableProp?: string, sortableDir?: string) => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
        group_id: 'null', // <- Только общие артефакты
        // sortBy: sortableProp ?? 'created_at',
        // sortDirection: sortableDir ?? 'desc',
        ...options?.requestParams?.(),
      });

      const response = await getArtifacts(params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении артефактов');
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

export default useArtifactsTableData;
