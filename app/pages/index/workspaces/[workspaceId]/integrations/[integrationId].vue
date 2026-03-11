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
      </template>
    </form-container>

    <form-buttons :with-submit="false" @cancel="getBack" />
  </div>
</template>

<script setup lang="ts">
import AccountFormHeader from "~/components/pages/account/AccountFormHeader.vue";
import ButtonUi from "~/components/ui/ButtonUi.vue";
import FormButtons from "~/components/ui/form/FormButtons.vue";
import FormContainer from "~/components/ui/form/FormContainer.vue";
import FormWrapperUi from "~/components/ui/form/FormWrapperUi.vue";
import InputUi from "~/components/ui/form/InputUi.vue";
import SelectUi from "~/components/ui/form/select/SelectUi.vue";
import { TYPE_OPTIONS } from "~/domain/integration/constants/integration.constants";
import useAccountSeoTitle from "~/shared/composables/useAccountSeoTitle";
import { WORKSPACE_ID_KEY } from "~/shared/constants/provide-keys";

import useIntegrationForm from "./_composables/useIntegrationForm";

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const {
  loading,
  editId,
  formData,
  apiToken,
  tokenVisible,
  regenerating,
  getData,
  onRegenerate,
  getBack,
} = useIntegrationForm(workspaceId);

onBeforeMount(async () => {
  await getData();
});

// --- SEO ---
const PAGE_TITLE = "Интеграция";
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use "/assets/styles/base/colors" as colors;

.integration-form-page {
  display: flex;
  flex-direction: column;

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
}
</style>
