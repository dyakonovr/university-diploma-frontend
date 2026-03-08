import type {
  FormErrors,
  FormFields,
  FormRules,
} from '@/shared/types/core/form-validation.types';
import {
  clearFormValidation,
  setBackendErrors,
  validateForm,
} from '@/shared/utils/core/formValidation';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import { RequestError } from '~/shared/errors/request.errors';
import type { SelectOption } from '~/shared/types/ui/select.types';

type TabForm = {
  prompt: string;
  platform: string;
};

export const FIRST_TAB_PLATFORMS: SelectOption[] = [
  { label: 'VK', value: 'VK' },
  { label: 'Telegram', value: 'Telegram' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'TikTok', value: 'TikTok' },
];

function useLandingFirstTabForm() {
  const { toastSuccess, toastError } = useCustomToast();

  const loading = ref(false);

  const formData = ref<FormFields<TabForm>>({
    platform: null,
    prompt: null,
  });
  const formErrors = reactive<FormErrors<TabForm>>({
    platform: '',
    prompt: '',
  });
  const formRules = ref<FormRules<TabForm>>({
    platform: () => {
      if (!formData.value.platform) {
        formErrors.platform = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
    prompt: () => {
      if (!formData.value.prompt) {
        formErrors.prompt = ERROR_REQUIRED_FIELD;
        return false;
      }

      return true;
    },
  });

  const clearFormData = () => {
    formData.value = {
      platform: null,
      prompt: null,
    };
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value);
    if (!valid) {
      // toastError('Ошибка валидации');
      return;
    }

    try {
      loading.value = true;
      clearFormData();
      toastSuccess('Успешная отправка');
      // if (editId.value) {
      //   await updateFlowCategory(editId.value, formData.value as FlowCategoryCreate);
      // } else {
      //   await createFlowCategory(formData.value as FlowCategoryCreate);
      // }

      // toastSuccess(editId.value ? 'Категория шаблона создана!' : 'Категория шаблона обновлена!');
      // getBack();
    } catch (e) {
      if (e instanceof RequestError) {
        setBackendErrors(formErrors, e.errors);
        toastError('Ошибка валидации формы');
      } else {
        toastError('Ошибка создания или редактирования Сущности');
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    formData,
    formRules,
    formErrors,
    loading,
    onSubmit,
  };
}

export default useLandingFirstTabForm;
