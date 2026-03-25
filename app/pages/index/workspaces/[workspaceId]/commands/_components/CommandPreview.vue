<template>
  <div class="command-preview">
    <div class="command-preview__response">
      {{ humanResponse }}
    </div>

    <div
      v-if="actions.length"
      class="command-preview__actions"
    >
      <p class="command-preview__actions-title">Запланированные действия:</p>
      <div
        v-for="(action, i) in actions"
        :key="i"
        class="command-preview__action"
      >
        <tag-ui :type="ACTION_TYPE_TAG[action.type] || 'info'">
          {{ ACTION_TYPE_LABELS[action.type] || action.type }}
        </tag-ui>
        <div
          v-if="getActionDetails(action).length"
          class="command-preview__action-details"
        >
          <span
            v-for="(detail, j) in getActionDetails(action)"
            :key="j"
            class="command-preview__action-detail"
          >
            <span class="command-preview__action-detail-label">{{ detail.label }}:</span>
            {{ detail.value }}
          </span>
        </div>
      </div>
    </div>

    <!-- Pending: show confirm/reject buttons -->
    <div
      v-if="status === 'pending'"
      class="command-preview__buttons"
    >
      <button-ui
        color="success"
        size="small"
        @click="$emit('confirm')"
      >
        Подтвердить
      </button-ui>
      <button-ui
        color="danger"
        variant="outlined"
        size="small"
        @click="showFeedback = true"
      >
        Отклонить
      </button-ui>
    </div>

    <!-- Feedback input for reject -->
    <div
      v-if="status === 'pending' && showFeedback"
      class="command-preview__feedback"
    >
      <textarea
        :value="feedback"
        class="command-preview__feedback-input"
        placeholder="Комментарий (необязательно)..."
        rows="2"
        @input="$emit('update:feedback', ($event.target as HTMLTextAreaElement).value)"
      />
      <button-ui
        color="danger"
        size="small"
        @click="$emit('reject')"
      >
        Отправить
      </button-ui>
    </div>

    <!-- Confirming / Rejecting -->
    <div
      v-if="status === 'confirming' || status === 'rejecting'"
      class="command-preview__loading"
    >
      <spinner-ui :size="20" />
      <span>{{ status === 'confirming' ? 'Подтверждение...' : 'Отклонение...' }}</span>
    </div>

    <!-- Failed: show retry button -->
    <div
      v-if="status === 'failed'"
      class="command-preview__buttons"
    >
      <tag-ui type="error">Ошибка выполнения</tag-ui>
      <button-ui
        color="primary"
        size="small"
        @click="$emit('confirm')"
      >
        Повторить
      </button-ui>
    </div>

    <!-- Confirmed / Rejected -->
    <div
      v-if="status === 'confirmed' || status === 'rejected'"
      class="command-preview__status"
    >
      <tag-ui :type="status === 'confirmed' ? 'success' : 'error'">
        {{ status === 'confirmed' ? 'Подтверждено' : 'Отклонено' }}
      </tag-ui>
    </div>

    <div class="command-preview__time">
      {{ timestamp }}
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import SpinnerUi from '~/components/ui/SpinnerUi.vue';
import TagUi from '~/components/ui/TagUi.vue';
import {
  ACTION_TYPE_LABELS,
  ACTION_TYPE_TAG,
} from '~/domain/command/constants/command.constants';
import { PRIORITY_LABELS } from '~/domain/task/constants/task.constants';
import type { CommandAction, CommandActionPayload } from '~/domain/command/models/command.types';

defineProps<{
  actions: CommandAction[];
  humanResponse: string;
  status: 'pending' | 'confirming' | 'rejecting' | 'confirmed' | 'rejected' | 'failed';
  timestamp: string;
  feedback: string;
}>();

defineEmits<{
  (e: 'confirm'): void;
  (e: 'reject'): void;
  (e: 'update:feedback', value: string): void;
}>();

const showFeedback = ref(false);

type ActionDetail = { label: string; value: string };

/**
 * Извлекает ключевые поля из payload действия для отображения
 */
function getActionDetails(action: CommandAction): ActionDetail[] {
  const details: ActionDetail[] = [];
  const p = action.payload as CommandActionPayload & Record<string, unknown>;

  if ('title' in p && p.title) {
    details.push({ label: 'Название', value: String(p.title) });
  }

  if ('priority' in p && p.priority) {
    const key = String(p.priority) as keyof typeof PRIORITY_LABELS;
    details.push({ label: 'Приоритет', value: PRIORITY_LABELS[key] || String(p.priority) });
  }

  if ('status' in p && p.status) {
    details.push({ label: 'Статус', value: String(p.status) });
  }

  if ('deadline' in p && p.deadline) {
    details.push({ label: 'Дедлайн', value: formatDateTime(String(p.deadline)) });
  }

  if ('start_time' in p && p.start_time) {
    const start = formatDateTime(String(p.start_time));
    const end = 'end_time' in p && p.end_time ? formatDateTime(String(p.end_time)) : '';
    details.push({ label: 'Время', value: end ? `${start} — ${end}` : start });
  }

  if ('location' in p && p.location) {
    details.push({ label: 'Место', value: String(p.location) });
  }

  if ('channel_name' in p && p.channel_name) {
    details.push({ label: 'Канал', value: String(p.channel_name) });
  }

  if ('text' in p && p.text && action.type === 'message.send') {
    details.push({ label: 'Текст', value: String(p.text) });
  }

  return details;
}

function formatDateTime(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.command-preview {
  align-self: flex-start;
  max-width: 80%;
  background: colors.$white;
  border: 1px solid colors.$border;
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  &__response {
    font-size: 14px;
    line-height: 1.6;
    color: colors.$text;
    white-space: pre-wrap;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    background: colors.$background;
    border-radius: 10px;
    border: 1px solid colors.$border;

    &-title {
      font-size: 11px;
      font-weight: 700;
      color: colors.$text-light;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  }

  &__action {
    display: flex;
    flex-direction: column;
    gap: 6px;

    &-details {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 12px;
      padding-left: 4px;
    }

    &-detail {
      font-size: 12px;
      color: colors.$text;
      line-height: 1.4;

      &-label {
        color: colors.$text-light;
        font-weight: 500;
      }
    }
  }

  &__buttons {
    display: flex;
    gap: 8px;
    padding-top: 4px;
  }

  &__feedback {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid colors.$border;
      border-radius: 10px;
      font-size: 13px;
      font-family: inherit;
      resize: vertical;
      color: colors.$text;
      background: colors.$background;
      transition: border-color 0.15s;

      &:focus {
        outline: none;
        border-color: colors.$primary;
        background: colors.$white;
      }
    }
  }

  &__loading {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: colors.$text-light;
  }

  &__status {
    display: flex;
  }

  &__time {
    font-size: 11px;
    opacity: 0.6;
    color: colors.$text-light;
  }
}
</style>
