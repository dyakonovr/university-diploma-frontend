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
        >
          <table-action-menu-item @click="extAccounts.openDialog(item)">
            <globe-icon /> Внешние аккаунты
          </table-action-menu-item>
        </table-action-menu>
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

    <!-- External accounts dialog -->
    <dialog-ui
      v-model="extAccounts.dialogVisible"
      :title="`Внешние аккаунты — ${extAccounts.selectedMember?.name || extAccounts.selectedMember?.email || ''}`"
    >
      <div
        v-if="extAccounts.loading"
        class="employees-page__ext-loading"
      >
        Загрузка...
      </div>
      <div
        v-else-if="!extAccounts.accounts.length"
        class="employees-page__ext-empty"
      >
        <p>Нет привязанных внешних аккаунтов</p>
      </div>
      <div
        v-else
        class="employees-page__ext-list"
      >
        <div
          v-for="account in extAccounts.accounts"
          :key="account.id"
          class="employees-page__ext-item"
        >
          <div class="employees-page__ext-item-header">
            <span class="employees-page__ext-item-name">
              {{ account.integration_name }}
            </span>
            <tag-ui :type="INTEGRATION_TYPE_TAG[account.integration_type] || 'info'">
              {{ TYPE_LABELS[account.integration_type] || account.integration_type }}
            </tag-ui>
          </div>
          <div class="employees-page__ext-item-details text-12 text-light">
            <span v-if="account.external_username">
              {{ account.external_username }}
            </span>
            <span v-if="account.external_user_id">
              ID: {{ account.external_user_id }}
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <button-ui
          variant="outlined"
          @click="extAccounts.closeDialog"
        >
          Закрыть
        </button-ui>
      </template>
    </dialog-ui>

    <delete-confirmation-dialog
      v-bind="deleteItemDialogContent"
      v-model="deleteDialogVisible"
      @confirm="confirmDelete"
    />
  </section>
</template>

<script setup lang="ts">
import GlobeIcon from '@/assets/images/icons/globe.svg';
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import TableView from '~/components/list-views/TableView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import TableActionMenuItem from '~/components/ui/tables/dropdowns/TableActionMenuItem.vue';
import TagUi from '~/components/ui/TagUi.vue';
import { TYPE_LABELS } from '~/domain/integration/constants/integration.constants';
import { removeMemberFromWorkspace } from '~/domain/workspace/api/workspace-member.api';
import {
  ROLE_LABELS,
  ROLE_OPTIONS,
  ROLE_TAG,
} from '~/domain/workspace/constants/workspace-member.constants';
import type { WorkspaceMember } from '~/domain/workspace/models/workspace-member.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';
import type { TableViewHeaderColumn } from '~/shared/types/ui/table-view.types';

import useEmployeesData from './_composables/useEmployeesData';
import useExternalAccounts from './_composables/useExternalAccounts';
import useInviteMember from './_composables/useInviteMember';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const INTEGRATION_TYPE_TAG: Record<string, string> = {
  task_tracker: 'info',
  crm: 'warning',
  messenger: 'success',
  custom: '',
};

const TABLE_COLUMNS: TableViewHeaderColumn[] = [
  { prop: 'name', label: 'Имя', minWidth: 160 },
  { prop: 'email', label: 'Email', minWidth: 200 },
  { prop: 'role', label: 'Роль', width: 140 },
  { prop: 'actions', label: 'Действия', fixed: 'right', width: 120 },
];

const { data, loading, getData } = useEmployeesData(workspaceId);
const invite = reactive(useInviteMember(workspaceId, () => getData()));
const extAccounts = reactive(useExternalAccounts(workspaceId));

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  handleDelete,
  confirmDelete,
} = useDeleteTableItem<WorkspaceMember>({
  deleteFunc: (id) => removeMemberFromWorkspace(workspaceId, id),
  mapFunc: (el) => el.name || el.email,
  successMessage: 'Участник удалён',
  errorMessage: 'Ошибка при удалении участника',
  getTableData: () => getData(),
});

onBeforeMount(async () => {
  await getData();
});

// --- SEO ---
const PAGE_TITLE = 'Сотрудники';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.employees-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__ext-loading,
  &__ext-empty {
    padding: 16px 0;
    color: colors.$text-light;
  }

  &__ext-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__ext-item {
    padding: 12px;
    border: 1px solid colors.$border;
    border-radius: 8px;
  }

  &__ext-item-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  &__ext-item-name {
    font-weight: 500;
  }

  &__ext-item-details {
    display: flex;
    gap: 12px;
    color: colors.$text-light;
  }
}

.text-light {
  color: colors.$text-light;
}
</style>
