import type { BackendErrors } from '~/shared/types/core/backend-errors';

export const validateForm = (
  formRules: Record<string, () => boolean>,
): boolean => {
  const validators = Object.values(formRules);
  let result = true;
  validators.forEach((v) => {
    if (!v()) {
      result = false;
    }
  });

  return result;
};

export const clearFormValidation = (formErrors: Record<string, string>) => {
  Object.keys(formErrors).forEach((key) => {
    formErrors[key as keyof typeof formErrors] = '';
  });
};

export const setBackendErrors = (
  formErrors: Record<string, string>,
  errors: BackendErrors,
) => {
  for (const errorKey in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, errorKey)) {
      const errorText = errors[errorKey];

      if (!(errorKey in formErrors) || !errorText) continue;
      formErrors[errorKey] = errorText[0] ?? '';
    }
  }
};
