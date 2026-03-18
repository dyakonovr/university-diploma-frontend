<template>
  <loading-wrapper :loading="loading">
    <div
      v-if="statistics"
      class="report-statistics"
    >
      <!-- Задачи -->
      <div class="report-statistics__section">
        <h3 class="report-statistics__section-title">Задачи</h3>
        <div class="report-statistics__cards">
          <div class="report-statistics__card report-statistics__card--primary">
            <span class="report-statistics__card-value">{{ statistics.tasks.total }}</span>
            <span class="report-statistics__card-label">Всего</span>
          </div>
          <div class="report-statistics__card report-statistics__card--info">
            <span class="report-statistics__card-value">{{ statistics.tasks.external }}</span>
            <span class="report-statistics__card-label">Из Redmine</span>
          </div>
        </div>

        <div class="report-statistics__breakdown">
          <div class="report-statistics__breakdown-group">
            <p class="report-statistics__breakdown-title">По статусу</p>
            <div class="report-statistics__breakdown-items">
              <div
                v-for="(count, status) in statistics.tasks.by_status"
                :key="status"
                class="report-statistics__breakdown-item"
              >
                <tag-ui :type="STATUS_TAG[status as TaskStatus]">
                  {{ STATUS_LABELS[status as TaskStatus] || status }}
                </tag-ui>
                <span class="report-statistics__breakdown-count">{{ count }}</span>
              </div>
            </div>
          </div>

          <div class="report-statistics__breakdown-group">
            <p class="report-statistics__breakdown-title">По приоритету</p>
            <div class="report-statistics__breakdown-items">
              <div
                v-for="(count, priority) in statistics.tasks.by_priority"
                :key="priority"
                class="report-statistics__breakdown-item"
              >
                <tag-ui :type="PRIORITY_TAG[priority as TaskPriority]">
                  {{ PRIORITY_LABELS[priority as TaskPriority] || priority }}
                </tag-ui>
                <span class="report-statistics__breakdown-count">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Дедлайны -->
      <div class="report-statistics__section">
        <h3 class="report-statistics__section-title">Дедлайны</h3>
        <div class="report-statistics__cards">
          <div class="report-statistics__card report-statistics__card--danger">
            <span class="report-statistics__card-value">{{ statistics.deadlines.overdue }}</span>
            <span class="report-statistics__card-label">Просрочено</span>
          </div>
          <div class="report-statistics__card report-statistics__card--warning">
            <span class="report-statistics__card-value">{{ statistics.deadlines.due_this_week }}</span>
            <span class="report-statistics__card-label">На этой неделе</span>
          </div>
          <div class="report-statistics__card report-statistics__card--success">
            <span class="report-statistics__card-value">{{ statistics.deadlines.due_later }}</span>
            <span class="report-statistics__card-label">Позже</span>
          </div>
          <div class="report-statistics__card report-statistics__card--info">
            <span class="report-statistics__card-value">{{ statistics.deadlines.no_deadline }}</span>
            <span class="report-statistics__card-label">Без дедлайна</span>
          </div>
        </div>
      </div>

      <!-- Участники -->
      <div
        v-if="statistics.members.length"
        class="report-statistics__section"
      >
        <h3 class="report-statistics__section-title">Участники</h3>
        <div class="report-statistics__members">
          <div
            v-for="member in statistics.members"
            :key="member.user_id"
            class="report-statistics__member"
          >
            <div class="report-statistics__member-header">
              <div class="report-statistics__member-info">
                <span class="report-statistics__member-name">{{ member.name }}</span>
                <tag-ui :type="ROLE_TAG[member.role as WorkspaceMemberRole] as TagType">
                  {{ ROLE_LABELS[member.role as WorkspaceMemberRole] || member.role }}
                </tag-ui>
              </div>
              <span class="report-statistics__member-total">
                {{ member.task_count }} {{ taskWord(member.task_count) }}
              </span>
            </div>

            <div class="report-statistics__member-breakdown">
              <div class="report-statistics__breakdown-items report-statistics__breakdown-items--compact">
                <div
                  v-for="(count, status) in member.by_status"
                  :key="status"
                  class="report-statistics__breakdown-item"
                >
                  <tag-ui :type="STATUS_TAG[status as TaskStatus]">
                    {{ STATUS_LABELS[status as TaskStatus] || status }}
                  </tag-ui>
                  <span class="report-statistics__breakdown-count">{{ count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p
        v-if="!statistics.tasks.total"
        class="report-statistics__empty"
      >
        Нет данных для отображения статистики
      </p>
    </div>
  </loading-wrapper>
</template>

<script setup lang="ts">
import { PRIORITY_LABELS, PRIORITY_TAG, STATUS_LABELS, STATUS_TAG } from '~/domain/task/constants/task.constants';
import type { TaskPriority, TaskStatus } from '~/domain/task/models/task.types';
import type { StatisticsReport } from '~/domain/report/models/report.types';
import { ROLE_LABELS, ROLE_TAG } from '~/domain/workspace/constants/workspace-member.constants';
import type { WorkspaceMemberRole } from '~/domain/workspace/models/workspace-member.types';
import type { TagType } from '~/shared/types/ui/tag.types';
import LoadingWrapper from '~/components/ui/LoadingWrapper.vue';
import TagUi from '~/components/ui/TagUi.vue';

type Props = {
  statistics: StatisticsReport | null;
  loading: boolean;
};

defineProps<Props>();

function taskWord(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return 'задач';
  if (mod10 === 1) return 'задача';
  if (mod10 >= 2 && mod10 <= 4) return 'задачи';
  return 'задач';
}
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.report-statistics {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__section-title {
    font-size: 16px;
    font-weight: 600;
    color: colors.$text;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  &__card {
    background: colors.$white;
    border: 1px solid colors.$border;
    border-radius: 10px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: border-color 0.15s;

    &--primary {
      border-left: 3px solid colors.$primary;
    }

    &--danger {
      border-left: 3px solid colors.$danger;
    }

    &--warning {
      border-left: 3px solid colors.$accent;
    }

    &--success {
      border-left: 3px solid colors.$success;
    }

    &--info {
      border-left: 3px solid colors.$border;
    }
  }

  &__card-value {
    font-size: 28px;
    font-weight: 700;
    color: colors.$text;
    line-height: 1;
  }

  &__card-label {
    font-size: 13px;
    color: colors.$text-light;
  }

  &__breakdown {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  &__breakdown-group {
    background: colors.$white;
    border: 1px solid colors.$border;
    border-radius: 10px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__breakdown-title {
    font-size: 13px;
    font-weight: 600;
    color: colors.$text-light;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__breakdown-items {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    &--compact {
      gap: 6px;
    }
  }

  &__breakdown-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__breakdown-count {
    font-size: 14px;
    font-weight: 600;
    color: colors.$text;
  }

  &__members {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 12px;
  }

  &__member {
    background: colors.$white;
    border: 1px solid colors.$border;
    border-radius: 10px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:hover {
      border-color: colors.$primary-light;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
    }
  }

  &__member-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  &__member-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__member-name {
    font-size: 15px;
    font-weight: 600;
    color: colors.$text;
  }

  &__member-total {
    font-size: 13px;
    color: colors.$text-light;
    white-space: nowrap;
  }

  &__member-breakdown {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__empty {
    text-align: center;
    color: colors.$text-light;
    font-size: 14px;
    padding: 40px 0;
  }
}
</style>
