import type { BaseEntity } from '~/shared/types/core/base-entity.types';

type NewsCategoryBase = {
  name: string;
  is_visible: boolean;
};

export type NewsCategoryCreate = NewsCategoryBase;

export type NewsCategory = BaseEntity & NewsCategoryBase;
