<template>
  <account-form-header @get-back="getBack" />

  <form-container :loading="loading">
    <input-ui
      v-model="formData.code"
      label="Код"
      :error="formErrors.code"
      :input-props="{
        placeholder: 'Введите название доступа',
        disabled: loading,
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

import usePermissionForm from './_composables/usePermissionForm';

const { formData, formErrors, loading, getData, onSubmit, getBack } =
  usePermissionForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

onBeforeMount(() => {
  loading.value = true;
  Promise.all([getData()]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Доступ', middleware: 'admin' });
useAccountSeoTitle(() => formData.value.code, {
  snapshot: true,
  fallback: 'Доступ',
});
</script>
