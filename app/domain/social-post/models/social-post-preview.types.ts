import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';

/** Унифицированное превью поста для фронтенда */
export type SocialPostDataPreview = {
  /** Короткий заголовок для карточки превью. Может совпадать с title поста или быть обрезанной версией первого текстового блока. */
  title: string | null;
  /** Полный основной текст поста, на основе которого строится превью. */
  text: string | null;
  /** Массив URL */
  audio: string[];
  /** Массив URL */
  images: string[];
  /** Массив URL */
  videos: string[];
  hashtags: string[];

  /** URL */
  cover_image: string | null;
  /** Богатая HTML-версия контента для превью (Telegraph, Dzen, WordPress и др.). Может быть None, если HTML-версия не формируется. */
  html: string;
  /** Обрезанный текст для превью (короткий анонс). Формируется адаптером автоматически по лимиту платформы. */
  preview_text: string;

  /** Предупреждения, связанные с формированием превью (например, превышение лимитов, усечение текста и т.п.). */
  warnings: string[];
};

/** Структура поста для конкретной соц.сети */
export type SocialPostData = {
  social_network: SocialAccountProviderName;
  post: {
    title: string | null;
    text: string | null;
    /** Массив URL */
    audio: string[];
    /** Массив URL */
    images: string[];
    /** Массив URL */
    videos: string[];
    hashtags: string[];

    preview: SocialPostDataPreview;

    metadata: {
      platform: SocialAccountProviderName;
      warnings: string[];
    } & Record<string, string>;
  };
};
