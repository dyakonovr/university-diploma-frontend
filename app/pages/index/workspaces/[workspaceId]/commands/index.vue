<template>
  <div class="commands-page">
    <div class="commands-page__header">
      <h2 class="commands-page__title">Команды</h2>
      <p class="commands-page__subtitle">
        Вводите задачи на естественном языке — AI выполнит их автоматически
      </p>
    </div>

    <div class="commands-page__layout">
      <!-- Sessions panel -->
      <command-sessions-list
        :sessions="sessions"
        :active-session-id="activeSessionId"
        :loading="sessionsLoading"
        @select="onSelectSession"
        @delete="handleDelete"
        @new-session="onNewSession"
      />

      <!-- Chat area -->
      <div class="commands-page__chat">
        <div
          ref="chatEl"
          class="commands-page__messages"
        >
          <div
            v-if="!displayMessages.length && !sending"
            class="commands-page__empty"
          >
            <p class="commands-page__empty-title">Доступные команды</p>
            <ul class="commands-page__commands-list">
              <li>
                <strong>Создать задачу</strong> — «создай задачу Настроить CI/CD»
              </li>
              <li>
                <strong>Список задач</strong> — «покажи задачи» или «список задач»
              </li>
              <li>
                <strong>Удалить задачу</strong> — «удали задачу [название/id]»
              </li>
              <li>
                <strong>Назначить задачу</strong> — «назначь задачу на сотрудника»
              </li>
              <li>
                <strong>Изменить статус</strong> — «измени статус задачи»
              </li>
              <li>
                <strong>Список сотрудников</strong> — «покажи сотрудников»
              </li>
              <li>
                <strong>Сформировать отчёт</strong> — «сделай отчёт»
              </li>
            </ul>
            <p class="commands-page__empty-hint">
              Вводите команды на естественном языке — AI интерпретирует и выполнит действие автоматически.
            </p>
          </div>

          <template
            v-for="(msg, i) in displayMessages"
            :key="i"
          >
            <!-- User / System text messages -->
            <div
              v-if="msg.type === 'user' || msg.type === 'system'"
              class="commands-page__message"
              :class="`commands-page__message--${msg.type}`"
            >
              <div class="commands-page__message-text">{{ msg.text }}</div>
              <div class="commands-page__message-time">{{ msg.timestamp }}</div>
            </div>

            <!-- Preview message -->
            <command-preview
              v-else-if="msg.type === 'preview'"
              :actions="msg.actions"
              :human-response="msg.humanResponse"
              :status="msg.status"
              :timestamp="msg.timestamp"
              :feedback="msg.feedback"
              @update:feedback="msg.feedback = $event"
              @confirm="confirmPreview(msg.sessionId)"
              @reject="rejectPreview(msg.sessionId)"
            />
          </template>

          <div
            v-if="sending"
            class="commands-page__typing"
          >
            <spinner-ui />
            <span>Обрабатывается...</span>
          </div>
        </div>

        <div class="commands-page__input-row">
          <input-ui
            v-model="commandText"
            :input-props="{
              placeholder: 'Введите команду на естественном языке...',
              disabled: sending || hasActivePendingPreview || isViewingSession,
              onKeydown: handleKeydown,
            }"
          />
          <button-ui
            :loading="sending"
            :disabled="!commandText.trim() || hasActivePendingPreview || isViewingSession"
            @click="sendCommand"
          >
            Отправить
          </button-ui>
        </div>
      </div>
    </div>

    <delete-confirmation-dialog
      v-bind="deleteItemDialogContent"
      v-model="deleteDialogVisible"
      @confirm="confirmSessionDelete"
    />
  </div>
</template>

<script setup lang="ts">
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SpinnerUi from '~/components/ui/SpinnerUi.vue';
import { deleteCommandSession } from '~/domain/command/api/command.api';
import type { CommandSession } from '~/domain/command/models/command.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

