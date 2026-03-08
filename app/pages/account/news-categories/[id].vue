<template>
  <account-form-header @get-back="getBack" />
  <form-container>
    <input-ui
      v-model="formData.name"
      label="Название"
      :error="formErrors.name"
      :input-props="{ disabled: loading, placeholder: 'Введите значение' }"
    />
    <switch-ui
      v-model="formData.is_visible"
      label="Видна на сайте?"
      with-label
      enabled-label="Да"
      disabled-label="Нет"
      :switch-props="{ disabled: loading }"
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
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';

import useNewsCategoryForm from './_composables/useNewsCategoryForm';

const { formData, formErrors, loading, getData, onSubmit, getBack } =
  useNewsCategoryForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([getData()]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Категория новостей', middleware: 'admin' });
useAccountSeoTitle(() => formData.value.name, {
  snapshot: true,
  fallback: 'Категория новостей',
});
</script>
