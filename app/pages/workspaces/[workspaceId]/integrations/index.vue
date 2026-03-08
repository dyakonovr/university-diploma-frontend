<template>
  <section class="integrations-page">
    <account-table-header
      :with-filters="false"
      :with-create-link="false"
    >
      <template #buttons>
        <button-ui @click="openDialog">
          Добавить интеграцию
        </button-ui>
      </template>
    </account-table-header>

    <table-view
      :header-columns="TABLE_HEADER_COLUMNS"
      :table-data="data || []"
      :loading="loading"
    >
      <template #name="item">
        <span class="integrations-page__name">{{ item.name }}</span>
      </template>

      <template #type="item">
        <tag-ui type="info">{{ TYPE_LABELS[item.type] || item.type }}</tag-ui>
      </template>

      <template #is_active="item">
        <tag-ui :type="item.is_active ? 'success' : 'error'">
          {{ item.is_active ? 'Активна' : 'Неактивна' }}
        </tag-ui>
      </template>

      <template #api_token="item">
        <div class="integrations-page__token">
          <code class="integrations-page__token-value">
            {{ item.api_token ? `${item.api_token.slice(0, 12)}...` : '—' }}
          </code>
          <button-ui
            size="sm"
            variant="outlined"
            :loading="regeneratingId === item.id"
            @click="handleRegenerate(item)">
            Обновить токен
          </button-ui>
        </div>
      </template>

      <template #actions="item">
        <table-action-menu
          @delete-click="handleDelete(item)"
        />
      </template>
    </table-view>

    <!-- Create dialog -->
    <dialog-ui
      v-model="createDialogVisible"
      title="Добавить интеграцию"
      confirm-button-text="Добавить"
      :confirm-button-props="{ loading: createLoading }"
      @confirm="createOnSubmit">
      <div class="integrations-page__form">
        <input-ui
          v-model="createFormData.name"
          label="Название *"
          :input-props="{ placeholder: 'Моя интеграция' }"
          :error="createFormErrors.name"
        />
        <select-ui
          v-model="createFormData.type"
          label="Тип"
          :options="TYPE_OPTIONS"
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
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import TableView from '~/components/list-views/TableView.vue';
import AccountTableHeader from '~/components/pages/account/AccountTableHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TableActionMenu from '~/components/ui/tables/dropdowns/TableActionMenu.vue';
import TagUi from '~/components/ui/TagUi.vue';
import { deleteIntegration, regenerateIntegrationToken } from '~/domain/integration/api/integration.api';
import type { Integration } from '~/domain/integration/models/integration.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useDeleteTableItem from '~/shared/composables/useDeleteTableItem';

import useIntegrationForm from './_composables/useIntegrationForm';
import useIntegrationsTableData from './_composables/useIntegrationsTableData';

const route = useRoute();
const workspaceId = route.params.workspaceId as string;
const { toastSuccess, toastError } = useCustomToast();

const { TABLE_HEADER_COLUMNS, data, loading, getTableData } = useIntegrationsTableData(workspaceId);

const {
  dialogVisible: createDialogVisible,
  loading: createLoading,
  formData: createFormData,
  formErrors: createFormErrors,
  TYPE_OPTIONS,
  openDialog,
  onSubmit: createOnSubmit,
} = useIntegrationForm(workspaceId, () => getTableData());

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  handleDelete,
  confirmDelete,
} = useDeleteTableItem<Integration>({
  deleteFunc: (id) => deleteIntegration(id, workspaceId),
  mapFunc: (el) => el.name,
  successMessage: 'Интеграция удалена',
  errorMessage: 'Ошибка при удалении интеграции',
  getTableData: () => getTableData(),
});

const regeneratingId = ref<string | null>(null);

const TYPE_LABELS: Record<string, string> = {
  task_tracker: 'Трекер задач',
  crm: 'CRM',
  messenger: 'Мессенджер',
  custom: 'Кастомная',
};

const handleRegenerate = async (integration: Integration) => {
  regeneratingId.value = integration.id;
  try {
    const response = await regenerateIntegrationToken(integration.id, workspaceId, integration);
    const idx = data.value.findIndex((i) => i.id === integration.id);
    if (idx !== -1) {
      data.value[idx] = { ...data.value[idx], api_token: response.data.api_token };
    }
    toastSuccess('Токен обновлён');
  } catch {
    toastError('Ошибка при обновлении токена');
  } finally {
    regeneratingId.value = null;
  }
};

onBeforeMount(async () => {
  await getTableData();
});

// --- SEO ---
const PAGE_TITLE = 'Интеграции';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.integrations-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__name {
    font-weight: 500;
  }

  &__token {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__token-value {
    font-size: 12px;
    font-family: monospace;
    color: colors.$text-light;
    background: colors.$background;
    padding: 2px 6px;
    border-radius: 4px;
  }

  &__form {
    display: flex;
    flex-direction: column;
  }
}
</style>
