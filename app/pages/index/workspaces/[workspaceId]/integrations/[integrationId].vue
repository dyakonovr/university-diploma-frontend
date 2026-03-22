<template>
  <div class="integration-form-page">
    <account-form-header @get-back="getBack" />

    <form-container :loading="loading">
      <template v-if="!loading">
        <input-ui
          v-model="formData.name"
          label="Название"
          :input-props="{ placeholder: 'Моя интеграция', disabled: true }"
        />
        <select-ui
          v-model="formData.type"
          label="Тип"
          :options="TYPE_OPTIONS"
          :searchable="false"
          :clearable="false"
          :select-props="{ disabled: true }"
        />
      </template>
    </form-container>

    <form-container class="divided">
      <template #header>
        <p class="form-container__title">Настройки подключения</p>
      </template>

      <input-ui
        v-for="field in currentConfigFields"
        :key="field.key"
        v-model="configValues[field.key]"
        :label="field.label"
        :input-props="{
          readonly: true,
          type: field.type === 'password' ? 'password' : 'text',
        }"
      />
    </form-container>

    <form-container class="divided">
      <template #header>
        <p class="form-container__title">Действия</p>
      </template>

      <form-wrapper-ui label="API-токен">
        <div class="integration-form-page__token">
          <code class="integration-form-page__token-value">
            {{
              tokenVisible && apiToken
                ? apiToken
                : apiToken
                  ? "••••••••••••••••"
                  : "—"
            }}
          </code>
          <button-ui
            v-if="apiToken"
            size="small"
            variant="outlined"
            @click="tokenVisible = !tokenVisible"
          >
            {{ tokenVisible ? "Скрыть" : "Показать" }}
          </button-ui>
          <button-ui
            size="small"
            variant="outlined"
            :loading="regenerating"
            @click="onRegenerate"
          >
            Обновить токен
          </button-ui>
        </div>
      </form-wrapper-ui>

      <form-wrapper-ui label="Проверка подключения">
        <div class="integration-form-page__action-row">
          <button-ui
            size="small"
            variant="outlined"
            :loading="testing"
            @click="onTest"
          >
            Тест
          </button-ui>
          <tag-ui
            v-if="testResult === 'ok'"
            type="success">
            Подключение успешно
          </tag-ui>
          <tag-ui
            v-else-if="testResult === 'error'"
            type="error">
            {{ testError || "Ошибка подключения" }}
          </tag-ui>
        </div>
      </form-wrapper-ui>

      <form-wrapper-ui label="Синхронизация задач">
        <div class="integration-form-page__action-row">
          <button-ui
            size="small"
            variant="outlined"
            :loading="syncing"
            @click="onSync"
          >
            Синхронизировать
          </button-ui>
          <tag-ui
            v-if="syncResult"
            type="success">
            Создано: {{ syncResult.created }}, обновлено:
            {{ syncResult.updated }}
          </tag-ui>
        </div>
      </form-wrapper-ui>
    </form-container>

    <form-buttons
      :with-submit="false"
      @cancel="getBack" />
  </div>
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TagUi from '~/components/ui/TagUi.vue';
import { TYPE_OPTIONS } from '~/domain/integration/constants/integration.constants';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

import useIntegrationForm from './_composables/useIntegrationForm';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const {
  loading,
  formData,
  apiToken,
  tokenVisible,
  regenerating,
  testing,
  testResult,
  testError,
  syncing,
  syncResult,
  configValues,
  currentConfigFields,
  loadAvailableIntegrations,
  getData,
  onRegenerate,
  onTest,
  onSync,
  getBack,
} = useIntegrationForm(workspaceId);

onBeforeMount(async () => {
  await Promise.all([getData(), loadAvailableIntegrations()]);
});

// --- SEO ---
const PAGE_TITLE = 'Интеграция';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use "/assets/styles/base/colors" as colors;

.integration-form-page {
  display: flex;
  flex-direction: column;

  &__section-title {
    font-size: 15px;
    font-weight: 600;
    color: colors.$text;
    margin-top: 8px;
    margin-bottom: 4px;
  }

  &__token {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  &__token-value {
    font-size: 13px;
    font-family: monospace;
    color: colors.$text-light;
    background: colors.$background;
    padding: 6px 12px;
    border-radius: 6px;
    word-break: break-all;
  }

  &__action-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
}
</style>
