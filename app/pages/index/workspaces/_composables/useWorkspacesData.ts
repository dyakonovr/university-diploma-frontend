import { getMyWorkspaces } from '~/domain/workspace/api/workspace.api';
import type { Workspace } from '~/domain/workspace/models/workspace.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useWorkspacesData() {
  const { toastError } = useCustomToast();

  const data = ref<Workspace[]>([]);
  const loading = ref(false);

  const getData = async () => {
    loading.value = true;
    try {
      const response = await getMyWorkspaces();
      data.value = response.data;
    } catch (e) {
      toastError('Ошибка при загрузке воркспейсов');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return { data, loading, getData };
}

export default useWorkspacesData;
