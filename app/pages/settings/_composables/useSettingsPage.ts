import {
  requestEmailChange,
  updateUsername,
  verifyEmailChange,
} from '~/domain/user/api/users/users.my-api';
import type { User } from '~/domain/user/models/user.types';
import useUserStore from '~/domain/user/stores/user';
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
  new_email: string;
  code: string;
  username: string
};

function useSettingsPage() {
  const { toastSuccess, toastError } = useCustomToast();
  const userStore = useUserStore();

  const initialLoading = ref(false);
  const loading = ref(false);

  const user = ref<User | null>(null);

  const formData = ref<FormFields<Form>>({
    new_email: null,
    code: null,
    username: null,
  });

  const emailFormErrors = reactive<FormErrors<Form>>({
    new_email: '',
    code: '',
  });
  const usernameFormErrors = reactive<FormErrors<Form>>({
    username: '',
  });

  const updateEmailFormRules = ref<FormRules<Form>>({
    new_email: () => {
      if (!formData.value.new_email) {
        emailFormErrors.new_email = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    code: () => {
      if (showCodeField.value && !formData.value.code) {
        emailFormErrors.code = ERROR_REQUIRED_FIELD;
        return false;
      }
      return true;
    },
  });

  const updateUsernameFormRules = ref<FormRules<Form>>({
    username: () => {
      if (!formData.value.username) {
        emailFormErrors.username = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    }
  });

  const showCodeField = ref(false);

  const getData = async () => {
    try {
      const response = await userStore.fetchCurrentUser();

      user.value = response;
      formData.value.new_email = response?.email ?? null;
      formData.value.username = response?.username ?? null;
    } catch (e) {
      console.error('Error while settings data fetching:', e);
      toastError('Ошибка загрузки данных');
    }
  };

  const submitEmailChange = async () => {
    clearFormValidation(emailFormErrors);

    const valid = validateForm(updateEmailFormRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    try {
      loading.value = true;

      await requestEmailChange({
        new_email: formData.value.new_email || '',
      });

      toastSuccess('Код подтверждения отправлен на новый email');
      showCodeField.value = true;
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in code sending:', e);
        toastError('Ошибка при отправке кода');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка при отправке кода: ${e.message}`);
        return;
      }

      setBackendErrors(emailFormErrors, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  const submitCodeConfirmation = async () => {
    clearFormValidation(emailFormErrors);

    const valid = validateForm(updateEmailFormRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    try {
      loading.value = true;

      await verifyEmailChange({
        code: formData.value.code || '',
        new_email: formData.value.new_email || '',
      });

      toastSuccess('Email успешно обновлён');

      showCodeField.value = false;
      formData.value.code = null;

      userStore.changeUserData(
        !formData.value.new_email || !userStore.user
          ? null
          : { ...userStore.user, email: formData.value.new_email || '' },
      );
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in code checking:', e);
        toastError('Ошибка при проверке кода');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка при проверке кода: ${e.message}`);
        return;
      }

      setBackendErrors(emailFormErrors, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  const submitUsernameChange = async () => {
    clearFormValidation(usernameFormErrors);

    const valid = validateForm(updateUsernameFormRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    try {
      loading.value = true;
      const newUsername = formData.value.username || '';

      await updateUsername(newUsername);

      toastSuccess('Логин успешно обновлён');

      if (userStore.user) {
        userStore.changeUserData({
          ...userStore.user,
          username: newUsername,
        });
      }

      if (user.value) {
        user.value = { ...user.value, username: newUsername };
      }
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in nickname updating:', e);
        toastError('Ошибка при обновлении никнейма');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка при обновлении никнейма: ${e.message}`);
        return;
      }

      setBackendErrors(usernameFormErrors, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  return {
    formData,
    emailFormErrors,
    usernameFormErrors,
    loading,
    initialLoading,
    user,
    showCodeField,
    getData,
    submitEmailChange,
    submitCodeConfirmation,
    submitUsernameChange,
  };
}

export default useSettingsPage;
