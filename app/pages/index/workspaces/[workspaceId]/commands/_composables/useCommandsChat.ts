import {
  confirmCommandSession,
  confirmCommandSessionStream,
  postCommand,
  postCommandStream,
  rejectCommandSession,
} from '~/domain/command/api/command.api';
import { PREVIEW_STAGE_LABELS } from '~/domain/command/constants/command.constants';
import type { CommandAction, PreviewStage } from '~/domain/command/models/command.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';

import type { ActionProgressItem } from '../_components/ActionProgressList.vue';

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

export type StreamingMessage = {
  type: 'streaming';
  id: string;
  stageLabel: string;
  timestamp: string;
};

export type ProgressMessage = {
  type: 'progress';
  id: string;
  actions: ActionProgressItem[];
  timestamp: string;
};

export type ChatMessage = UserMessage | SystemMessage | PreviewMessage | StreamingMessage | ProgressMessage;

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

  const findMessageById = (id: string) =>
    messages.value.find(
      (m) => (m.type === 'streaming' || m.type === 'progress') && m.id === id,
    ) as StreamingMessage | ProgressMessage | undefined;

  const replaceMessage = (id: string, newMsg: ChatMessage) => {
    const idx = messages.value.findIndex(
      (m) => (m.type === 'streaming' || m.type === 'progress') && m.id === id,
    );
    if (idx !== -1) {
      messages.value.splice(idx, 1, newMsg);
    }
  };

  const sendCommand = async () => {
    const text = commandText.value.trim();
    if (!text || sending.value || hasActivePendingPreview.value) return;

    messages.value.push({ type: 'user', text, timestamp: getTime() });
    commandText.value = '';
    sending.value = true;

    const streamingId = `streaming-${Date.now()}`;

    messages.value.push({
      type: 'streaming',
      id: streamingId,
      stageLabel: PREVIEW_STAGE_LABELS.building_context,
      timestamp: getTime(),
    });

    try {
      await postCommandStream(
        workspaceId,
        { text },
        {
          onStatus(stage: PreviewStage) {
            const msg = findMessageById(streamingId) as StreamingMessage | undefined;
            if (msg) {
              msg.stageLabel = PREVIEW_STAGE_LABELS[stage] || stage;
            }
          },
          onResult(preview) {
            if (!preview.actions || preview.actions.length === 0) {
              replaceMessage(streamingId, {
                type: 'system',
                text: preview.human_response || 'Команда обработана.',
                timestamp: getTime(),
              });
            } else {
              replaceMessage(streamingId, {
                type: 'preview',
                sessionId: preview.session_id,
                actions: preview.actions,
                humanResponse: preview.human_response,
                status: 'pending',
                feedback: '',
                timestamp: getTime(),
              });
            }
          },
          onError(message) {
            replaceMessage(streamingId, {
              type: 'system',
              text: message || 'Произошла ошибка. Попробуйте снова.',
              timestamp: getTime(),
            });
          },
          onDone() {
            sending.value = false;
          },
        },
      );
    } catch {
      // SSE connection failed — fallback to regular request
      try {
        const response = await postCommand(workspaceId, { text });
        const data = response.data;

        if (!data.actions || data.actions.length === 0) {
          replaceMessage(streamingId, {
            type: 'system',
            text: data.human_response || 'Команда обработана.',
            timestamp: getTime(),
          });
        } else {
          replaceMessage(streamingId, {
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
        replaceMessage(streamingId, {
          type: 'system',
          text: 'Произошла ошибка. Попробуйте снова.',
          timestamp: getTime(),
        });
        toastError('Ошибка при выполнении команды');
      }
    } finally {
      sending.value = false;
    }
  };

  const confirmPreview = async (sessionId: string) => {
    const preview = findPreviewBySessionId(sessionId);
    if (!preview) return;

    preview.status = 'confirming';

    const progressId = `progress-${Date.now()}`;
    const progressActions: ActionProgressItem[] = preview.actions.map((action) => ({
      action,
      status: 'pending' as const,
    }));

    messages.value.push({
      type: 'progress',
      id: progressId,
      actions: progressActions,
      timestamp: getTime(),
    });

    try {
      await confirmCommandSessionStream(
        workspaceId,
        sessionId,
        {
          onActionStart(p) {
            const msg = findMessageById(progressId) as ProgressMessage | undefined;
            if (msg && msg.actions[p.index]) {
              msg.actions[p.index].status = 'running';
            }
          },
          onActionDone(p) {
            const msg = findMessageById(progressId) as ProgressMessage | undefined;
            if (msg && msg.actions[p.index]) {
              msg.actions[p.index].status = p.success ? 'success' : 'failed';
              if (p.error) msg.actions[p.index].error = p.error;
            }
          },
          onResult(result) {
            preview.status = 'confirmed';

            replaceMessage(progressId, {
              type: 'system',
              text: result.human_response,
              timestamp: getTime(),
            });
          },
          onError(message) {
            preview.status = 'failed';
            replaceMessage(progressId, {
              type: 'system',
              text: message || 'Ошибка при выполнении действий.',
              timestamp: getTime(),
            });
            toastError('Ошибка при подтверждении команды');
          },
          onDone() {
            // handled by onResult
          },
        },
      );
    } catch {
      // Fallback to regular confirm
      try {
        // Remove progress message
        const idx = messages.value.findIndex(
          (m) => m.type === 'progress' && m.id === progressId,
        );
        if (idx !== -1) messages.value.splice(idx, 1);

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
