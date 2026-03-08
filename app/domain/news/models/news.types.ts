import type { NewsHashtag } from '~/domain/news-hashtag/models/news-hashtag.types';
import type { NewsSubcategory } from '~/domain/news-subcategory/models/news-subcategory.types';
import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

type NewsBase = {
  subcategory_id: EntityId;
  title: string;
  content: string;
  url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_visible: boolean;
  preview_image_key: string;
};

export type NewsCreate = NewsBase & {
  hashtag_ids: EntityId[];
};

/** Новость на лендинге */
export type News = BaseEntity &
  NewsBase & {
    subcategory?: NewsSubcategory;
    hashtags: NewsHashtag[];
    preview_image_url: string;
    created_at: string;
    updated_at: string;
  };
