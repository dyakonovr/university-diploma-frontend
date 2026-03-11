<template>
  <div class="ws-settings">
    <account-form-header :with-back-button="false" />

    <form-container
      class="divided"
      :loading="loading">
      <template #header>
        <p class="form-container__title">Настройки воркспейса</p>
      </template>

      <template v-if="!loading">
        <input-ui
          v-model="formData.name"
          label="Название воркспейса"
          :input-props="{
            placeholder: 'Введите название',
            disabled: saving,
          }"
          :error="formErrors.name"
        />
        <form-wrapper-ui :reserve-label-space="true">
          <button-ui
            :loading="saving"
            @click="saveName">
            Сохранить
          </button-ui>
        </form-wrapper-ui>
      </template>
    </form-container>

    <form-container class="divided">
      <template #header>
        <p class="form-container__title">Опасная зона</p>
      </template>

      <div class="form-container-padding">
        <notice-ui title="ПРЕДУПРЕЖДЕНИЕ" type="error">
          Удаление воркспейса уничтожит все задачи, интеграции и данные. Это нельзя отменить.
        </notice-ui>
        <form-wrapper-ui :reserve-label-space="true">
          <button-ui
            color="danger"
            variant="outlined"
            :loading="deleting"
            @click="openDeleteDialog">
            Удалить воркспейс
          </button-ui>
        </form-wrapper-ui>
      </div>
    </form-container>

    <delete-confirmation-dialog
      v-model="deleteDialogVisible"
      title="Удалить воркспейс"
      :message="`Вы уверены? Воркспейс «${formData.name || ''}» и все данные будут удалены безвозвратно.`"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import NoticeUi from '~/components/ui/NoticeUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDialogControl from '~/shared/composables/useDialogControl';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

import useWorkspaceSettings from './_composables/useWorkspaceSettings';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const {
  loading,
  saving,
  deleting,
  formData,
  formErrors,
  fetchWorkspace,
  saveName,
  confirmDelete,
} = useWorkspaceSettings(workspaceId);

const { visible: deleteDialogVisible, open: openDeleteDialog } = useDialogControl();

onBeforeMount(async () => {
  await fetchWorkspace();
});

// --- SEO ---
const PAGE_TITLE = 'Настройки воркспейса';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.ws-settings {
  display: flex;
  flex-direction: column;
}
</style>
