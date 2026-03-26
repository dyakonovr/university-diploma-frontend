<template>
  <div class="action-progress">
    <div class="action-progress__header">
      Выполнение действий ({{ doneCount }}/{{ actions.length }})
    </div>
    <ul class="action-progress__list">
      <li
        v-for="(item, i) in actions"
        :key="i"
        class="action-progress__item"
        :class="`action-progress__item--${item.status}`"
      >
        <span class="action-progress__icon">
          <spinner-ui
            v-if="item.status === 'running'"
            :size="16"
          />
          <span v-else-if="item.status === 'success'">&#10003;</span>
          <span v-else-if="item.status === 'failed'">&#10007;</span>
          <span v-else>&bull;</span>
        </span>
        <span class="action-progress__label">
          {{ getActionLabel(item.action.type) }}
        </span>
        <span
          v-if="item.error"
          class="action-progress__error"
        >
          — {{ item.error }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import SpinnerUi from '~/components/ui/SpinnerUi.vue';
import { ACTION_TYPE_LABELS } from '~/domain/command/constants/command.constants';
import type { CommandAction, CommandActionType } from '~/domain/command/models/command.types';

export type ActionProgressItem = {
  action: CommandAction;
  status: 'pending' | 'running' | 'success' | 'failed';
  error?: string;
};

const props = defineProps<{
  actions: ActionProgressItem[];
}>();

const doneCount = computed(() =>
  props.actions.filter((a) => a.status === 'success' || a.status === 'failed').length,
);

const getActionLabel = (type: CommandActionType) =>
  ACTION_TYPE_LABELS[type] || type;
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.action-progress {
  align-self: flex-start;
  max-width: 75%;
  padding: 14px 18px;
  background: colors.$background;
  border: 1px solid colors.$border;
  border-radius: 14px;
  border-bottom-left-radius: 4px;

  &__header {
    font-size: 13px;
    font-weight: 600;
    color: colors.$text;
    margin-bottom: 10px;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: colors.$text-light;
    transition: color 0.2s ease;

    &--running {
      color: colors.$primary;
      font-weight: 500;
    }

    &--success {
      color: colors.$success;
    }

    &--failed {
      color: colors.$error;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    flex-shrink: 0;
    font-size: 14px;
  }

  &__label {
    flex-shrink: 0;
  }

  &__error {
    font-size: 12px;
    color: colors.$error;
  }
}
</style>
