import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';

import { getNewsSubcategories } from '~/domain/news-subcategory/api/news-subcategories.api';
import type { NewsSubcategory } from '~/domain/news-subcategory/models/news-subcategory.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type {
  JsonSerializable,
  ResponsePagination,
} from '~/shared/types/core/request.types';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useNewsSubcategoriesTableData(options?: {
  requestParams?: () => Record<string, JsonSerializable>;
}) {
  const TABLE_HEADER_COLUMNS = ref<TableViewHeaderColumn[]>([
    {
      prop: 'name',
      label: 'Название',
      minWidth: 180,
    },
    {
      prop: 'category',
      label: 'Категория',
      minWidth: 180,
    },
    {
      prop: 'is_visible',
      label: 'Видна на сайте?',
      width: 180,
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
  const data = ref<NewsSubcategory[] | null>(null);
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

      const response = await getNewsSubcategories(params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении категорий новостей');
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

export default useNewsSubcategoriesTableData;
