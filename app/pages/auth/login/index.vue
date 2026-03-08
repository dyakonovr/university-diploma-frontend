<template>
  <div class="auth-page__header">
    <h1 class="auth-page__title">Вход</h1>
  </div>

  <form
    class="auth-page__form"
    @submit.prevent="handleLogin">
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
      Войти
    </button-ui>
  </form>

  <div class="auth-page__links">
    <nuxt-link
      to="/auth/forgot-password"
      class="auth-page__link">
      Восстановление пароля
    </nuxt-link>
    <nuxt-link
      to="/auth/register"
      class="auth-page__link">
      Регистрация
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';

import useLoginForm from './_composables/useLoginForm';

const { formData, formErrors, loading, handleLogin } = useLoginForm();
</script>
