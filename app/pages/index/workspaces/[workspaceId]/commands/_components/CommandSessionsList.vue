<template>
  <div class="sessions-panel">
    <div class="sessions-panel__header">
      <span class="sessions-panel__title">Сессии</span>
      <button-ui
        size="small"
        @click="$emit('new-session')"
      >
        Новая
      </button-ui>
    </div>

    <div class="sessions-panel__list">
      <loading-wrapper :loading="loading">
        <p
          v-if="!sessions.length"
          class="sessions-panel__empty"
        >
          Нет сессий
        </p>

        <div
          v-for="session in sessions"
          :key="session.id"
          class="sessions-panel__item"
          :class="{ 'sessions-panel__item--active': session.id === activeSessionId }"
          @click="$emit('select', session.id)"
        >
          <div class="sessions-panel__item-top">
            <span class="sessions-panel__item-text">
              {{ session.raw_input }}
            </span>
            <button
              class="sessions-panel__item-delete"
              type="button"
              @click.stop="$emit('delete', session)"
            >
              &times;
            </button>
          </div>
          <div class="sessions-panel__item-bottom">
            <tag-ui
              :type="STATUS_TAG[session.status]"
            >
              {{ STATUS_LABELS[session.status] }}
            </tag-ui>
            <span class="sessions-panel__item-date">
              {{ formatDate(session.created_at) }}
            </span>
          </div>
        </div>
      </loading-wrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import LoadingWrapper from '~/components/ui/LoadingWrapper.vue';
import TagUi from '~/components/ui/TagUi.vue';
import {
  SESSION_STATUS_LABELS as STATUS_LABELS,
  SESSION_STATUS_TAG as STATUS_TAG,
} from '~/domain/command/constants/command.constants';
import type { CommandSession } from '~/domain/command/models/command.types';

defineProps<{
  sessions: CommandSession[];
  activeSessionId: string | null;
  loading: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
  (e: 'delete', session: CommandSession): void;
  (e: 'new-session'): void;
}>();

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.sessions-panel {
  width: 300px;
  border: 1px solid colors.$border;
  border-radius: 12px;
  background: colors.$white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
    border-bottom: 1px solid colors.$border;
    background: #fafbfc;
  }

  &__title {
    font-size: 14px;
    font-weight: 700;
    color: colors.$text;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__list {
    flex: 1;
    overflow-y: auto;
  }

  &__empty {
    text-align: center;
    color: colors.$text-light;
    font-size: 13px;
    padding: 24px;
  }

  &__item {
    padding: 14px 18px;
    cursor: pointer;
    border-bottom: 1px solid colors.$border;
    transition: background 0.15s, border-left-color 0.15s;
    border-left: 3px solid transparent;

    &:hover {
      background: #f9fafb;
    }

    &--active {
      background: #f0f1ff;
      border-left-color: colors.$primary;
    }

    &-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }

    &-text {
      font-size: 13px;
      font-weight: 500;
      color: colors.$text;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }

    &-delete {
      background: none;
      border: none;
      color: colors.$text-light;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      flex-shrink: 0;
      opacity: 0;
      transition: opacity 0.15s, color 0.15s;

      &:hover {
        color: colors.$danger;
      }
    }

    &:hover &-delete {
      opacity: 1;
    }

    &-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 8px;
    }

    &-date {
      font-size: 11px;
      color: colors.$text-light;
    }
  }
}
</style>
