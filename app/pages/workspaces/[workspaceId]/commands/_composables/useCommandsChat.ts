import { postWorkspaceCommand } from '~/domain/workspace/api/workspace-command.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';

export type ChatMessage = {
  type: 'user' | 'system';
  text: string;
  timestamp: string;
};

function useCommandsChat(workspaceId: string) {
  const { toastError } = useCustomToast();

  const messages = ref<ChatMessage[]>([]);
  const commandText = ref('');
  const sending = ref(false);

  const getTime = () =>
    new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const sendCommand = async () => {
    const text = commandText.value.trim();
    if (!text || sending.value) return;

    messages.value.push({ type: 'user', text, timestamp: getTime() });
    commandText.value = '';
    sending.value = true;

    try {
      const response = await postWorkspaceCommand(workspaceId, { text });
      messages.value.push({
        type: 'system',
        text: response.data.human_response,
        timestamp: getTime(),
      });
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

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendCommand();
    }
  };

  return {
    messages,
    commandText,
    sending,
    sendCommand,
    handleKeydown,
  };
}

export default useCommandsChat;
