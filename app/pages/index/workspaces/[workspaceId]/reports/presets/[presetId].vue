<template>
  <div class="preset-form-page">
    <account-form-header @get-back="getBack" />

    <form-container :loading="loading">
      <template v-if="!loading">
        <input-ui
          v-model="formData.title"
          label="Название"
          :required="true"
          :input-props="{ placeholder: 'Название пресета', disabled: saving }"
          :error="formErrors.title"
        />
        <input-ui
          v-model="formData.description"
          label="Описание"
          :input-props="{
            placeholder: 'Краткое описание пресета',
            disabled: saving,
            isTextarea: true,
            rows: 3,
          }"
          :error="formErrors.description"
        />
        <input-ui
          v-model="formData.prompt"
          label="Промпт"
          :required="true"
          :input-props="{
            placeholder: 'Текст промпта для генерации отчёта...',
            disabled: saving,
            isTextarea: true,
            rows: 6,
          }"
          :error="formErrors.prompt"
        />
      </template>
    </form-container>

    <form-buttons
      :disabled="saving"
      :submit-text="editId ? 'Сохранить' : 'Создать'"
      @cancel="getBack"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

import usePresetForm from './_composables/usePresetForm';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const {
  loading,
  saving,
  editId,
  formData,
  formErrors,
  getData,
  onSubmit,
  getBack,
} = usePresetForm(workspaceId);

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: saving });

onBeforeMount(async () => {
  await getData();
});

// --- SEO ---
const PAGE_TITLE = computed(() =>
  editId.value ? 'Редактирование пресета' : 'Создание пресета',
);
definePageMeta({ title: 'Пресет' });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.preset-form-page {
  display: flex;
  flex-direction: column;
}
</style>
