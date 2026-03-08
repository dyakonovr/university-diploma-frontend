<template>
  <account-form-header @get-back="getBack" />
  <form-container :loading="loading">
    <input-ui
      v-model="formData.name"
      label="Название"
      :error="formErrors.name"
      :input-props="{ disabled: loading, placeholder: 'Введите значение' }"
    />
    <select-ui
      v-model="formData.category_id"
      label="Категория"
      :options="categories.data.value || []"
      :initial-option="categories.initialOption.value"
      :error="formErrors.category_id"
      :select-props="{
        placeholder: 'Выберите категорию',
        disabled: loading || categories.loading.value,
      }"
      @update:search-query="categories.debouncedGetData(1, true)"
      @reach-end="categories.getData(categories.meta.value.page + 1)"
    >
      <template #option="{ option }">
        {{ option.label }}
        <tag-ui :type="option.is_visible ? 'success' : 'error'">
          {{ option.is_visible ? 'Видна' : 'Скрыта' }}
        </tag-ui>
      </template>
      <template #selected="{ value }">
        {{ findCategoryOption(value)?.label }}
        <tag-ui
          v-if="findCategoryOption(value)"
          :type="findCategoryOption(value)?.is_visible ? 'success' : 'error'"
          class="ml"
        >
          {{ findCategoryOption(value)?.is_visible ? 'Видна' : 'Скрыта' }}
        </tag-ui>
      </template>
    </select-ui>
    <switch-ui
      v-model="formData.is_visible"
      label="Видна на сайте?"
      with-label
      enabled-label="Да"
      disabled-label="Нет"
      :switch-props="{ disabled: loading }"
      description="Подкатегория будет отображена на сайте, если выполняются <b>все</b> условия:
      <ul>
        <li>Категория видима на сайте</li>
        <li>Подкатегория видима на сайте</li>
      </ul>"
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
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import TagUi from '~/components/ui/TagUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';

import useNewsSubcategoryForm from './_composables/useNewsSubcategoryForm';

const {
  formData,
  formErrors,
  loading,
  categories,
  getData,
  onSubmit,
  getBack,
} = useNewsSubcategoryForm();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findCategoryOption(value: unknown): any {
  const opt = (categories.data.value || []).find((o) => o.value === value);
  if (opt) return opt;
  const initial = categories.initialOption.value;
  return initial?.value === value ? initial : null;
}

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([categories.getData(1), getData()]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Подкатегория новостей', middleware: 'admin' });
useAccountSeoTitle(() => formData.value.name, {
  snapshot: true,
  fallback: 'Подкатегория новостей',
});
</script>
