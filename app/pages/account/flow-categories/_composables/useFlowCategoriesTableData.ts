import { useDebounceFn } from '@vueuse/core';

import { getPublicFlowCategories } from '~/domain/flow-category/api/flow-categories.api';
import type { PublicFlowCategory } from '~/domain/flow-category/models/flow-category.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type {
  JsonSerializable,
  ResponsePagination,
} from '~/shared/types/core/request.types';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useFlowCategoriesTableData(options?: {
  requestParams?: () => Record<string, JsonSerializable>;
}) {
  const TABLE_HEADER_COLUMNS = ref<TableViewHeaderColumn[]>([
    {
      prop: 'name',
      label: 'Название',
      minWidth: 180,
    },
    {
      prop: 'actions',
      label: 'Действия',
      fixed: 'right',
      width: 120,
    },
  ]);

  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<PublicFlowCategory[] | null>(null);
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

      const response = await getPublicFlowCategories(params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении категорий шаблонов');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  const debouncedGetTableData = useDebounceFn(getTableData, 500);

  return {
    TABLE_HEADER_COLUMNS,
    loading,
    data,
    meta,
    getTableData,
    debouncedGetTableData,
  };
}

export default useFlowCategoriesTableData;
