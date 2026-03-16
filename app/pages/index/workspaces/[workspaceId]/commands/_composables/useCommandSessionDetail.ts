import { getCommandSession } from '~/domain/command/api/command.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { showRequestError } from '~/shared/utils/core/show-request-error';

import type { ChatMessage } from './useCommandsChat';

function useCommandSessionDetail(workspaceId: string) {
  const { toastError } = useCustomToast();

  const sessionMessages = ref<ChatMessage[]>([]);
  const loading = ref(false);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const loadSession = async (sessionId: string) => {
    loading.value = true;
    sessionMessages.value = [];

    try {
      const response = await getCommandSession(workspaceId, sessionId);
      const session = response.data;
      const time = formatTime(session.created_at);

      // User message
      sessionMessages.value.push({
        type: 'user',
        text: session.command_text,
        timestamp: time,
      });

      // Preview with final status
      sessionMessages.value.push({
        type: 'preview',
        sessionId: session.id,
        actions: session.actions,
        humanResponse: session.human_response,
        status: session.status,
        feedback: '',
        timestamp: time,
      });
    } catch (e) {
      toastError('Ошибка при загрузке сессии');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return {
    sessionMessages,
    loading,
    loadSession,
  };
}

export default useCommandSessionDetail;
