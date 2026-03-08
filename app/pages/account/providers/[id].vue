<template>
  <account-form-header @get-back="getBack" />

  <div
    v-if="provider"
    class="provider-card">
    <div class="provider-card__main">
      <div class="provider-card__title">
        {{ provider.name }}

        <span
          class="provider-card__badge"
          :class="{
            'provider-card__badge--success': provider.is_configured,
            'provider-card__badge--error': !provider.is_configured,
          }"
        >
          {{
            provider.is_configured ? 'Сконфигурирован' : 'Не сконфигурирован'
          }}
        </span>
      </div>

      <div class="provider-card__meta">
        <span class="provider-card__label">Категория</span>
        <span class="provider-card__badge">
          {{ provider.category }}
        </span>
      </div>

      <div>
        <p class="provider-card__description text-14">
          Провайдер считается сконфигурированным, если:
        </p>
        <ul class="text-14">
          <li>Указан тип вычисления</li>
          <li>Указан тип контента</li>
          <li>Указана модель по умолчанию</li>
        </ul>
      </div>
    </div>
  </div>

  <form-container
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">Основные настройки</p>
    </template>

    <select-ui
      v-model="formData.computing_type"
      label="Тип вычисления"
      :options="PROVIDER_COMPUTING_TYPES"
      :error="formErrors.computing_type"
      :searchable="false"
      :select-props="{
        placeholder: 'Выберите тип вычисления',
        disabled: loading,
      }"
    />
    <select-ui
      v-model="formData.content_type"
      label="Тип контента"
      :options="PROVIDER_CONTENT_TYPES"
      :error="formErrors.content_type"
      :searchable="false"
      :select-props="{
        placeholder: 'Выберите тип контента',
        disabled: loading,
      }"
    />
    <select-ui
      v-model="formData.default_model_id"
      v-model:search-query="models.searchValue.value"
      label="Модель по умолчанию"
      :options="models.data.value || []"
      :initial-option="models.initialOption.value"
      :error="formErrors.default_model_id"
      :select-props="{
        placeholder: 'Выберите модель по умолчанию',
        disabled: loading || models.loading.value,
      }"
      @reach-end="models.getData(models.meta.value.page + 1)"
      @update:search-query="models.debouncedGetData(1, true)"
    />
    <switch-ui
      v-model="formData.is_active"
      label="Статус активности"
      :switch-props="{ disabled: !provider?.is_configured }"
      description="Провайдер нельзя активировать, пока он не сконфигурирован"
    />
  </form-container>

  <form-container
    v-if="provider"
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">Пользовательские настройки</p>
      <p class="form-container__description">
        Указанные ниже поля будут отображаться обычным пользователям вместо
        системных
      </p>
    </template>

    <input-ui
      v-model="formData.display_name"
      :error="formErrors.display_name"
      label="Отображаемое название"
      description="Если значение не указано, у пользователя будет отображаться системное название"
      :input-props="{
        placeholder: 'Введите отображаемое название',
        disabled: loading,
      }"
    />
    <editor-element-ui
      v-model="formData.description"
      :error="formErrors.is_active"
      label="Описание"
      :disabled="loading"
    />
  </form-container>

  <form-container
    v-if="provider"
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">Доступ к провайдеру</p>
      <p class="form-container__description">
        Управление доступом, при наличии которого пользователю доступен
        провайдер.
      </p>
    </template>

    <select-with-tags-ui
      v-model="permissionsModel"
      v-model:search-query="permissionsForm.permissions.searchValue.value"
      class="form-container-padding"
      direction="column"
      label="Доступы"
      :options="permissionsForm.permissions.data.value || []"
      collapsible-tags
      :visible-tags-count="10"
      :select-props="{
        placeholder: 'Добавить доступ',
        disabled: loading || permissionsForm.permissions.loading.value,
      }"
      @reach-end="
        permissionsForm.permissions.getData(
          permissionsForm.permissions.meta.value.page + 1,
        )
      "
      @update:search-query="
        permissionsForm.permissions.debouncedGetData(1, true)
      "
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
import EditorElementUi from '~/components/ui/form/EditorElementUi.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import SelectWithTagsUi from '~/components/ui/form/select/SelectWithTagsUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import {
  PROVIDER_COMPUTING_TYPES,
  PROVIDER_CONTENT_TYPES,
} from '~/domain/provider/constants/provider.const';
import useProviderForm from '~/pages/account/providers/_composables/useProviderForm';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';

const {
  formData,
  formErrors,
  loading,
  provider,
  models,
  permissionsForm,
  getData,
  onSubmit,
  getBack,
} = useProviderForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

const permissionsModel = computed<SelectOption[] | null>(() =>
  provider.value?.permissions?.length
    ? provider.value.permissions.map((p) => ({ label: p.code, value: p.id }))
    : null,
);

const onSelectPermission = async (tag: SelectOption) => {
  await permissionsForm.onBindPermission(tag.value as EntityId);
};

const onRemovePermissionTag = async (tag: SelectOption) => {
  await permissionsForm.onUnbindPermission(tag.value as EntityId);
};

onBeforeMount(async () => {
  loading.value = true;
  await getData();
  await Promise.all([
    models.getData(1),
    permissionsForm.permissions.getData(1),
  ]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Провайдер', middleware: 'admin' });
useAccountSeoTitle(() => provider.value?.name, {
  snapshot: true,
  fallback: 'Провайдер',
});
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.provider-card {
  margin-bottom: offsets.$offset-24;
  padding: 20px 24px;

  background: linear-gradient(
    135deg,
    colors.$white 0%,
    rgba(colors.$background, 0.6) 100%
  );

  border: 1px solid colors.$border;
  border-radius: 16px;

  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);

  display: flex;
  align-items: center;
  justify-content: space-between;

  &__main {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: colors.$text;
    line-height: 1.3;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__label {
    font-size: 13px;
    color: colors.$text-light;
  }

  &__badge {
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 500;

    background-color: rgba(colors.$primary, 0.08);
    color: colors.$primary;

    border-radius: 999px;
    white-space: nowrap;

    &--success {
      color: colors.$success;
      background-color: rgba(colors.$success, 0.08);
    }

    &--error {
      color: colors.$danger;
      background-color: rgba(colors.$danger, 0.08);
    }
  }

  @media screen and (max-width: 800px) {
    margin-left: 16px;
    margin-right: 16px;
  }
}

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