import CommandPreview from './_components/CommandPreview.vue';
import CommandSessionsList from './_components/CommandSessionsList.vue';
import useCommandSessionDetail from './_composables/useCommandSessionDetail';
import useCommandsChat from './_composables/useCommandsChat';
import useCommandSessions from './_composables/useCommandSessions';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

// Chat
const {
  messages,
  commandText,
  sending,
  hasActivePendingPreview,
  sendCommand,
  confirmPreview,
  rejectPreview,
  handleKeydown,
} = useCommandsChat(workspaceId);

// Sessions
const {
  sessions,
  loading: sessionsLoading,
  activeSessionId,
  getSessions,
  selectSession,
  startNewSession,
} = useCommandSessions(workspaceId);

// Session detail
const {
  sessionMessages,
  loading: sessionDetailLoading,
  loadSession,
} = useCommandSessionDetail(workspaceId);

// Computed: show session detail or live chat
const isViewingSession = computed(() => activeSessionId.value !== null);

const displayMessages = computed(() => {
  if (isViewingSession.value) {
    return sessionMessages.value;
  }
  return messages.value;
});

const onSelectSession = async (id: string) => {
  selectSession(id);
  await loadSession(id);
};

const onNewSession = () => {
  startNewSession();
};

// Delete session
const {
  deleteDialogVisible,
  deleteItemDialogContent,
  handleDelete,
  confirmDelete: confirmSessionDelete,
} = useDeleteTableItem<CommandSession>({
  deleteFunc: (id) => deleteCommandSession(workspaceId, id),
  mapFunc: (el) => el.command_text,
  successMessage: 'Сессия удалена',
  errorMessage: 'Ошибка при удалении сессии',
  getTableData: () => getSessions(),
});

// Auto-scroll
const chatEl = ref<HTMLElement | null>(null);

watch(
  [displayMessages, sending, sessionDetailLoading],
  () => {
    nextTick(() => {
      if (chatEl.value) {
        chatEl.value.scrollTop = chatEl.value.scrollHeight;
      }
    });
  },
  { deep: true },
);

onBeforeMount(async () => {
  await getSessions();
});

// --- SEO ---
const PAGE_TITLE = 'Команды';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.commands-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;

  &__header {
    flex-shrink: 0;
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    color: colors.$text;
  }

  &__subtitle {
    font-size: 13px;
    color: colors.$text-light;
    margin-top: 4px;
  }

  &__layout {
    display: flex;
    gap: 16px;
    flex: 1;
    min-height: 480px;
  }

  &__chat {
    display: flex;
    flex-direction: column;
    flex: 1;
    border: 1px solid colors.$border;
    border-radius: 12px;
    background: colors.$white;
    overflow: hidden;
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__empty {
    margin: auto;
    color: colors.$text-light;
    font-size: 14px;
    line-height: 1.6;
    max-width: 480px;

    &-title {
      font-size: 16px;
      font-weight: 600;
      color: colors.$text;
      margin-bottom: 12px;
      text-align: center;
    }

    &-hint {
      margin-top: 16px;
      text-align: center;
      font-size: 13px;
      color: colors.$text-light;
    }
  }

  &__commands-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      padding: 8px 12px;
      background: colors.$background;
      border-radius: 8px;
      font-size: 13px;
      color: colors.$text;

      strong {
        color: colors.$primary;
      }
    }
  }

  &__message {
    max-width: 75%;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.5;

    &--user {
      align-self: flex-end;
      background: colors.$primary;
      color: #fff;
      border-bottom-right-radius: 4px;
    }

    &--system {
      align-self: flex-start;
      background: colors.$background;
      color: colors.$text;
      border-bottom-left-radius: 4px;
    }

    &-text {
      white-space: pre-wrap;
    }

    &-time {
      font-size: 11px;
      opacity: 0.6;
      margin-top: 4px;
    }
  }

  &__typing {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: colors.$text-light;
  }

  &__input-row {
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid colors.$border;
    align-items: flex-end;

    .form-wrapper {
      flex: 1;
    }
  }
}
</style>
