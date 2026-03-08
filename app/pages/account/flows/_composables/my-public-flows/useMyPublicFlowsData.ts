import { useDebounceFn } from '@vueuse/core';

import { getMyPublicFlows } from '~/domain/flow/api/public-flows.api';
import type { PublicFlow } from '~/domain/flow/model/public-flow.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type {
  JsonSerializable,
  ResponsePagination,
} from '~/shared/types/core/request.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useMyPublicFlowsData(options?: {
  requestParams?: () => Record<string, JsonSerializable>;
}) {
  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<PublicFlow[] | null>(null);
  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 10,
    per_page: 12,
    total: 10,
  });

  const getTableData = async () => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
        ...options?.requestParams?.(),
      });

      const response = await getMyPublicFlows(params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении публичных шаблонов');
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

export default useMyPublicFlowsData;
