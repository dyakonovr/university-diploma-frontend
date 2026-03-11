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
        disabled: loading,
      }"
    />

    <input-ui
      v-model="formData.name"
      label="ФИО"
      :error="formErrors.name"
      :input-props="{
        placeholder: 'Иванов Иван Иванович',
        disabled: loading,
      }"
    />

    <input-ui
      v-model="formData.password"
      label="Пароль"
      :error="formErrors.password"
      :input-props="{
        type: 'password',
        placeholder: '••••••••',
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
      Зарегистрироваться
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

const { formData, formErrors, loading, handleSubmitForm } =
  useRegisterForm();
</script>
