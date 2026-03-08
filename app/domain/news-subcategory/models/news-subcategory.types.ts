import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

import type { NewsCategory } from '../domain/news-category/models/news-category.types';

type NewsSubcategoryBase = {
  name: string;
  category_id: EntityId;
  is_visible: boolean;
};

export type NewsSubcategoryCreate = NewsSubcategoryBase;

export type NewsSubcategory = BaseEntity &
  NewsSubcategoryBase & {
    category?: NewsCategory;
  };
