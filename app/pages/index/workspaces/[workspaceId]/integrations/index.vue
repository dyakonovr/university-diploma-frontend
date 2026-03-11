<template>
  <section class="integrations-page">
    <account-table-header :with-filters="false" :with-create-link="false">
      <template #buttons>
        <button-ui :to="`/workspaces/${workspaceId}/integrations/create`">
          Добавить интеграцию
        </button-ui>
      </template>
    </account-table-header>

    <cards-view
      :data="data"
      :card-link="
        (item) => `/workspaces/${workspaceId}/integrations/${item.id}`
      "
      :loading="loading"
      :with-pagination="false"
      empty-html="Нет интеграций"
    >
      <template #title="{ item }">
        {{ item.name }}
      </template>
      <template #body="{ item }">
        <div class="integrations-page__card-tags">
          <tag-ui type="info">
            {{ TYPE_LABELS[item.type] || item.type }}
          </tag-ui>
          <tag-ui :type="item.is_active ? 'success' : 'error'">
            {{ item.is_active ? "Активна" : "Неактивна" }}
          </tag-ui>
        </div>
      </template>
      <template #actions="{ item }">
        <table-action-menu
          :edit-link="`/workspaces/${workspaceId}/integrations/${item.id}`"
          @delete-click="handleDelete(item)"
        />
      </template>
    </cards-view>

    <delete-confirmation-dialog
      v-bind="deleteItemDialogContent"
      v-model="deleteDialogVisible"
      @confirm="confirmDelete"
    />
  </section>
</template>

<script setup lang="ts">
import CardsView from "~/components/list-views/CardsView.vue";
import DeleteConfirmationDialog from "~/components/dialogs/DeleteConfirmationDialog.vue";
import AccountTableHeader from "~/components/pages/account/AccountTableHeader.vue";
import ButtonUi from "~/components/ui/ButtonUi.vue";
import TableActionMenu from "~/components/ui/tables/dropdowns/TableActionMenu.vue";
import TagUi from "~/components/ui/TagUi.vue";
import { deleteIntegration } from "~/domain/integration/api/integration.api";
import { TYPE_LABELS } from "~/domain/integration/constants/integration.constants";
import type { Integration } from "~/domain/integration/models/integration.types";
import useAccountSeoTitle from "~/shared/composables/useAccountSeoTitle";
import useDeleteTableItem from "~/shared/composables/useDeleteTableItem";
import { WORKSPACE_ID_KEY } from "~/shared/constants/provide-keys";

import useIntegrationsData from "./_composables/useIntegrationsData";

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const { data, loading, getData } = useIntegrationsData(workspaceId);

const {
  deleteDialogVisible,
  deleteItemDialogContent,
  handleDelete,
  confirmDelete,
} = useDeleteTableItem<Integration>({
  deleteFunc: (id) => deleteIntegration(id, workspaceId),
  mapFunc: (el) => el.name,
  successMessage: "Интеграция удалена",
  errorMessage: "Ошибка при удалении интеграции",
  getTableData: () => getData(),
});

onBeforeMount(async () => {
  await getData();
});

// --- SEO ---
const PAGE_TITLE = "Интеграции";
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.integrations-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}
</style>
