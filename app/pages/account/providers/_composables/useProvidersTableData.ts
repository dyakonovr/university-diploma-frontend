import { useDebounceFn } from '@vueuse/core';

import { getProviders } from '~/domain/provider/api/providers.api';
import type { Provider } from '~/domain/provider/models/provider.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type {
  JsonSerializable,
  ResponsePagination,
} from '~/shared/types/core/request.types';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

const TABLE_HEADER_COLUMNS: TableViewHeaderColumn[] = [
  {
    prop: 'name',
    label: 'Системное название',
    minWidth: 180,
  },
  {
    prop: 'display_name',
    label: 'Отображаемое название',
    minWidth: 180,
  },
  {
    prop: 'category',
    label: 'Категория',
    minWidth: 180,
  },
  {
    prop: 'computing_type',
    label: 'Тип вычисления',
    minWidth: 150,
  },
  {
    prop: 'content_type',
    label: 'Тип контента',
    minWidth: 150,
  },
  {
    prop: 'default_model_name',
    label: 'Модель по умолчанию',
    minWidth: 180,
  },
  {
    prop: 'is_configured',
    label: 'Сконфигурирован?',
    width: 180,
  },
  {
    prop: 'is_active',
    label: 'Статус активности',
    width: 180,
  },
  {
    prop: 'created_at',
    label: 'Дата создания',
    width: 180,
  },
  {
    prop: 'actions',
    label: 'Действия',
    fixed: 'right',
    width: 120,
  },
];

function useProvidersTableData(options?: {
  requestParams?: () => Record<string, JsonSerializable>;
}) {
  const { toastError } = useCustomToast();

  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 10,
    per_page: 10,
    total: 10,
  });

  const loading = ref(false);
  const data = ref<Provider[] | null>(null);

  const getTableData = async () => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
        ...options?.requestParams?.(),
      });

      const response = await getProviders(params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении провайдеров');
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

export default useProvidersTableData;
