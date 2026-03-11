import { getWorkspaceMembers } from '~/domain/workspace/api/workspace-member.api';
import type { WorkspaceMember } from '~/domain/workspace/models/workspace-member.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useEmployeesData(workspaceId: string) {
  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<WorkspaceMember[]>([]);

  const getData = async () => {
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

  return { loading, data, getData };
}

export default useEmployeesData;
