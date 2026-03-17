<template>
  <section class="employees-page">
    <account-table-header :with-filters="false" :with-create-link="false">
      <template #buttons>
        <button-ui @click="invite.openDialog"> Пригласить участника </button-ui>
      </template>
    </account-table-header>

    <table-view
      :header-columns="TABLE_COLUMNS"
      :table-data="data"
      :loading="loading"
      :with-pagination="false"
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
          :can-edit="false"
          @delete-click="handleDelete(item)"
        />
      </template>
    </table-view>

    <dialog-ui
      v-model="invite.dialogVisible"
      title="Пригласить участника"
      confirm-button-text="Пригласить"
      :confirm-button-props="{ loading: invite.loading }"
      @confirm="invite.onSubmit"
    >
      <div class="employees-page__form">
        <input-ui
          v-model="invite.formData.user_id"
          label="ID пользователя"
          :required="true"
          :input-props="{ placeholder: 'Введите ID пользователя' }"
          :error="invite.formErrors.user_id"
        />
        <select-ui
          v-model="invite.formData.role"
          label="Роль"
          :options="ROLE_OPTIONS"
          :searchable="false"
          :clearable="false"
        />
      </div>
    </dialog-ui>

    <delete-confirmation-dialog
      v-bind="deleteItemDialogContent"
      v-model="deleteDialogVisible"
      @confirm="confirmDelete"
    />
  </section>
</template>

<script setup lang="ts">
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import TableView from '~/components/list-views/TableView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import TagUi from '~/components/ui/TagUi.vue';
import { removeMemberFromWorkspace } from "~/domain/workspace/api/workspace-member.api";
import {
  ROLE_LABELS,
  ROLE_OPTIONS,
  ROLE_TAG,
} from "~/domain/workspace/constants/workspace-member.constants";
import type { WorkspaceMember } from "~/domain/workspace/models/workspace-member.types";
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';

import useEmployeesData from './_composables/useEmployeesData';
import useInviteMember from './_composables/useInviteMember';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const TABLE_COLUMNS: TableViewHeaderColumn[] = [
  { prop: 'name', label: 'Имя', minWidth: 160 },
  { prop: 'email', label: 'Email', minWidth: 200 },
  { prop: 'role', label: 'Роль', width: 140 },
  { prop: 'actions', label: 'Действия', fixed: 'right', width: 120 },
];

const { data, loading, getData } = useEmployeesData(workspaceId);
const invite = reactive(useInviteMember(workspaceId, () => getData()));

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  handleDelete,
  confirmDelete,
} = useDeleteTableItem<WorkspaceMember>({
  deleteFunc: (id) => removeMemberFromWorkspace(workspaceId, id),
  mapFunc: (el) => el.name || el.email,
  successMessage: "Участник удалён",
  errorMessage: "Ошибка при удалении участника",
  getTableData: () => getData(),
});

onBeforeMount(async () => {
  await getData();
});

// --- SEO ---
const PAGE_TITLE = "Сотрудники";
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
    gap: 16px;
  }
}
</style>
