<template>
  <div class="workspace-create-page">
    <account-form-header @get-back="getBack" />

    <form-container>
      <input-ui
        v-model="name"
        label="Название воркспейса"
        :required="true"
        :input-props="{ placeholder: 'Моя компания', disabled: loading }"
        :error="formErrors.name"
      />
    </form-container>

    <form-buttons
      :disabled="loading"
      submit-text="Создать"
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
import useAccountSeoTitle from "~/shared/composables/useAccountSeoTitle";
import useFormKeyboard from "~/shared/composables/useFormKeyboard";

import useWorkspaceForm from "./_composables/useWorkspaceForm";

const { loading, name, formErrors, onSubmit, getBack } = useWorkspaceForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

// --- SEO ---
const PAGE_TITLE = "Создание воркспейса";
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.workspace-create-page {
  display: flex;
  flex-direction: column;
}
</style>
