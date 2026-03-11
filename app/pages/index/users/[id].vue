<template>
  <account-form-header @get-back="getBack" />

  <form-container
    v-if="formData"
    :loading="loading">
    <input-ui
      v-model="formData.username"
      label="Username"
      :input-props="{
        placeholder: 'Введите никнейм',
        disabled: loading || isFormDisabled,
      }"
    />

    <input-ui
      v-model="formData.email"
      label="Email"
      :error="formErrors.email"
      :input-props="{
        placeholder: 'Введите email',
        disabled: loading || isFormDisabled,
      }"
    />

    <input-ui
      v-model="formData.password"
      label="Password"
      :error="formErrors.password"
      :input-props="{
        type: 'password',
        placeholder: 'Введите пароль',
        disabled: loading || isFormDisabled,
      }"
    />

    <input-ui
      v-model="formData.telegram_id"
      label="Telegram ID"
      :error="formErrors.telegram_id"
      :input-props="{
        placeholder: 'Введите Telegram ID',
        disabled: loading || isFormDisabled,
      }"
    />

    <switch-ui
      v-model="formData.is_active"
      label="Статус активности"
      :switch-props="{ disabled: loading || isFormDisabled }"
    />
  </form-container>
<!-- 
  <form-container
    v-if="editId"
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">Роли пользователя</p>
      <p class="form-container__description">
        Управление ролями, назначенными пользователю.
      </p>
    </template>

    <select-with-tags-ui
      v-model="rolesModel"
      class="form-container-padding"
      direction="column"
      label="Роли"
      :options="availableRoles"
      :select-props="{
        placeholder: 'Добавить роль',
        disabled: loading || isFormDisabled,
      }"
      :is-tag-removable="isRoleTagRemovable"
      @select="onSelectRole"
      @remove="onRemoveRoleTag"
    />
  </form-container> -->

  <form-buttons
    :disabled="loading || isFormDisabled"
    @cancel="getBack"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import useUserStore from '~/domain/user/stores/user';
import useUserForm from '~/pages/users/_composables/useUserForm';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDialogControl from '~/shared/composables/useDialogControl';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';
import type { EntityId } from '~/shared/types/core/base-entity.types';

const {
  loading,
  formData,
  formErrors,
  editId,
  getData,
  getBack,
  onSubmit,
} = useUserForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

// const rolesModel = computed<SelectOption[] | null>(() =>
//   userRoles.value.length
//     ? userRoles.value.map((r) => ({ label: r.name, value: r.id }))
//     : null,
// );

const userStore = useUserStore();

const deleteConfirmDialog = useDialogControl();
const pendingDeleteId = ref<EntityId | null>(null);

const openDeleteConfirm = (id: EntityId) => {
  pendingDeleteId.value = id;
  deleteConfirmDialog.open();
};

const isFormDisabled = computed(() => {
  if (!editId.value) return false;
  if (userStore.user?.id === editId.value) return true;
  // if (userRoles.value.some((r) => r.name.toLowerCase() === 'admin'))
  //   return true;
  return false;
});

const canRemoveRole = (_roleId: string, roleName: string) => {
  if (
    roleName.toLowerCase() === 'admin' &&
    userStore.user?.id === editId.value
  ) {
    return false;
  }
  return true;
};

// const isRoleTagRemovable = (tag: SelectOption) =>
//   canRemoveRole(String(tag.value), tag.label);

// const onSelectRole = async (tag: SelectOption) => {
//   selectedRoleId.value = tag.value as EntityId;
//   await onAssignRole();
// };

// const onRemoveRoleTag = async (tag: SelectOption) => {
//   if (!canRemoveRole(String(tag.value), tag.label)) return;
//   await onRemoveRole(tag.value as EntityId);
// };

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([
    getData(),
  ]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Пользователь', middleware: 'admin' });
useAccountSeoTitle(() => formData.value?.username, {
  snapshot: true,
  fallback: 'Пользователь',
});
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.roles-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: colors.$text-light;
}
</style>
