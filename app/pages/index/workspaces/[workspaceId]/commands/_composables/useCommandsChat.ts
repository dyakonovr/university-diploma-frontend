import {
  confirmCommandSession,
  postCommand,
  rejectCommandSession,
} from '~/domain/command/api/command.api';
import type { CommandAction } from '~/domain/command/models/command.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';

export type UserMessage = {
  type: 'user';
  text: string;
  timestamp: string;
};

export type SystemMessage = {
  type: 'system';
  text: string;
  timestamp: string;
};

export type PreviewMessage = {
  type: 'preview';
  sessionId: string;
  actions: CommandAction[];
  humanResponse: string;
  status: 'pending' | 'confirming' | 'rejecting' | 'confirmed' | 'rejected' | 'failed';
  feedback: string;
  timestamp: string;
};

export type ChatMessage = UserMessage | SystemMessage | PreviewMessage;

function useCommandsChat(workspaceId: string) {
  const { toastError } = useCustomToast();

  const messages = ref<ChatMessage[]>([]);
  const commandText = ref('');
  const sending = ref(false);

  const getTime = () =>
    new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const hasActivePendingPreview = computed(() =>
    messages.value.some(
      (m) => m.type === 'preview' && (m.status === 'pending' || m.status === 'confirming' || m.status === 'rejecting'),
    ),
  );

  const findPreviewBySessionId = (sessionId: string) =>
    messages.value.find(
      (m) => m.type === 'preview' && m.sessionId === sessionId,
    ) as PreviewMessage | undefined;

  const sendCommand = async () => {
    const text = commandText.value.trim();
    if (!text || sending.value || hasActivePendingPreview.value) return;

    messages.value.push({ type: 'user', text, timestamp: getTime() });
    commandText.value = '';
    sending.value = true;

    try {
      const response = await postCommand(workspaceId, { text });
      const data = response.data;

      // If no actions — show human_response as a system message (e.g. "список задач")
      if (!data.actions || data.actions.length === 0) {
        messages.value.push({
          type: 'system',
          text: data.human_response || 'Команда обработана.',
          timestamp: getTime(),
        });
      } else {
        messages.value.push({
          type: 'preview',
          sessionId: data.session_id,
          actions: data.actions,
          humanResponse: data.human_response,
          status: 'pending',
          feedback: '',
          timestamp: getTime(),
        });
      }
    } catch {
      toastError('Ошибка при выполнении команды');
      messages.value.push({
        type: 'system',
        text: 'Произошла ошибка. Попробуйте снова.',
        timestamp: getTime(),
      });
    } finally {
      sending.value = false;
    }
  };

  const confirmPreview = async (sessionId: string) => {
    const preview = findPreviewBySessionId(sessionId);
    if (!preview) return;

    preview.status = 'confirming';

    try {
      const response = await confirmCommandSession(workspaceId, sessionId);
      preview.status = 'confirmed';
      messages.value.push({
        type: 'system',
        text: response.data.human_response,
        timestamp: getTime(),
      });
    } catch {
      preview.status = 'pending';
      toastError('Ошибка при подтверждении команды');
    }
  };

  const rejectPreview = async (sessionId: string) => {
    const preview = findPreviewBySessionId(sessionId);
    if (!preview) return;

    preview.status = 'rejecting';

    try {
      const response = await rejectCommandSession(workspaceId, sessionId, {
        feedback: preview.feedback || undefined,
      });
      const data = response.data;

      preview.status = 'rejected';

      // Backend returns a new preview after rejection
      messages.value.push({
        type: 'preview',
        sessionId: data.session_id,
        actions: data.actions,
        humanResponse: data.human_response,
        status: 'pending',
        feedback: '',
        timestamp: getTime(),
      });
    } catch {
      preview.status = 'pending';
      toastError('Ошибка при отклонении команды');
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendCommand();
    }
  };

  const clearMessages = () => {
    messages.value = [];
    commandText.value = '';
  };

  return {
    messages,
    commandText,
    sending,
    hasActivePendingPreview,
    sendCommand,
    confirmPreview,
    rejectPreview,
    handleKeydown,
    clearMessages,
  };
}

export default useCommandsChat;
