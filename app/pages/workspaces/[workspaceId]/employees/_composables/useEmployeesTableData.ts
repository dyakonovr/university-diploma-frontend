import { getWorkspaceMembers } from '~/domain/workspace/api/workspace-member.api';
import type { WorkspaceMember } from '~/domain/workspace/models/workspace-member.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useEmployeesTableData(workspaceId: string) {
  const TABLE_HEADER_COLUMNS = ref<TableViewHeaderColumn[]>([
    { prop: 'name', label: 'Имя', minWidth: 160 },
    { prop: 'email', label: 'Email', minWidth: 200 },
    { prop: 'role', label: 'Роль', width: 130 },
    { prop: 'actions', label: 'Действия', fixed: 'right', width: 120 },
  ]);

  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<WorkspaceMember[]>([]);

  const getTableData = async () => {
    loading.value = true;
    try {
      const response = await getWorkspaceMembers(workspaceId);
      data.value = response.data;
    } catch (e) {
      toastError('Ошибка при загрузке участников');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return {
    TABLE_HEADER_COLUMNS,
    loading,
    data,
    getTableData,
  };
}

export default useEmployeesTableData;
