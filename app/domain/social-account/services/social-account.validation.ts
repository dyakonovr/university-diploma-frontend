import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import type { ValidationResult } from '~/shared/types/core/validation-result.types';

import type { SocialAccountProvider } from '../models/social-account-provider';
import type { SocialAccountViewModel } from '../view-models/social-account.view-models';

export function validateSocialAccountName(
  name: SocialAccountViewModel['account_name'],
): ValidationResult {
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

export function validateSocialAccountProvider(
  provider: SocialAccountViewModel['provider'],
): ValidationResult {
  const result: ValidationResult = {
    error: undefined,
    isValid: true,
  };

  if (!provider) {
    result.error = ERROR_REQUIRED_FIELD;
    result.isValid = false;
  }

  return result;
}

export function validateSocialAccountProxyHttp(
  proxy_http: string | null,
): ValidationResult {
  const result: ValidationResult = {
    error: undefined,
    isValid: true,
  };

  if (!proxy_http) {
    return result;
  }

  if (!proxy_http.startsWith('http://')) {
    result.error = 'Прокси должен начинаться с http://';
    result.isValid = false;
  }

  return result;
}

// type ProxyValidationResult = {
//   http: ValidationResult;
//   https: ValidationResult;
//   isValid: boolean;
// };
// export function validateSocialAccountProxy(proxy: SocialAccountViewModel['proxy']): ProxyValidationResult {
//   const result: ProxyValidationResult = {
//     http: { error: undefined, isValid: true },
//     https: { error: undefined, isValid: true },
//     isValid: true,
//   };

//   if (!proxy.http) {
//     result.http.error = ERROR_REQUIRED_FIELD;
//     result.http.isValid = false;

//     result.isValid = false;
//   }

//   return result;
// }

type CredentialsValidationResult = {
  errors: Record<string, ValidationResult>;
  isValid: boolean;
};

/**
 * @returns
 * ```
 * {
 *  "api_key": {
 *    error: 'Error',
 *    isValid: false,
 *  },
 *  ...
 * }
 * ```
 */
export function validateSocialAccountCredentials(
  creds: SocialAccountViewModel['credentials'],
  provider: SocialAccountProvider,
): CredentialsValidationResult {
  const result: CredentialsValidationResult = {
    errors: {},
    isValid: true,
  };

  for (const field in creds) {
    if (!Object.hasOwn(creds, field)) continue;
    result.errors[field] = {
      error: undefined,
      isValid: true,
    };

    const value = creds[field];
    if (!value && provider.required_fields.includes(field)) {
      result.errors[field] = {
        error: ERROR_REQUIRED_FIELD,
        isValid: false,
      };

      result.isValid = false;
    }
  }

  return result;
}
