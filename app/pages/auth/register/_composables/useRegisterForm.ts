import { register } from '~/domain/user/api/auth.api';
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
  name: string | null;
};

function useRegisterForm() {
  const { toastSuccess, toastError } = useCustomToast();

  const router = useRouter();

  const loading = ref(false);

  const formData = ref<FormFields<Form>>({
    email: null,
    password: null,
    name: null,
  });
  const formErrors = ref<FormErrors<Form>>({
    email: '',
    password: '',
    name: '',
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
    name: () => {
      if (!formData.value.name) {
        formErrors.value.name = ERROR_REQUIRED_FIELD;
        return false;
      }
      if (
        formData.value.name.length < 3 ||
        formData.value.name.length > 30
      ) {
        formErrors.value.name = 'Username должен быть от 3 до 30 символов';
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
        name: formData.value.name || '',
      });

      toastSuccess(
        'Вы успешно зарегистрировались!',
      );
      router.push('/auth/login');
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

  const handleSubmitForm = async () => {
    await handleRegister();
  };

  return {
    formData,
    formErrors,
    loading,
    handleSubmitForm,
  };
}

export default useRegisterForm;
