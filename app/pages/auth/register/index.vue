<template>
  <div class="auth-page__header">
    <h1 class="auth-page__title">Регистрация</h1>
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

    <input-ui
      v-model="formData.username"
      label="Username"
      :error="formErrors.username"
      :input-props="{
        placeholder: 'username',
        disabled: loading || isSecondStep,
      }"
    />

    <input-ui
      v-model="formData.password"
      label="Пароль"
      :error="formErrors.password"
      :input-props="{
        type: 'password',
        placeholder: '••••••••',
        disabled: loading || isSecondStep,
      }"
    />

    <input-ui
      v-if="isSecondStep"
      v-model="formData.code"
      label="Код из письма"
      :error="formErrors.code"
      :input-props="{
        placeholder: '123456',
        disabled: loading,
      }"
    />

    <button-ui
      type="submit"
      color="primary"
      variant="filled"
      :loading="loading"
      :disabled="loading"
      class="auth-page__submit"
    >
      {{ !isSecondStep ? 'Зарегистрироваться' : 'Подтвердить' }}
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

import useRegisterForm from './_composables/useRegisterForm';

const { formData, formErrors, loading, isSecondStep, handleSubmitForm } =
  useRegisterForm();
</script>
