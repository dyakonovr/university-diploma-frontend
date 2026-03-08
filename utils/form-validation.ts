export const validateForm = (formRules: Record<string, () => boolean>): boolean => {
  const validators = Object.values(formRules);
  let result = true;
  validators.forEach(v => {
    if (!v()) {
      result = false;
    }
  });

  return result;
};

export const clearFormValidation = (formErrors: Record<string, string>) => {
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = '';
  });
};

export const setBackendErrors = (formErrors: Record<string, string>, errors: Record<string, string[]>) => {
  for (const errorKey in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, errorKey)) {
      const errorText = errors[errorKey];
      formErrors[errorKey] = errorText[0];
    }
  }
};