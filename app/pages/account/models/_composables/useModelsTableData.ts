import { useDebounceFn } from '@vueuse/core';

import { getModels } from '~/domain/model/api/models.api';
import type { Model } from '~/domain/model/models/model.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { RequestError } from '~/shared/errors/request.errors';
import type {
  JsonSerializable,
  ResponsePagination,
} from '~/shared/types/core/request.types';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from "~/shared/utils/core/show-request-error";

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
    prop: 'provider_name',
    label: 'Провайдер',
    minWidth: 180,
  },
  {
    prop: 'is_configured',
    label: 'Сконфигурирована?',
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

function useModelsTableData(options?: {
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
  const data = ref<Model[] | null>(null);

  const filters = ref({
    name: '',
    is_active: undefined as boolean | undefined,
    provider_id: '',
    provider_name: '',
  });

  const getTableData = async () => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        add_provider_name: true,
        page: meta.value.page,
        per_page: meta.value.per_page,
        name: filters.value.name || undefined,
        is_active: filters.value.is_active,
        provider_id: filters.value.provider_id || undefined,
        provider_name: filters.value.provider_name || undefined,
        ...options?.requestParams?.(),
      } as Record<string, JsonSerializable>);

      const response = await getModels(params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении моделей');
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
    filters,
    getTableData,
    debouncedGetTableData,
  };
}

export default useModelsTableData;
