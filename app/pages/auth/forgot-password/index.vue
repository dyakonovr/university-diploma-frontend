<template>
  <div class="auth-page__header">
    <h1 class="auth-page__title">Восстановление пароля</h1>
  </div>

  <form
    class="auth-page__form"
    @submit.prevent="handleSubmitForm">
    <input-ui
      v-model="formData.email"
      label="Email"
      :error="formErrors.email"
      :input-props="{
        type: 'email',
        placeholder: 'your@email.com',
        disabled: loading || isSecondStep,
      }"
    />

    <template v-if="isSecondStep">
      <input-ui
        v-model="formData.new_password"
        label="Пароль"
        :error="formErrors.new_password"
        :input-props="{
          type: 'password',
          placeholder: '••••••••',
          disabled: loading,
        }"
      />
      <input-ui
        v-model="formData.code"
        label="Код из письма"
        :error="formErrors.code"
        :input-props="{
          placeholder: '123456',
          disabled: loading,
        }"
      />
    </template>

    <button-ui
      type="submit"
      color="primary"
      variant="filled"
      :loading="loading"
      :disabled="loading"
      class="auth-page__submit"
    >
      Отправить
    </button-ui>
  </form>

  <div class="auth-page__links">
    <nuxt-link
      to="/auth/login"
      class="auth-page__link">
      Авторизация
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';

import useForgotPasswordForm from './_composables/useForgotPasswordForm';

const { formData, formErrors, loading, isSecondStep, handleSubmitForm } =
  useForgotPasswordForm();
</script>
