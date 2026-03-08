<template>
  <dialog-ui
    v-model="model"
    title="Публикация шаблона"
    confirm-button-text="Опубликовать"
    :auto-close-on-confirm="false"
    @confirm="handleConfirm"
  >
    <div class="publish-flow-dialog">
      <flow-public-artifacts-notice />

      <input-ui
        v-model="formData.name"
        label="Название"
        :error="formErrors.name"
        :input-props="{ placeholder: 'Введите название', disabled: loading }"
      />

      <editor-element-ui
        v-model="formData.description"
        label="Описание"
        :error="formErrors.description"
      />

      <select-ui
        v-model="formData.category_id"
        label="Категория"
        :options="categories.data.value || []"
        :error="formErrors.category_id"
        :select-props="{
          placeholder: 'Выберите категорию',
          disabled: loading || categories.loading.value,
        }"
        @update:search-query="categories.debouncedGetData(1, true)"
        @reach-end="categories.getData(categories.meta.value.page + 1)"
      />

      <select-ui
        v-model="formData.social_networks"
        :options="socialNetworks.data.value || []"
        label="Соц. сети"
        is-multiple
        :select-props="{
          placeholder: 'Выберите соц. сети',
          disabled: loading || socialNetworks.loading.value,
        }"
        :searchable="false"
      >
        <template #selected="{ value }">
          <social-badge :provider="(value as SocialAccountProviderName)" />
        </template>
        <template #option="{ option }">
          <social-badge :provider="(option.value as SocialAccountProviderName)" />
        </template>
      </select-ui>
    </div>
  </dialog-ui>
</template>

<script lang="ts" setup>
import SocialBadge from '~/components/SocialBadge.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import EditorElementUi from '~/components/ui/form/EditorElementUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import FlowPublicArtifactsNotice from '~/domain/flow/ui/FlowPublicArtifactsNotice.vue';
import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import usePublishFlowForm from '../../_composables/usePublishFlowForm';

type Props = {
  flowId: EntityId;
  flowName: string;
};

const props = defineProps<Props>();
const model = defineModel<boolean>();

const {
  loading,
  formData,
  formErrors,
  categories,
  socialNetworks,
  initForm,
  loadSelectData,
  onPublish,
} = usePublishFlowForm();

const handleConfirm = async (done: () => void) => {
  await onPublish(props.flowId, done);
};

watch(model, async (newValue) => {
  if (newValue) {
    initForm(props.flowName);
    await loadSelectData();
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.publish-flow-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
