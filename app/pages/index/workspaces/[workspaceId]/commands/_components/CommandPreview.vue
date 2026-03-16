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
      <div class="command-preview__actions-list">
        <tag-ui
          v-for="(action, i) in actions"
          :key="i"
          type="info"
        >
          {{ action.type }}
        </tag-ui>
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
import type { CommandAction } from '~/domain/command/models/command.types';

defineProps<{
  actions: CommandAction[];
  humanResponse: string;
  status: 'pending' | 'confirming' | 'rejecting' | 'confirmed' | 'rejected';
  timestamp: string;
  feedback: string;
}>();

defineEmits<{
  (e: 'confirm'): void;
  (e: 'reject'): void;
  (e: 'update:feedback', value: string): void;
}>();

const showFeedback = ref(false);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.command-preview {
  align-self: flex-start;
  max-width: 80%;
  background: colors.$background;
  border: 1px solid colors.$border;
  border-radius: 12px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__response {
    font-size: 14px;
    line-height: 1.5;
    color: colors.$text;
    white-space: pre-wrap;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 6px;

    &-title {
      font-size: 12px;
      font-weight: 600;
      color: colors.$text-light;
    }

    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
  }

  &__buttons {
    display: flex;
    gap: 8px;
  }

  &__feedback {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid colors.$border;
      border-radius: 8px;
      font-size: 13px;
      font-family: inherit;
      resize: vertical;
      color: colors.$text;
      background: colors.$white;

      &:focus {
        outline: none;
        border-color: colors.$primary;
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
