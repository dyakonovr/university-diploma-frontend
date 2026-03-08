<template>
  <div class="auth recovery-password">
    <div class="auth__form-wrapper">
      <form
        class="auth__form"
        @submit.prevent="onLogin">
        <h1 class="headline-3 auth__title">Вход в систему</h1>
        <input-ui
          v-model="formData.login"
          :error="formErrors.login"
          root-class-name="auth__input-wrapper"
          :input-props="{ placeholder: 'Логин', disabled: loading }"
          @blur="formRules.login" />
        <input-ui
          v-model="formData.password"
          :error="formErrors.password"
          root-class-name="auth__input-wrapper"
          :input-props="{ placeholder: 'Пароль', type: 'password', disabled: loading }"
          @blur="formRules.password" />
        <div class="auth__links">
          <!-- <link-ui
            :disabled="loading"
            @click="redirect('/registration')">Зарегистрироваться</link-ui> -->
        </div>
        <button-ui
          class="auth__button"
          type="submit"
          :loading="loading">Вход</button-ui>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputUi from '~/components/ui/form/InputUi.vue';
import ButtonUi from '~/components/ui/form/ButtonUi.vue';
import { login } from '~/api/auth';
import type { LoginData } from '~/types/auth.types';
import { clearFormValidation, validateForm } from '~/utils/form-validation';
import { useHandleFormRequestError } from '~/composables/useHandleFormRequestError';
import { ERROR_FIELD_CANNOT_BE_EMPTY } from '~/constants/form-errors';
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN, COOKIE_USER_TYPE } from '~/constants/cookies';
import type { BackendFormErrors, FormRules } from '~/types/form-validation.types';
import { useUserStore } from '~/stores/user';
import { useGetBackStore } from '~/stores/get-back';
import { USER_TYPE_DOCTOR } from '~/constants/user-type-values';

const getBackStore = useGetBackStore();
const userStore = useUserStore();
const { handleFormRequestError } = useHandleFormRequestError();

const loading = ref(false);
const formData = ref<LoginData>({
  login: '',
  password: ''
});
const formErrors = ref<BackendFormErrors<LoginData>>({
  login: '',
  password: ''
});
const formRules = reactive<FormRules<LoginData>>({
  login: () => {
    formErrors.value.login = '';

    if (!formData.value.login) {
      formErrors.value.login = ERROR_FIELD_CANNOT_BE_EMPTY;
      return false;
    }

    return true;
  },
  password: () => {
    formErrors.value.password = '';

    if (!formData.value.password) {
      formErrors.value.password = ERROR_FIELD_CANNOT_BE_EMPTY;
      return false;
    }

    return true;
  },
});

const onLogin = async () => {
  try {
    clearFormValidation(formErrors.value);

    const isFormValid = validateForm(formRules);
    if (!isFormValid) return;

    loading.value = true;

    const response = await login(formData.value);

    if (!response.data.value) throw new Error('Неожиданная ошибка запроса');

    useCookie(COOKIE_ACCESS_TOKEN).value = response.data.value.tokens.accessToken;
    useCookie(COOKIE_REFRESH_TOKEN).value = response.data.value.tokens.refreshToken;
    useCookie(COOKIE_USER_TYPE).value = USER_TYPE_DOCTOR;

    userStore.setDoctor(response.data.value.user);
    getBackStore.activate();
  } catch (e) {
    handleFormRequestError(e as Error, formErrors.value, 'Ошибка при попытке авторизации');
    loading.value = false;
  }
};

definePageMeta({
  layout: false
});

useHead({
  title: 'Авторизация'
});
</script>