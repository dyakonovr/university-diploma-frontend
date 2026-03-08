<template>
  <account-form-header @get-back="getBack" />

  <form-container
    v-if="formData"
    :loading="loading">
    <input-ui
      v-model="formData.name"
      label="Название"
      :error="formErrors.name"
      :input-props="{ placeholder: 'Введите название', disabled: loading }"
    />

    <number-input-ui
      v-model="formData.price"
      label="Цена подписки ($)"
      :input-props="{
        placeholder: 'Введите цену в долларах (например, 9.99)',
        disabled: loading,
      }"
      :min="0"
      :step="0.01"
      :error="formErrors.price"
    />

    <number-input-ui
      v-model="formData.tokens_amount"
      label="Количество токенов"
      description="Количество токенов, которое будет начисляться каждые N-часов интервала"
      :input-props="{
        placeholder: 'Введите количество токенов',
        disabled: loading,
      }"
      :min="0"
      :step="1"
      :error="formErrors.tokens_amount"
    />

    <number-input-ui
      v-model="formData.tokens_interval"
      label="Интервал (часов)"
      description="Интервал в часах, в который будут начисляться токены"
      :error="formErrors.tokens_interval"
      :input-props="{
        placeholder: 'Введите интервал в часах',
        disabled: loading,
      }"
      :min="0"
      :step="1"
    />
  </form-container>

  <form-container
    v-if="editId"
    class="divided"
    :loading="loading">
    <template #header>
      <p class="permissions-title">Permissions подписки</p>
      <p class="permissions-subtitle weight-400">
        Управление permissions, привязанными к подписке.
      </p>
    </template>

    <select-with-tags-ui
      v-model="subscriptionPermissions"
      v-model:search-query="permissions.searchValue.value"
      class="form-container-padding"
      direction="column"
      label="Permissions"
      :options="permissions.data.value || []"
      collapsible-tags
      :visible-tags-count="10"
      :select-props="{
        placeholder: 'Добавить permission',
        disabled: loading || permissions.loading.value,
      }"
      @reach-end="permissions.getData(permissions.meta.value.page + 1)"
      @update:search-query="permissions.debouncedGetData(1, true)"
      @select="onSelectPermission"
      @remove="onRemovePermissionTag"
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
import NumberInputUi from '~/components/ui/form/NumberInputUi.vue';
import SelectWithTagsUi from '~/components/ui/form/select/SelectWithTagsUi.vue';
import useSubscriptionForm from '~/pages/account/subscriptions/_composables/useSubscriptionForm';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';
import type { SelectOption } from '~/shared/types/ui/select.types';

const {
  loading,
  formData,
  formErrors,
  editId,
  subscriptionPermissions,
  permissions,
  selectedPermission,
  getData,
  getBack,
  onSubmit,
  onBindPermission,
  onUnbindPermission,
} = useSubscriptionForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

const onSelectPermission = async (tag: SelectOption) => {
  selectedPermission.value = tag.value as string;
  await onBindPermission();
};

const onRemovePermissionTag = async (tag: SelectOption) => {
  await onUnbindPermission(tag.value as string);
};

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([permissions.getData(1), getData()]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Подписка', middleware: 'admin' });
useAccountSeoTitle(() => formData.value?.name, {
  snapshot: true,
  fallback: 'Подписка',
});
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.permissions-title {
  font-weight: 600;
  color: colors.$text;
  margin-bottom: 4px;
}

.permissions-subtitle {
  font-size: 14px;
  color: colors.$text-light;
}
</style>
