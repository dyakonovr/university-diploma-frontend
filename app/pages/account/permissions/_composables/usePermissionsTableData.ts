import { ref } from 'vue';

import { getPermissions } from '~/domain/permission/api/permissions.api';
import type { Permission } from '~/domain/permission/models/permission.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type {
  JsonSerializable,
  ResponsePagination,
} from '~/shared/types/core/request.types';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function usePermissionsTableData(options?: {
  requestParams?: () => Record<string, JsonSerializable>;
}) {
  const TABLE_HEADER_COLUMNS = ref<TableViewHeaderColumn[]>([
    {
      prop: 'code',
      label: 'Код',
      minWidth: 200,
    },
    {
      prop: 'id',
      label: 'ID',
      minWidth: 250,
    },
    {
      prop: 'actions',
      label: 'Действия',
      fixed: 'right',
      width: 120,
    },
  ]);

  const { toastError } = useCustomToast();

  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 10,
    per_page: 10,
    total: 10,
  });

  const loading = ref(false);
  const data = ref<Permission[] | null>(null);

  const getTableData = async () => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
        ...options?.requestParams?.(),
      } as Record<string, JsonSerializable>);

      const response = await getPermissions(params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении пермишинов');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return {
    TABLE_HEADER_COLUMNS,
    loading,
    data,
    meta,
    getTableData,
  };
}

export default usePermissionsTableData;
