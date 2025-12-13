import { useCustomToast } from './useCustomToast';
import { CustomFetchError } from '~/composables/useAPIFetch';
import { setBackendErrors } from '~/utils/form-validation';

export const useHandleFormRequestError = () => {
  const toasts = useCustomToast();

  const handleFormRequestError = (e: Error, formErrors: Record<string, string>, serverErrorMsg: string) => {
    if (e instanceof CustomFetchError) {
      if (e.statusCode === 422 && 'errors' in e) {
        toasts.toastError('Ошибка валидации формы');
        setBackendErrors(formErrors, e.errors as Record<string, string[]>);
      }
      else toasts.toastError(serverErrorMsg);
    } else {
      toasts.toastError(serverErrorMsg);
    }
  };

  return { toasts, handleFormRequestError };
};