import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { ValidationResult } from '~/shared/types/core/validation-result.types';

export function validatePublicFlowName(name: string | null): ValidationResult {
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

export function validatePublicFlowDescription(description: string | null): ValidationResult {
  const result: ValidationResult = {
    error: undefined,
    isValid: true,
  };

  if (!description) {
    result.error = ERROR_REQUIRED_FIELD;
    result.isValid = false;
  }

  return result;
}

export function validatePublicFlowCategoryId(categoryId: EntityId | null): ValidationResult {
  const result: ValidationResult = {
    error: undefined,
    isValid: true,
  };

  if (!categoryId) {
    result.error = ERROR_REQUIRED_FIELD;
    result.isValid = false;
  }

  return result;
}
