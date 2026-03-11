<template>
  <div class="commands-page">
    <div class="commands-page__header">
      <h2 class="commands-page__title">Команды</h2>
      <p class="commands-page__subtitle">
        Вводите задачи на естественном языке — AI выполнит их автоматически
      </p>
    </div>

    <div class="commands-page__chat">
      <div
        ref="chatEl"
        class="commands-page__messages"
      >
        <div
          v-if="!messages.length"
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

        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="commands-page__message"
          :class="`commands-page__message--${msg.type}`"
        >
          <div class="commands-page__message-text">{{ msg.text }}</div>
          <div class="commands-page__message-time">{{ msg.timestamp }}</div>
        </div>

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
            disabled: sending,
            onKeydown: handleKeydown,
          }"
        />
        <button-ui
          :loading="sending"
          :disabled="!commandText.trim()"
          @click="sendCommand"
        >
          Отправить
        </button-ui>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SpinnerUi from '~/components/ui/SpinnerUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

import useCommandsChat from './_composables/useCommandsChat';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const { messages, commandText, sending, sendCommand, handleKeydown } = useCommandsChat(workspaceId);

const chatEl = ref<HTMLElement | null>(null);

watch(
  messages,
  () => {
    nextTick(() => {
      if (chatEl.value) {
        chatEl.value.scrollTop = chatEl.value.scrollHeight;
      }
    });
  },
  { deep: true },
);

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

  &__chat {
    display: flex;
    flex-direction: column;
    flex: 1;
    border: 1px solid colors.$border;
    border-radius: 12px;
    background: colors.$white;
    overflow: hidden;
    min-height: 480px;
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
