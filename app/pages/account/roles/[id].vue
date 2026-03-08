<template>
  <account-form-header @get-back="getBack" />

  <form-container :loading="loading">
    <input-ui
      v-model="formData.name"
      label="Название"
      :error="formErrors.name"
      :input-props="{ placeholder: 'Введите название роли', disabled: loading }"
    />
  </form-container>

  <form-buttons
    :disabled="loading"
    @cancel="getBack"
    @submit="onSubmit" />

  <form-container
    v-if="editId"
    class="divided"
    :loading="loading">
    <template #header>
      <p class="permissions-title">Permissions роли</p>
      <p class="permissions-subtitle">
        Управление правами доступа, назначенными роли.
      </p>
    </template>

    <select-with-tags-ui
      v-model="permissionsModel"
      class="form-container-padding"
      direction="column"
      label="Permissions"
      :options="availablePermissionsFiltered"
      :select-props="{
        placeholder: 'Выберите доступ для добавления',
        disabled: loading,
      }"
      @select="onSelectPermission"
      @remove="onRemovePermissionTag"
    />
  </form-container>
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectWithTagsUi from '~/components/ui/form/select/SelectWithTagsUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';

import useRoleForm from './_composables/useRoleForm';

const {
  loading,
  formData,
  formErrors,
  editId,
  rolePermissions,
  availablePermissions,
  selectedPermissionId,
  getData,
  getBack,
  onSubmit,
  loadAvailablePermissions,
  onAssignPermission,
  onRemovePermission,
} = useRoleForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

const permissionsModel = computed<SelectOption[] | null>(() =>
  rolePermissions.value.length
    ? rolePermissions.value.map((p) => ({ label: p.code, value: p.id }))
    : null,
);

const availablePermissionsFiltered = computed(() => {
  const boundIds = rolePermissions.value.map((p) => p.id);
  return availablePermissions.value.filter(
    (p) => !boundIds.includes(p.value as EntityId),
  );
});

const onSelectPermission = async (tag: SelectOption) => {
  selectedPermissionId.value = tag.value as EntityId;
  await onAssignPermission();
};

const onRemovePermissionTag = async (tag: SelectOption) => {
  await onRemovePermission(tag.value as EntityId);
};

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([getData(), loadAvailablePermissions()]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Роль', middleware: 'admin' });
useAccountSeoTitle(() => formData.value.name, {
  snapshot: true,
  fallback: 'Роль',
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
