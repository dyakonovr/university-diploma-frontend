<template>
  <account-form-header @get-back="getBack" />
  <form-container :loading="loading">
    <input-ui
      v-model="formData.name"
      label="Название"
      :error="formErrors.name"
      :input-props="{
        disabled: loading,
        placeholder: 'Введите название категории',
      }"
    />
  </form-container>
  <form-buttons
    :disabled="loading"
    @cancel="getBack"
    @submit="onSubmit" />
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';

import useFlowCategoryForm from './_composables/useFlowCategoryForm';

const { formData, formErrors, loading, getData, onSubmit, getBack } =
  useFlowCategoryForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([getData()]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Категория публичных шаблонов', middleware: 'admin' });
useAccountSeoTitle(() => formData.value.name, {
  snapshot: true,
  fallback: 'Категория публичных шаблонов',
});
</script>
