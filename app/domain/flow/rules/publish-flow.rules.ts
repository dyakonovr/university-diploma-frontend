import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { ValidationResult } from '~/shared/types/core/validation-result.types';

export function validatePublishFlowName(name: string | null): ValidationResult {
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

export function validatePublishFlowDescription(
  description: string | null,
): ValidationResult {
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

export function validatePublishFlowCategoryId(
  categoryId: EntityId | null,
): ValidationResult {
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

export function validatePublishFlowSocialNetworks(
  socialNetworks: SocialAccountProviderName[] | null,
): ValidationResult {
  const result: ValidationResult = {
    error: undefined,
    isValid: true,
  };

  if (!socialNetworks || socialNetworks.length === 0) {
    result.error = ERROR_REQUIRED_FIELD;
    result.isValid = false;
  }

  return result;
}
