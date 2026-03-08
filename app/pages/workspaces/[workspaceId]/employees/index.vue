<template>
  <section class="employees-page">
    <account-table-header
      :with-filters="false"
      :with-create-link="false"
    >
      <template #buttons>
        <button-ui @click="openDialog">
          Пригласить участника
        </button-ui>
      </template>
    </account-table-header>

    <table-view
      :header-columns="TABLE_HEADER_COLUMNS"
      :table-data="data || []"
      :loading="loading"
    >
      <template #name="item">
        {{ item.name || '—' }}
      </template>

      <template #email="item">
        {{ item.email }}
      </template>

      <template #role="item">
        <tag-ui :type="ROLE_TAG[item.role]">
          {{ ROLE_LABELS[item.role] }}
        </tag-ui>
      </template>

      <template #actions="item">
        <table-action-menu
          @delete-click="handleDelete(item)"
        />
      </template>
    </table-view>

    <!-- Invite dialog -->
    <dialog-ui
      v-model="inviteDialogVisible"
      title="Пригласить участника"
      confirm-button-text="Пригласить"
      :confirm-button-props="{ loading: inviteLoading }"
      @confirm="inviteOnSubmit">
      <div class="employees-page__form">
        <input-ui
          v-model="inviteFormData.user_id"
          label="ID пользователя *"
          :input-props="{ placeholder: 'Введите ID пользователя' }"
          :error="inviteFormErrors.user_id"
        />
        <select-ui
          v-model="inviteFormData.role"
          label="Роль"
          :options="ROLE_OPTIONS"
          :searchable="false"
        />
      </div>
    </dialog-ui>

    <!-- Delete confirmation -->
    <delete-confirmation-dialog
      v-bind="deleteItemDialogContent"
      v-model="deleteDialogVisible"
      @confirm="confirmDelete"
    />
  </section>
</template>

<script setup lang="ts">
import TableView from '~/components/list-views/TableView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TagUi from '~/components/ui/TagUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import { removeMemberFromWorkspace } from '~/domain/workspace/api/workspace-member.api';
import type { WorkspaceMember, WorkspaceMemberRole } from '~/domain/workspace/models/workspace-member.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';

import useEmployeesTableData from './_composables/useEmployeesTableData';
import useInviteMember from './_composables/useInviteMember';

const route = useRoute();
const workspaceId = route.params.workspaceId as string;

const { TABLE_HEADER_COLUMNS, data, loading, getTableData } = useEmployeesTableData(workspaceId);

const {
  dialogVisible: inviteDialogVisible,
  loading: inviteLoading,
  formData: inviteFormData,
  formErrors: inviteFormErrors,
  openDialog,
  onSubmit: inviteOnSubmit,
} = useInviteMember(workspaceId, () => getTableData());

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  handleDelete,
  confirmDelete,
} = useDeleteTableItem<WorkspaceMember>({
  deleteFunc: (id) => removeMemberFromWorkspace(workspaceId, id) as any,
  mapFunc: (el) => el.name || el.email,
  successMessage: 'Участник удалён',
  errorMessage: 'Ошибка при удалении участника',
  getTableData: () => getTableData(),
});

const ROLE_LABELS: Record<WorkspaceMemberRole, string> = {
  owner: 'Владелец',
  manager: 'Менеджер',
  employee: 'Сотрудник',
};

const ROLE_TAG: Record<WorkspaceMemberRole, string> = {
  owner: 'success',
  manager: 'warning',
  employee: 'info',
};

const ROLE_OPTIONS = [
  { label: 'Менеджер', value: 'manager' },
  { label: 'Сотрудник', value: 'employee' },
];

onBeforeMount(async () => {
  await getTableData();
});

// --- SEO ---
const PAGE_TITLE = 'Сотрудники';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.employees-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__form {
    display: flex;
    flex-direction: column;
  }
}
</style>
