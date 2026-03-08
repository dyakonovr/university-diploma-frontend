import type { SocialAccountProvider } from '../models/social-account-provider';
import type { SocialAccountViewModel } from '../view-models/social-account.view-models';

export function createEmptySocialAccountCredentials(
  fields: SocialAccountProvider['required_fields'],
): SocialAccountViewModel['credentials'] {
  const result: SocialAccountViewModel['credentials'] = {};

  fields.forEach((f) => {
    result[f] = null;
  });

  return result;
}
