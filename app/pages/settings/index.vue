<template>
  <account-form-header :with-back-button="false" />

  <form-container
    class="settings divided"
    :loading="initialLoading">
    <template #header>
      <p class="form-container__title">Изменить никнейм</p>
    </template>

    <template v-if="!initialLoading && user">
      <input-ui
        v-model="formData.username"
        label="Новый никнейм"
        :input-props="{
          placeholder: 'Введите новый никнейм',
          disabled: loading,
        }"
        :error="usernameFormErrors.username"
      />

      <form-wrapper-ui :reserve-label-space="true">
        <button-ui
          :disabled="loading"
          @click="submitUsernameChange">
          Сохранить
        </button-ui>
      </form-wrapper-ui>
    </template>
  </form-container>

  <form-container
    class="settings divided"
    :loading="initialLoading">
    <template #header>
      <p class="form-container__title">Изменить email</p>
    </template>

    <template v-if="!initialLoading && user">
      <input-ui
        v-model="formData.new_email"
        label="Новый email"
        :input-props="{
          placeholder: 'Введите новый email',
          disabled: loading,
        }"
        :error="emailFormErrors.new_email"
      />

      <form-wrapper-ui
        v-if="!showCodeField"
        :reserve-label-space="true">
        <button-ui
          :disabled="loading"
          @click="submitEmailChange">
          Отправить код
        </button-ui>
      </form-wrapper-ui>

      <template v-if="showCodeField">
        <input-ui
          v-model="formData.code"
          label="Код из письма"
          :input-props="{
            placeholder: 'Введите код из письма',
            disabled: loading,
          }"
          :error="emailFormErrors.code"
        />
        <form-wrapper-ui :reserve-label-space="true">
          <button-ui
            color="success"
            class="settings__submit-code-btn"
            :disabled="loading"
            @click="submitCodeConfirmation"
          >
            Подтвердить
          </button-ui>
        </form-wrapper-ui>
      </template>
    </template>
  </form-container>
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';

import useSettingsPage from './_composables/useSettingsPage';

const {
  user,
  formData,
  emailFormErrors,
  usernameFormErrors,
  loading,
  initialLoading,
  showCodeField,
  getData,
  submitEmailChange,
  submitCodeConfirmation,
  submitUsernameChange,
} = useSettingsPage();

onBeforeMount(async () => {
  initialLoading.value = true;
  await getData();
  initialLoading.value = false;
});

// --- SEO ---
const PAGE_TITLE = 'Настройки';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.settings {
  &__loading {
    text-align: center;
    padding: 40px;
    color: colors.$text-light;
  }
}
</style>
