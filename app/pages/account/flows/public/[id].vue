<template>
  <account-form-header @get-back="getBack" />

  <public-flow-stats-bar
    v-if="editId"
    :likes="likesCount"
    :copies="copyCount"
    :is-liked="isLiked"
    :is-copied="isCopied"
    :social-networks="infoData.socials || []"
    :accessible="infoData.accessible"
    @toggle-like="onToggleLike"
    @copy="onCopyFlow"
  />
  
  <form-container :loading="formLoading">
    <input-ui
      v-model="formData.name"
      label="Название"
      :error="formErrors.name"
      :input-props="{
        placeholder: 'Введите название',
        disabled: formLoading,
        readonly: isFormReadonly,
      }"
    />

    <editor-element-ui
      v-model="formData.description"
      label="Описание"
      :error="formErrors.description"
      :disabled="formLoading || isFormReadonly"
    />

    <input-ui
      v-if="infoData.categoryName"
      :model-value="infoData.categoryName"
      label="Категория"
      :input-props="{ readonly: true }"
    />
  </form-container>

  <!-- Constructor -->
  <flow-constructor
    v-if="editId && stages"
    :flow-id="editId"
    :stages="stages ?? []"
    :config="PUBLIC_FLOW_CONFIG"
  >
    <template #notice>
      <notice-ui
        v-if="infoData.declineReason"
        type="error"
        title="Шаблон отклонён">
        Причина отказа: "{{ infoData.declineReason }}"
      </notice-ui>

      <flow-public-artifacts-notice v-if="isOwner" />

      <flow-needed-subscriptions-notice
        v-if="!infoData.accessible"
        :subscriptions="infoData.neededSubscriptions ?? []"
      />
    </template>
  </flow-constructor>
  <flow-constructor-navigator />

  <form-buttons
    :disabled="formLoading"
    :with-submit="!isFormReadonly"
    cancel-text="Назад"
    @cancel="getBack"
    @submit="onSubmitWrapper"
  />
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import EditorElementUi from '~/components/ui/form/EditorElementUi.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import NoticeUi from '~/components/ui/NoticeUi.vue';
import { copyPublicFlow, toggleLikePublicFlow } from '~/domain/flow/api/public-flows.api';
import useFlowConstructorActions from '~/domain/flow/flow-constructor/composables/useFlowConstructorActions';
import { PUBLIC_FLOW_CONFIG } from '~/domain/flow/flow-constructor/models/constructor-config';
import useFlowConstructorStore from '~/domain/flow/flow-constructor/stores/constructor-store';
import FlowConstructor from '~/domain/flow/flow-constructor/ui/FlowConstructor.vue';
import FlowConstructorNavigator from '~/domain/flow/flow-constructor/ui/FlowConstructorNavigator.vue';
import FlowNeededSubscriptionsNotice from '~/domain/flow/ui/FlowNeededSubscriptionsNotice.vue';
import FlowPublicArtifactsNotice from '~/domain/flow/ui/FlowPublicArtifactsNotice.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';

import PublicFlowStatsBar from '../_components/PublicFlowStatsBar.vue';
import usePublicFlowForm from './_composables/usePublicFlowForm';

const {
  editId,
  formData,
  formErrors,
  loading,
  stages,
  infoData,
  isOwner,
  likesCount,
  copyCount,
  isLiked,
  isCopied,
  getData,
  onSubmit,
  refreshAccessInfo,
  getBack,
  toastSuccess,
  toastError,
} = usePublicFlowForm();
const flowConstructorStore = useFlowConstructorStore();
const flowActions = useFlowConstructorActions();

const isFormReadonly = computed(() => {
  return true;
  // return !!editId.value && !isOwner.value;
});

const formLoading = computed(
  () => loading.value || flowConstructorStore.loading,
);

const onCopyFlow = async () => {
  if (!editId.value) return;
  try {
    await copyPublicFlow(editId.value);
    isCopied.value = true;
    copyCount.value += 1;
    toastSuccess('Шаблон скопирован в приватные!');
  } catch {
    toastError('Ошибка при копировании шаблона');
  }
};

const onToggleLike = async () => {
  if (!editId.value) return;
  try {
    const response = await toggleLikePublicFlow(editId.value);
    isLiked.value = response.data.liked;
    likesCount.value = response.data.likes_count;
  } catch {
    toastError('Ошибка при обновлении лайка');
  }
};

/** Сохраняет основную форму и Stages */
const onSubmitWrapper = async () => {
  try {
    await Promise.all([
      onSubmit(),
      editId.value
        ? flowActions.saveFlow()
        : Promise.resolve(null),
    ]);
    toastSuccess('Публичный шаблон обновлён!');
    getBack();
  } catch (error) {
    console.error('@onSubmitWrapper:', error);
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
});

onBeforeUnmount(() => {
  flowConstructorStore.postSaveCallback = null;
  flowConstructorStore.clear();
});

// --- SEO ---
definePageMeta({ title: 'Публичный шаблон' });
useAccountSeoTitle(() => formData.value.name, {
  snapshot: true,
  fallback: 'Публичный шаблон',
});
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.public-flow-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;

  &__item {
    font-size: 14px;
    color: colors.$text-light;
  }
}
</style>
