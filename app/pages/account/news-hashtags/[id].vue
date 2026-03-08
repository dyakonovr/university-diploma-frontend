<template>
  <account-form-header @get-back="getBack" />
  <form-container :loading="loading">
    <input-ui
      v-model="formData.name"
      label="Название"
      :error="formErrors.name"
      :input-props="{ disabled: loading, placeholder: 'Введите значение' }"
    />
  </form-container>
  <form-buttons
    :disabled="loading"
    @cancel="getBack"
    @submit="onSubmit">
    <button-ui
      variant="outlined"
      :disabled="loading"
      @click="onSubmitAndContinue"
    >
      Сохранить и продолжить
    </button-ui>
  </form-buttons>
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';

import useNewsHashtagForm from './_composables/useNewsHashtagForm';

const {
  formData,
  formErrors,
  loading,
  getData,
  onSubmit,
  onSubmitAndContinue,
  getBack,
} = useNewsHashtagForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([getData()]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Хэштег новостей', middleware: 'admin' });
useAccountSeoTitle(() => formData.value.name, {
  snapshot: true,
  fallback: 'Хэштег новостей',
});
</script>
