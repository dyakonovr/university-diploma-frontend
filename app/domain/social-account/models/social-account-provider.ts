/** Вид соц. сети (TG, Dzen) */

export type SocialAccountProviderName =
  | 'odnoklassniki'
  | 'vk'
  | 'yandex_dzen'
  | 'telegram'
  | 'instagram'
  | 'wordpress';
export type SocialAccountProvider = {
  /** Код соц. сети, PK */
  name: SocialAccountProviderName;
  /** Обязательные поля при подключении аккаунта в соц. сети. В массиве - названия полей */
  required_fields: string[];
  /** Необязательные поля при подключении аккаунта в соц. сети. В массиве - названия полей */
  optional_fields?: string[];
};
