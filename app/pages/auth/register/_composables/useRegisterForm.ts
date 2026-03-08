import { register, registerVerifyEmail } from '~/domain/user/api/auth.api';
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
  password: string | null;
  username: string | null;
  /** Отправляется на почту для подтверждения */
  code: string | null;
};

function useRegisterForm() {
  const { toastSuccess, toastError } = useCustomToast();

  const router = useRouter();

  const loading = ref(false);
  const isSecondStep = ref(false);

  const formData = ref<FormFields<Form>>({
    email: null,
    password: null,
    username: null,
    code: null,
  });
  const formErrors = ref<FormErrors<Form>>({
    email: '',
    password: '',
    username: '',
    code: '',
  });
  const firstStepformRules = ref<FormRules<Form>>({
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
    username: () => {
      if (!formData.value.username) {
        formErrors.value.username = ERROR_REQUIRED_FIELD;
        return false;
      }
      if (
        formData.value.username.length < 3 ||
        formData.value.username.length > 30
      ) {
        formErrors.value.username = 'Username должен быть от 3 до 30 символов';
        return false;
      }
      return true;
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
  });

  const handleRegister = async () => {
    try {
      clearFormValidation(formErrors.value);

      const valid = validateForm(firstStepformRules.value);
      if (!valid) {
        toastError('Ошибка валидации');
        return;
      }

      loading.value = true;

      await register({
        email: formData.value.email || '',
        password: formData.value.password || '',
        username: formData.value.username || '',
      });

      toastSuccess(
        'Для подтверждения аккаунта нужно ввести код из письма, который был отправлен вам на почту',
      );
      isSecondStep.value = true;
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in register:', e);
        toastError('Ошибка регистрации');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка регистрации: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors.value, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  const handleVerify = async () => {
    try {
      clearFormValidation(formErrors.value);

      const valid = validateForm({
        ...firstStepformRules.value,
        ...secondStepFormRules.value,
      });
      if (!valid) {
        toastError('Ошибка валидации');
        return;
      }

      loading.value = true;

      await registerVerifyEmail({
        email: formData.value.email || '',
        code: formData.value.code || '',
        username: formData.value.username || '',
      });

      toastSuccess('Вы успешно зарегистрировались!');
      router.push('/account');
    } catch (error) {
      console.error('Register error:', error);
      toastError('Ошибка при регистрации');
    } finally {
      loading.value = false;
    }
  };

  const handleSubmitForm = async () => {
    if (!isSecondStep.value) await handleRegister();
    else handleVerify();
  };

  return {
    formData,
    formErrors,
    loading,
    isSecondStep,
    handleSubmitForm,
  };
}

export default useRegisterForm;
