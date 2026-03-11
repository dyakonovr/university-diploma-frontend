<template>
  <div class="integration-create-page">
    <account-form-header @get-back="getBack" />

    <form-container>
      <input-ui
        v-model="formData.name"
        label="Название"
        :required="true"
        :input-props="{ placeholder: 'Моя интеграция', disabled: loading }"
        :error="formErrors.name"
      />
      <select-ui
        v-model="formData.type"
        label="Тип"
        :options="TYPE_OPTIONS"
        :searchable="false"
        :select-props="{ disabled: loading }"
      />
    </form-container>

    <form-buttons
      :disabled="loading"
      submit-text="Добавить"
      @cancel="getBack"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import AccountFormHeader from "~/components/pages/account/AccountFormHeader.vue";
import FormButtons from "~/components/ui/form/FormButtons.vue";
import FormContainer from "~/components/ui/form/FormContainer.vue";
import InputUi from "~/components/ui/form/InputUi.vue";
import SelectUi from "~/components/ui/form/select/SelectUi.vue";
import { TYPE_OPTIONS } from "~/domain/integration/constants/integration.constants";
import useAccountSeoTitle from "~/shared/composables/useAccountSeoTitle";
import useFormKeyboard from "~/shared/composables/useFormKeyboard";
import { WORKSPACE_ID_KEY } from "~/shared/constants/provide-keys";

import useIntegrationForm from "./_composables/useIntegrationForm";

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const { loading, formData, formErrors, onSubmit, getBack } =
  useIntegrationForm(workspaceId);

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

// --- SEO ---
const PAGE_TITLE = "Добавление интеграции";
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.integration-create-page {
  display: flex;
  flex-direction: column;
}
</style>
