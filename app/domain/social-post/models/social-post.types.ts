import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

import type { SocialPostData } from './social-post-preview.types';

/** Пост в соц. сети, созданные из результата генерации (RawPost) */
export type SocialPost = BaseEntity & {
  /** Raw Post ID */
  post_id: EntityId;
  /** ID слота расписания, если пост создан по расписанию */
  schedule_id?: EntityId;
  /** ISO timestamp. Время, когда должен быть опубликован пост */
  post_at: string;
  /** ISO timestamp. Время, когда пост фактически опубликован */
  posted_at: string;

  /** Структура поста */
  preview: SocialPostData;

  /** ID поста в соц. сети */
  external_post_id: string;
  /** Ссылка на пост в соц. сети */
  post_url?: string;

  /** Время, когда Пост создан в БД */
  created_at: string;
  updated_at: string;
};
