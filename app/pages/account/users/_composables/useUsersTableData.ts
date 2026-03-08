import { ref } from 'vue';

import { getUsers } from '~/domain/user/api/users/users.admin-api';
import type { User } from '~/domain/user/models/user.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type {
  JsonSerializable,
  ResponsePagination,
} from '~/shared/types/core/request.types';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useUsersTableData(options?: {
  requestParams?: () => Record<string, JsonSerializable>;
}) {
  const TABLE_HEADER_COLUMNS = ref<TableViewHeaderColumn[]>([
    {
      prop: 'username',
      label: 'Username',
      minWidth: 150,
    },
    {
      prop: 'email',
      label: 'Email',
      minWidth: 180,
    },
    {
      prop: 'telegram_id',
      label: 'Telegram ID',
      minWidth: 150,
    },
    {
      prop: 'is_active',
      label: 'Статус',
      minWidth: 150,
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
  ]);

  const { toastError } = useCustomToast();

  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 10,
    per_page: 10,
    total: 10,
  });

  const loading = ref(false);
  const data = ref<User[] | null>(null);

  const getTableData = async () => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
        ...options?.requestParams?.(),
      } as Record<string, JsonSerializable>);

      const response = await getUsers(params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении пользователей');
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

export default useUsersTableData;
