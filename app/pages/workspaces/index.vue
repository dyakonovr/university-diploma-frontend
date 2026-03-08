<template>
  <div class="workspaces-page">
    <div class="workspaces-page__header">
      <h1 class="workspaces-page__title">Мои воркспейсы</h1>
      <button-ui @click="openCreateDialog">
        Создать воркспейс
      </button-ui>
    </div>

    <loading-wrapper :loading="loading">
      <div
        v-if="workspaces.length"
        class="workspaces-page__grid"
      >
        <div
          v-for="ws in workspaces"
          :key="ws.id"
          class="workspace-card"
          @click="navigateTo(`/workspaces/${ws.id}`)"
        >
          <div class="workspace-card__name">{{ ws.name }}</div>
          <div class="workspace-card__meta">Создан: {{ formatDate(ws.created_at) }}</div>
        </div>
      </div>

      <notice-ui
        v-else
        class="workspaces-page__empty"
      >
        У вас ещё нет воркспейсов. Создайте первый!
      </notice-ui>
    </loading-wrapper>

    <dialog-ui
      v-model="createDialogVisible"
      title="Создать воркспейс"
      confirm-button-text="Создать"
      :confirm-button-props="{ loading: createLoading }"
      @confirm="submitCreate"
    >
      <input-ui
        v-model="newWorkspaceName"
        label="Название воркспейса"
        :input-props="{ placeholder: 'Моя компания' }"
        :error="nameError"
      />
    </dialog-ui>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import LoadingWrapper from '~/components/ui/LoadingWrapper.vue';
import NoticeUi from '~/components/ui/NoticeUi.vue';
import { createWorkspace, getMyWorkspaces } from '~/domain/workspace/api/workspace.api';
import type { Workspace } from '~/domain/workspace/models/workspace.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import { useCustomToast } from '~/shared/composables/useCustomToast';

const PAGE_TITLE = 'Воркспейсы';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);

const { toastSuccess, toastError } = useCustomToast();
const router = useRouter();

const workspaces = ref<Workspace[]>([]);
const loading = ref(false);
const createDialogVisible = ref(false);
const createLoading = ref(false);
const newWorkspaceName = ref('');
const nameError = ref('');

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

function openCreateDialog() {
  newWorkspaceName.value = '';
  nameError.value = '';
  createDialogVisible.value = true;
}

async function fetchWorkspaces() {
  loading.value = true;
  try {
    const response = await getMyWorkspaces();
    workspaces.value = response.data;
  } catch {
    toastError('Ошибка при загрузке воркспейсов');
  } finally {
    loading.value = false;
  }
}

async function submitCreate() {
  if (!newWorkspaceName.value.trim()) {
    nameError.value = 'Введите название';
    return;
  }
  nameError.value = '';
  createLoading.value = true;
  try {
    const response = await createWorkspace({ name: newWorkspaceName.value, owner_id: '' } as any);
    workspaces.value.push(response.data);
    createDialogVisible.value = false;
    toastSuccess('Воркспейс создан');
    router.push(`/workspaces/${response.data.id}`);
  } catch {
    toastError('Ошибка при создании воркспейса');
  } finally {
    createLoading.value = false;
  }
}

onBeforeMount(async () => {
  await fetchWorkspaces();
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.workspaces-page {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__title {
    font-size: 22px;
    font-weight: 600;
    color: colors.$text;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  &__empty {
    margin-top: 40px;
  }
}

.workspace-card {
  border: 1px solid colors.$border;
  border-radius: 12px;
  background-color: colors.$white;
  padding: 20px 24px;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: colors.$primary;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }

  &__name {
    font-size: 16px;
    font-weight: 600;
    color: colors.$text;
    margin-bottom: 8px;
  }

  &__meta {
    font-size: 13px;
    color: colors.$text-light;
  }
}
</style>
