<template>
  <account-form-header @get-back="getBack" />

  <form-container :loading="isLoading">
    <input-ui
      v-if="flowName"
      :model-value="flowName"
      label="Название"
      :input-props="{ readonly: true }"
    />

    <editor-element-ui
      :model-value="flowDescription"
      label="Описание"
      :disabled="true"
    />

    <input-ui
      v-if="flowCategoryName"
      :model-value="flowCategoryName"
      label="Категория"
      :input-props="{ disabled: true }"
    />
  </form-container>

  <!-- Constructor (readonly) -->
  <flow-constructor
    v-if="editId && stages"
    :flow-id="editId"
    :stages="stages ?? []"
    :config="MODERATION_FLOW_CONFIG"
  />
  <flow-constructor-navigator />

  <form-buttons
    :disabled="isLoading"
    :with-submit="false"
    :with-cancel="false">
    <template #left>
      <button-ui
        variant="outlined"
        :disabled="isLoading"
        @click="getBack">
        Отмена
      </button-ui>
    </template>

    <button-ui
      color="danger"
      variant="outlined"
      :disabled="isLoading"
      @click="declineDialog.open"
    >
      Отклонить
    </button-ui>
    <button-ui
      color="success"
      :disabled="isLoading"
      @click="onApprove">
      Одобрить
    </button-ui>
  </form-buttons>

  <decline-flow-dialog
    v-model="declineDialog.visible.value"
    :flow-id="editId"
    @declined="handleDeclined"
  />
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import EditorElementUi from '~/components/ui/form/EditorElementUi.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import { MODERATION_FLOW_CONFIG } from '~/domain/flow/flow-constructor/models/constructor-config';
import useFlowConstructorStore from '~/domain/flow/flow-constructor/stores/constructor-store';
import FlowConstructor from '~/domain/flow/flow-constructor/ui/FlowConstructor.vue';
import FlowConstructorNavigator from '~/domain/flow/flow-constructor/ui/FlowConstructorNavigator.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDialogControl from '~/shared/composables/useDialogControl';

import DeclineFlowDialog from './_components/DeclineFlowDialog.vue';
import useModerationFlowForm from './_composables/useModerationFlowForm';

const {
  loading,
  actionLoading,
  editId,
  stages,
  flowName,
  flowDescription,
  flowCategoryName,
  getData,
  onApprove,
  getBack,
} = useModerationFlowForm();
const flowConstructorStore = useFlowConstructorStore();
const declineDialog = useDialogControl();

const isLoading = computed(
  () => loading.value || actionLoading.value || flowConstructorStore.loading,
);

const handleDeclined = () => {
  getBack();
};

onBeforeMount(async () => {
  loading.value = true;
  await getData();
  loading.value = false;
});

onBeforeUnmount(() => {
  flowConstructorStore.clear();
});

// --- SEO ---
definePageMeta({ title: 'Модерация шаблона', middleware: 'admin' });
useAccountSeoTitle(() => flowName.value, {
  snapshot: true,
  fallback: 'Модерация шаблона',
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.moderation-flow {
  &__description {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-weight: 500;
    font-size: 14px;
    color: colors.$text-light;
  }
}
</style>
