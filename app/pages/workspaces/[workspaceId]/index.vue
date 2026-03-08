<template>
  <div class="workspace-dashboard">
    <loading-wrapper :loading="loading">
      <div class="workspace-dashboard__header">
        <h1 class="workspace-dashboard__title">
          {{ workspace?.name || 'Дашборд' }}
        </h1>
      </div>

      <div class="workspace-dashboard__stats">
        <div class="ws-stat-card">
          <div class="ws-stat-card__value">{{ stats.openTasks }}</div>
          <div class="ws-stat-card__label">Открытых задач</div>
        </div>
        <div class="ws-stat-card">
          <div class="ws-stat-card__value">{{ stats.doneTasks }}</div>
          <div class="ws-stat-card__label">Выполнено задач</div>
        </div>
        <div class="ws-stat-card">
          <div class="ws-stat-card__value">{{ stats.teamSize }}</div>
          <div class="ws-stat-card__label">Участников</div>
        </div>
      </div>

      <div class="workspace-dashboard__actions">
        <button-ui :to="`/workspaces/${workspaceId}/tasks`">
          Перейти к задачам
        </button-ui>
        <button-ui
          variant="outlined"
          :to="`/workspaces/${workspaceId}/commands`">
          Отправить команду
        </button-ui>
      </div>
    </loading-wrapper>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import LoadingWrapper from '~/components/ui/LoadingWrapper.vue';
import { getTasks } from '~/domain/task/api/task.api';
import { getWorkspace } from '~/domain/workspace/api/workspace.api';
import { getWorkspaceMembers } from '~/domain/workspace/api/workspace-member.api';
import type { Workspace } from '~/domain/workspace/models/workspace.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { showRequestError } from '~/shared/utils/core/show-request-error';

const route = useRoute();
const workspaceId = route.params.workspaceId as string;

const { toastError } = useCustomToast();

const workspace = ref<Workspace | null>(null);
const loading = ref(false);
const stats = ref({
  openTasks: 0,
  doneTasks: 0,
  teamSize: 0,
});

const fetchData = async () => {
  loading.value = true;
  try {
    const [wsRes, tasksRes, membersRes] = await Promise.all([
      getWorkspace(workspaceId),
      getTasks(workspaceId),
      getWorkspaceMembers(workspaceId),
    ]);

    workspace.value = wsRes.data;

    const tasks = tasksRes.data;
    stats.value = {
      openTasks: tasks.filter((t) => !['done', 'cancelled'].includes(t.status)).length,
      doneTasks: tasks.filter((t) => t.status === 'done').length,
      teamSize: membersRes.data.length,
    };
  } catch (e) {
    toastError('Ошибка при загрузке дашборда');
    showRequestError(e);
  } finally {
    loading.value = false;
  }
};

onBeforeMount(async () => {
  await fetchData();
});

// --- SEO ---
const PAGE_TITLE = 'Дашборд';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.workspace-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 22px;
    font-weight: 600;
    color: colors.$text;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
}

.ws-stat-card {
  background: colors.$white;
  border: 1px solid colors.$border;
  border-radius: 12px;
  padding: 20px 24px;

  &__value {
    font-size: 36px;
    font-weight: 700;
    color: colors.$primary;
    line-height: 1;
    margin-bottom: 8px;
  }

  &__label {
    font-size: 13px;
    color: colors.$text-light;
    font-weight: 500;
  }
}
</style>
