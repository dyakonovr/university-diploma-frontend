import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import type { ValidationResult } from '~/shared/types/core/validation-result.types';

export function validatePrivateFlowName(name: string | null): ValidationResult {
  const result: ValidationResult = {
    error: undefined,
    isValid: true,
  };

  if (!name) {
    result.error = ERROR_REQUIRED_FIELD;
    result.isValid = false;
  }

  return result;
}
