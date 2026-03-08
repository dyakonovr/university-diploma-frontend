import type { SocialAccount } from '../models/social-account.types';

export type SocialAccountCredentialsErrors = Record<string, string | null>;

export type SocialAccountViewModel = {
  account_name: string | null;
  provider: SocialAccount['provider'] | null;
  is_active: boolean;
  proxy_http: string | null;
  proxy_https: string | null;
  credentials: Record<string, string | boolean | null>;
};
