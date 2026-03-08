import { getTasks } from '~/domain/task/api/task.api';
import type { Task } from '~/domain/task/models/task.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { ResponsePagination } from '~/shared/types/core/request.types';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useTasksTableData(workspaceId: string, options?: {
  requestParams?: () => Record<string, string | null | number>;
}) {
  const TABLE_HEADER_COLUMNS = ref<TableViewHeaderColumn[]>([
    { prop: 'title', label: 'Название', minWidth: 200 },
    { prop: 'priority', label: 'Приоритет', width: 130 },
    { prop: 'status', label: 'Статус', width: 150 },
    { prop: 'deadline', label: 'Дедлайн', width: 130 },
    { prop: 'actions', label: 'Действия', fixed: 'right', width: 120 },
  ]);

  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<Task[]>([]);
  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 1,
    per_page: 20,
    total: 0,
  });

  const getTableData = async () => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
        ...options?.requestParams?.(),
      });

      const response = await getTasks(workspaceId, params);

      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      toastError('Ошибка при получении задач');
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

export default useTasksTableData;
