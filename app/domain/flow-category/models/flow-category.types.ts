import type { BaseEntity } from '~/shared/types/core/base-entity.types';

type PublicFlowCategoryBase = {
  name: string;
};

export type PublicFlowCategoryCreate = PublicFlowCategoryBase;

export type PublicFlowCategory = BaseEntity & PublicFlowCategoryBase;
