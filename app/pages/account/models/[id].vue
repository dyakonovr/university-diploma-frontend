<template>
  <account-form-header @get-back="getBack" />

  <div
    v-if="model"
    class="model-card">
    <div class="model-card__main">
      <div class="model-card__title">
        {{ model.name }}

        <span
          class="model-card__badge"
          :class="{
            'model-card__badge--success': model.is_configured,
            'model-card__badge--error': !model.is_configured,
          }"
        >
          {{ model.is_configured ? 'Сконфигурирована' : 'Не сконфигурирована' }}
        </span>
      </div>

      <div class="model-card__meta">
        <div class="model-card__meta-item">
          <span class="model-card__label">Провайдер</span>
          <span class="model-card__badge">
            {{ model.provider_name }}
          </span>
        </div>

        <div class="model-card__meta-item">
          <switch-ui
            v-model="formData.is_active"
            class="model-card__switch"
            :switch-props="{ disabled: !model.is_configured }"
            description="Модель нельзя активировать, пока она не сконфигурирована"
            with-label
            disabled-label="Модель неактивна"
            enabled-label="Модель активна"
          />
        </div>
      </div>
      <div>
        <p class="model-card__description text-14">
          Модель считается сконфигурированной, если:
        </p>
        <ul class="text-14">
          <li>
            У <b>всех</b> входных параметров указан тип и тип переменной (при
            необходимости)
          </li>
          <li>
            У <b>всех</b> выходных параметров указан тип и количество
            возвращаемых артефактов
          </li>
        </ul>
      </div>
    </div>
  </div>

  <form-container
    v-if="model"
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
    v-if="model"
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">Доступ к модели</p>
      <p class="form-container__description">
        Управление доступом, при наличии которого пользователю доступна модель.
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

  <template v-if="editId && model">
    <input-params-editor
      :model-id="editId"
      :input-params="model.capabilities.input_params"
      @updated="getData"
    />

    <output-params-editor
      :model-id="editId"
      :output-params="model.capabilities.output_params"
      :output-param-costs="model.capabilities.output_param_costs"
      :output-param-types="model.capabilities.output_param_types"
      :output-param-counts="model.capabilities.output_param_counts"
      @updated="getData"
    />
  </template>

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
import SelectWithTagsUi from '~/components/ui/form/select/SelectWithTagsUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import useModelForm from '~/pages/account/models/_composables/useModelForm';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';

import InputParamsEditor from './_components/InputParamsEditor.vue';
import OutputParamsEditor from './_components/OutputParamsEditor.vue';

const {
  editId,
  loading,
  formData,
  formErrors,
  model,
  permissionsForm,
  getData,
  getBack,
  onSubmit,
} = useModelForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

const permissionsModel = computed<SelectOption[] | null>(() =>
  model.value?.permissions?.length
    ? model.value.permissions.map((p) => ({ label: p.code, value: p.id }))
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
  await Promise.all([getData(), permissionsForm.permissions.getData(1)]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Модель', middleware: 'admin' });
useAccountSeoTitle(() => model.value?.name, {
  snapshot: true,
  fallback: 'Модель',
});
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.model-card {
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
  gap: 24px;

  &__main {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: colors.$text;
    line-height: 1.3;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 24px;
  }

  &__meta-item {
    display: flex;
    align-items: center;
    gap: 10px;
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

  &__switch {
    margin: 0;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;

    &__actions {
      width: 100%;
    }
  }

  @media screen and (max-width: 800px) {
    margin-left: 16px;
    margin-right: 16px;
  }
}
</style>
