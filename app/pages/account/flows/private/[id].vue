<template>
  <account-form-header @get-back="getBack" />

  <tabs-ui
    v-if="editId"
    v-model="activeTab"
    :tabs="FORM_TABS"
    :parse-from-url="true"
    class="private-flow-form__tabs"
  />

  <template v-if="!editId || activeTab === 'template'">
    <form-container :loading="formLoading">
      <div
        v-if="editId"
        class="form-container-padding-x">
        <flow-access-status :accessible="accessible" />
      </div>

      <input-ui
        v-model="formData.name"
        label="Название"
        :error="formErrors.name"
        :form-wrapper-class="editId ? 'form-container-top-half-padding' : ''"
        :input-props="{
          placeholder: 'Введите название',
          disabled: formLoading,
        }"
      />
    </form-container>

    <!-- Constructor -->
    <flow-constructor
      v-if="editId && stages"
      :flow-id="editId"
      :stages="stages ?? []"
    >
      <template #notice>
        <flow-needed-subscriptions-notice
          v-if="!accessible"
          :subscriptions="neededSubscriptions ?? []"
        />
      </template>
    </flow-constructor>
    <flow-constructor-navigator v-if="editId" />

    <form-buttons
      :disabled="formLoading"
      @cancel="getBack"
      @submit="onSubmitWrapper"
    >
      <template #left>
        <button-ui
          v-if="editId"
          variant="outlined"
          :disabled="formLoading"
          @click="onExport"
        >
          Экспортировать
        </button-ui>

        <button-ui
          v-if="editId"
          variant="outlined"
          color="accent"
          :disabled="formLoading"
          @click="onPublishClick"
        >
          Опубликовать
        </button-ui>
      </template>
    </form-buttons>
  </template>

  <template v-if="activeTab === 'publish' && editId">
    <form-container class="private-flow-form__schedule">
      <schedule-week-grid
        :flow-id="editId"
        :slots="scheduleSlots"
        :loading="scheduleLoading"
        :highlight-slot-id="highlightSlotId"
        @refresh="loadScheduleSlots"
      />
    </form-container>
  </template>

  <publish-flow-dialog
    v-if="editId"
    v-model="publishDialog.visible.value"
    :flow-id="editId"
    :flow-name="formData.name ?? ''"
  />
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import TabsUi from '~/components/ui/TabsUi.vue';
import useFlowConstructorActions from '~/domain/flow/flow-constructor/composables/useFlowConstructorActions';
import useFlowConstructorStore from '~/domain/flow/flow-constructor/stores/constructor-store';
import FlowConstructor from '~/domain/flow/flow-constructor/ui/FlowConstructor.vue';
import FlowConstructorNavigator from '~/domain/flow/flow-constructor/ui/FlowConstructorNavigator.vue';
import FlowNeededSubscriptionsNotice from '~/domain/flow/ui/FlowNeededSubscriptionsNotice.vue';
import { exportPrivateFlow } from '~/domain/flow/usecases/private-flow.usecase';
import useScheduleTimeSlots from '~/domain/schedule/composables/useScheduleTimeSlots';
import ScheduleWeekGrid from '~/domain/schedule/ui/ScheduleWeekGrid.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDialogControl from '~/shared/composables/useDialogControl';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';
import type { TabItem } from '~/shared/types/ui/tabs.types';

import FlowAccessStatus from '../_components/FlowAccessStatus.vue';
import PublishFlowDialog from './_components/PublishFlowDialog.vue';
import usePrivateFlowForm from './_composables/usePrivateFlowForm';

type FormTab = 'template' | 'publish';

const FORM_TABS: TabItem<FormTab>[] = [
  { label: 'Настройки шаблона', value: 'template' },
  { label: 'Запланированные публикации', value: 'publish' },
];

const route = useRoute();
const activeTab = ref<FormTab>('template');
const highlightSlotId = computed(() => (route.query.slotId as string) || null);

const {
  editId,
  formData,
  formErrors,
  loading,
  stages,
  accessible,
  neededSubscriptions,
  router,
  getData,
  onSubmit,
  refreshAccessInfo,
  getBack,
  toastSuccess,
  toastError,
} = usePrivateFlowForm();
const flowConstructorStore = useFlowConstructorStore();
const flowActions = useFlowConstructorActions();
const publishDialog = useDialogControl();

const {
  slots: scheduleSlots,
  loading: scheduleLoading,
  loadSlots: loadScheduleSlots,
} = useScheduleTimeSlots({
  flowId: editId,
});

const formLoading = computed(
  () => loading.value || flowConstructorStore.loading,
);

const onPublishClick = () => {
  if (flowConstructorStore.hasUnsavedChanges) {
    toastError('Сохраните все этапы и шаги перед публикацией');
    return;
  }
  publishDialog.open();
};

const onExport = async () => {
  if (!editId.value) return;
  try {
    exportPrivateFlow(editId.value || '', formData.value.name || 'flow');
    toastSuccess('Шаблон экспортирован!');
  } catch {
    toastError('Ошибка при экспорте шаблона');
  }
};

/** Сохраняет основную форму и Stages */
const onSubmitWrapper = async () => {
  const isCreating = !editId.value;

  try {
    if (isCreating) {
      const response = await onSubmit();
      const newId = response?.data?.id;

      if (newId) {
        editId.value = newId;
        stages.value = [];
        router.replace(`/account/flows/private/${newId}`);
      }

      toastSuccess('Шаблон создан!');
    } else {
      const [, flowSaved] = await Promise.all([
        onSubmit(),
        flowActions.saveFlowSafe(),
      ]);

      if (!flowSaved) return;

      toastSuccess('Шаблон обновлён!');
      getBack();
    }
  } catch {
    // onSubmit() errors (form-level) are handled inside usePrivateFlowForm
  }
};

useFormKeyboard({
  onSubmit: onSubmitWrapper,
  onCancel: getBack,
  disabled: formLoading,
});

onBeforeMount(async () => {
  loading.value = true;
  await getData();
  loading.value = false;
  flowConstructorStore.postSaveCallback = refreshAccessInfo;

  if (editId.value) {
    loadScheduleSlots();
  }
});

onBeforeUnmount(() => {
  flowConstructorStore.postSaveCallback = null;
  flowConstructorStore.clear();
});

// --- SEO ---
definePageMeta({ title: 'Приватный шаблон' });
useAccountSeoTitle(() => formData.value.name, {
  snapshot: true,
  fallback: 'Приватный шаблон',
});
</script>

<style lang="scss" scoped>
.private-flow-form {
  &__tabs {
    margin-top: 16px;
    margin-bottom: 8px;

    + .form-container {
      margin-top: 16px;
    }
  }

  &__schedule {
    margin-top: 16px;
    padding: 16px;
  }
}
</style>
