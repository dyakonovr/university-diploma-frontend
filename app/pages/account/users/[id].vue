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
  </form-container>

  <template v-if="editId">
    <!-- Balance & Transactions -->
    <user-balance-transactions
      v-model:current-page="transactionsPage"
      :balance="balance"
      :transactions="transactions"
      :loading="transactionsLoading"
      :total-pages="transactionsTotalPages"
    />

    <!-- Subscriptions -->
    <user-subscriptions-list
      :subscriptions="subscriptions.userSubscriptions.value"
      :loading="subscriptions.loading.value"
      :disabled="isFormDisabled"
      show-delete
      @delete="openDeleteConfirm"
    >
      <div class="user-admin__assign-subscription">
        <h4>Назначить подписку</h4>
        <div class="user-admin__assign-controls">
          <select-ui
            v-model="subscriptions.formData.value.selectedSubscriptionId"
            v-model:search-query="
              subscriptions.availableSubscriptions.searchValue.value
            "
            label="Подписка"
            :options="subscriptions.availableSubscriptions.data.value || []"
            :select-props="{
              placeholder: 'Выберите подписку',
              disabled:
                tarificationLoading ||
                subscriptions.availableSubscriptions.loading.value,
            }"
            :error="subscriptions.formErrors.value.selectedSubscriptionId"
            @reach-end="subscriptions.availableSubscriptions.getData(1)"
            @update:search-query="
              subscriptions.availableSubscriptions.debouncedGetData(1, true)
            "
          />
          <datepicker-ui
            v-model="subscriptions.formData.value.expiresAt"
            label="Действует до"
            :disabled="tarificationLoading"
            :error="subscriptions.formErrors.value.expiresAt"
          />
          <form-wrapper-ui :reserve-label-space="true">
            <button-ui
              :disabled="tarificationLoading"
              @click="subscriptions.assignSubscription"
            >
              Назначить
            </button-ui>
          </form-wrapper-ui>
        </div>
      </div>
    </user-subscriptions-list>
  </template>

  <dialog-ui
    v-model="deleteConfirmDialog.visible.value"
    title="Удаление подписки"
    message="Вы уверены, что хотите удалить подписку?"
    confirm-button-text="Удалить"
    :confirm-button-props="{ color: 'danger' }"
    @confirm="subscriptions.removeSubscription(pendingDeleteId!)"
  />

  <form-buttons
    :disabled="loading || isFormDisabled"
    @cancel="getBack"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import DatepickerUi from '~/components/ui/form/DatepickerUi.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import SelectWithTagsUi from '~/components/ui/form/select/SelectWithTagsUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import useUserStore from '~/domain/user/stores/user';
import UserBalanceTransactions from '~/domain/user/ui/UserBalanceTransactions.vue';
import UserSubscriptionsList from '~/domain/user/ui/UserSubscriptionsList.vue';
import useUserForm from '~/pages/account/users/_composables/useUserForm';
import useUserTarification from '~/pages/account/users/_composables/useUserTarification';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useDialogControl from '~/shared/composables/useDialogControl';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';

import useUserSubscriptions from './_composables/useUserSubscriptions';

const {
  loading,
  formData,
  formErrors,
  editId,
  userRoles,
  availableRoles,
  selectedRoleId,
  getData,
  getBack,
  onSubmit,
  loadAvailableRoles,
  onAssignRole,
  onRemoveRole,
} = useUserForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

const rolesModel = computed<SelectOption[] | null>(() =>
  userRoles.value.length
    ? userRoles.value.map((r) => ({ label: r.name, value: r.id }))
    : null,
);

const {
  tarificationLoading,
  transactionsLoading,
  balance,
  transactions,
  transactionsPage,
  transactionsTotalPages,

  loadTarificationData,
  loadTransactions,
} = useUserTarification(editId);

const subscriptions = useUserSubscriptions(editId);

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
  if (userRoles.value.some((r) => r.name.toLowerCase() === 'admin'))
    return true;
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

const isRoleTagRemovable = (tag: SelectOption) =>
  canRemoveRole(String(tag.value), tag.label);

const onSelectRole = async (tag: SelectOption) => {
  selectedRoleId.value = tag.value as EntityId;
  await onAssignRole();
};

const onRemoveRoleTag = async (tag: SelectOption) => {
  if (!canRemoveRole(String(tag.value), tag.label)) return;
  await onRemoveRole(tag.value as EntityId);
};

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([
    getData(),
    loadAvailableRoles(),
    editId.value !== null ? loadTarificationData() : Promise.resolve(null),
    editId.value !== null ? loadTransactions() : Promise.resolve(null),
    editId.value !== null
      ? subscriptions.availableSubscriptions.getData(1)
      : Promise.resolve(null),
    editId.value !== null
      ? subscriptions.loadUserSubscriptions()
      : Promise.resolve(null),
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

.user-admin {
  &__assign-subscription {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid colors.$border;

    h4 {
      font-weight: 600;
      margin-bottom: 16px;
    }
  }

  &__assign-controls {
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex-wrap: wrap;
    margin-top: 20px;
  }
}
</style>
