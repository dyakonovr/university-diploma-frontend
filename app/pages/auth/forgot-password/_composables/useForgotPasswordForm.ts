import {
  requestForgotPassword,
  resetPassword,
} from '~/domain/user/api/auth.api';
import {
  validateUserEmail,
  validateUserPassword,
} from '~/domain/user/services/validation';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
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
  code: string | null;
  new_password: string | null;
};

function useForgotPasswordForm() {
  const { toastSuccess, toastError } = useCustomToast();

  const router = useRouter();

  const loading = ref(false);
  const isSecondStep = ref(false);

  const formData = ref<FormFields<Form>>({
    email: null,
    code: null,
    new_password: null,
  });
  const formErrors = ref<FormErrors<Form>>({
    email: '',
    code: '',
    new_password: '',
  });
  const firstStepFormRules = ref<FormRules<Form>>({
    email: () => {
      const res = validateUserEmail(formData.value.email);
      formErrors.value.email = res.error;

      return res.isValid;
    },
  });
  const secondStepFormRules = ref<FormRules<Form>>({
    code: () => {
      if (!formData.value.code) {
        formErrors.value.code = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    new_password: () => {
      const res = validateUserPassword(formData.value.new_password);
      formErrors.value.new_password = res.error;

      return res.isValid;
    },
  });

  const handleRequestPasswordReset = async () => {
    try {
      clearFormValidation(formErrors.value);

      const valid = validateForm(firstStepFormRules.value);
      if (!valid) {
        toastError('Ошибка валидации');
        return;
      }

      loading.value = true;

      await requestForgotPassword({
        email: formData.value.email || '',
      });
      isSecondStep.value = true;
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in password reset:', e);
        toastError('Ошибка сброса пароля');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка сброса пароля: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors.value, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  const handleResetPassword = async () => {
    try {
      clearFormValidation(formErrors.value);

      const valid =
        validateForm(firstStepFormRules.value) &&
        validateForm(secondStepFormRules.value);
      if (!valid) {
        toastError('Ошибка валидации');
        return;
      }

      loading.value = true;

      await resetPassword({
        email: formData.value.email || '',
        code: formData.value.code || '',
        new_password: formData.value.new_password || '',
      });
      toastSuccess('Пароль успешно установлен!');
      router.push('/auth/login');
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in set new password:', e);
        toastError('Ошибка при установке нового пароля');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка при установке нового пароля: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors.value, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  const handleSubmitForm = async () => {
    if (!isSecondStep.value) await handleRequestPasswordReset();
    else handleResetPassword();
  };

  return {
    formData,
    formErrors,
    loading,
    isSecondStep,
    handleSubmitForm,
  };
}

export default useForgotPasswordForm;
