import { getCommandSessions } from '~/domain/command/api/command.api';
import type { CommandSession } from '~/domain/command/models/command.types';
import { mapCommandSession } from '~/domain/command/models/command.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { ResponsePagination } from '~/shared/types/core/request.types';
import { mapPagination } from '~/shared/utils/core/mapPagination';
import { showRequestError } from '~/shared/utils/core/show-request-error';

function useCommandSessions(workspaceId: string) {
  const { toastError } = useCustomToast();

  const sessions = ref<CommandSession[]>([]);
  const loading = ref(false);
  const meta = ref<ResponsePagination | null>(null);
  const activeSessionId = ref<string | null>(null);

  const getSessions = async () => {
    loading.value = true;
    try {
      const response = await getCommandSessions(workspaceId);
      sessions.value = response.data.map(mapCommandSession);
      meta.value = mapPagination(response.meta.pagination);
    } catch (e) {
      toastError('Ошибка при загрузке сессий');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  const selectSession = (id: string) => {
    activeSessionId.value = id;
  };

  const startNewSession = () => {
    activeSessionId.value = null;
  };

  return {
    sessions,
    loading,
    meta,
    activeSessionId,
    getSessions,
    selectSession,
    startNewSession,
  };
}

export default useCommandSessions;
