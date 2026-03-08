import { login } from '~/domain/user/api/auth.api';
import {
  validateUserEmail,
  validateUserPassword,
} from '~/domain/user/services/validation';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import { RequestError } from '~/shared/errors/request.errors';
import type {
  FormErrors,
  FormFields,
  FormRules,
} from '~/shared/types/core/form-validation.types';
import {
  clearFormValidation,
  setBackendErrors,
  validateForm,
} from '~/shared/utils/core/formValidation';

type Form = {
  email: string | null;
  password: string | null;
};

function useLoginForm() {
  const { getBack } = useGetBack('/account');
  const { toastSuccess, toastError } = useCustomToast();

  const loading = ref(false);

  const formData = ref<FormFields<Form>>({
    email: null,
    password: null,
  });
  const formErrors = ref<FormErrors<Form>>({
    email: '',
    password: '',
  });
  const formRules = ref<FormRules<Form>>({
    email: () => {
      const res = validateUserEmail(formData.value.email);
      formErrors.value.email = res.error;

      return res.isValid;
    },
    password: () => {
      const res = validateUserPassword(formData.value.password);
      formErrors.value.password = res.error;

      return res.isValid;
    },
  });

  const handleLogin = async () => {
    try {
      clearFormValidation(formErrors.value);

      const valid = validateForm(formRules.value);
      if (!valid) {
        toastError('Ошибка валидации');
        return;
      }

      loading.value = true;

      await login({
        email: formData.value.email || '',
        password: formData.value.password || '',
      });

      toastSuccess('Успешный вход!');
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in login:', e);
        toastError('Ошибка авторизации');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка авторизации: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors.value, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  return {
    formData,
    formErrors,
    loading,
    handleLogin,
  };
}

export default useLoginForm;
