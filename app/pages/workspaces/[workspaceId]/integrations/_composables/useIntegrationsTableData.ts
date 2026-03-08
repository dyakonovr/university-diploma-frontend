import { getIntegrations } from '~/domain/integration/api/integration.api';
import type { Integration } from '~/domain/integration/models/integration.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useIntegrationsTableData(workspaceId: string) {
  const TABLE_HEADER_COLUMNS = ref<TableViewHeaderColumn[]>([
    { prop: 'name', label: 'Название', minWidth: 160 },
    { prop: 'type', label: 'Тип', width: 130 },
    { prop: 'is_active', label: 'Статус', width: 110 },
    { prop: 'api_token', label: 'API токен', minWidth: 200 },
    { prop: 'actions', label: 'Действия', fixed: 'right', width: 120 },
  ]);

  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<Integration[]>([]);

  const getTableData = async () => {
    loading.value = true;
    try {
      const response = await getIntegrations(workspaceId);
      data.value = response.data;
    } catch (e) {
      toastError('Ошибка при загрузке интеграций');
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

export default useIntegrationsTableData;
