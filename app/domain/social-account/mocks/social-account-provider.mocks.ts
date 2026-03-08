import type { SocialAccountProvider } from '../models/social-account-provider';

/** Мок-данные провайдеров соц. сетей */
export const mockSocialAccountProviders: SocialAccountProvider[] = [
  {
    name: 'telegram',
    required_fields: ['bot_token', 'chat_id'],
  },
  {
    name: 'vk',
    required_fields: ['access_token', 'group_id'],
  },
  {
    name: 'yandex_dzen',
    required_fields: ['client_id', 'client_secret', 'refresh_token'],
  },
  {
    name: 'youtube',
    required_fields: ['api_key', 'channel_id'],
  },
  {
    name: 'twitter',
    required_fields: [
      'api_key',
      'api_secret',
      'access_token',
      'access_token_secret',
    ],
  },
  {
    name: 'facebook',
    required_fields: ['app_id', 'app_secret', 'page_id'],
  },
  {
    name: 'instagram',
    required_fields: ['access_token', 'user_id'],
  },
  {
    name: 'odnoklassniki',
    required_fields: ['application_id', 'application_key', 'access_token'],
  },
];
