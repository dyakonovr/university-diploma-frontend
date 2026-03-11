import { getIntegrations } from '~/domain/integration/api/integration.api';
import type { Integration } from '~/domain/integration/models/integration.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useIntegrationsData(workspaceId: string) {
  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<Integration[]>([]);

  const getData = async () => {
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

  return { loading, data, getData };
}

export default useIntegrationsData;
