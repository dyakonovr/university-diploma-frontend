import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import type { ValidationResult } from '~/shared/types/core/validation-result.types';

export function validateUserEmail(email: string | null): ValidationResult {
  const result: ValidationResult = {
    error: undefined,
    isValid: true,
  };

  if (!email) {
    result.error = ERROR_REQUIRED_FIELD;
    result.isValid = false;
  }

  return result;
}

export function validateUserPassword(
  password: string | null,
): ValidationResult {
  const result: ValidationResult = {
    error: undefined,
    isValid: true,
  };

  if (!password) {
    result.error = ERROR_REQUIRED_FIELD;
    result.isValid = false;
  }

  return result;
}
