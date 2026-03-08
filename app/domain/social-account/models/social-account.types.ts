import type { BaseEntity } from '~/shared/types/core/base-entity.types';

import type { SocialAccountProviderName } from './social-account-provider';

export type SocialAccountCredentials = Record<string, string>;

type SocialAccountBase = {
  account_name: string;
  is_active: boolean;
  provider: SocialAccountProviderName;
  /** Значения, необходимые для подключения аккаунта к сервису. Пример:
   * ```
   * "credentials": {
   *   "access_token": "12312321321321213",
   *   "owner_id": "123"
    },
   * ```
   */
  credentials?: SocialAccountCredentials;
  proxy_http: string;
  proxy_https: string;
};

export type SocialAccountCreate = SocialAccountBase;

export type SocialAccount = BaseEntity &
  SocialAccountBase & {
    user_id: string;
    created_at: string;
    updated_at: string;
  };
