import type { PublicFlowCategory } from '~/domain/flow-category/models/flow-category.types';
import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';
import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

import type { FlowAccessData } from './flow.general-types';
import type { Stage } from './stage.types';

type PublicFlowBase = {
  name: string;
  /** Raw json */
  flow_data: {
    stages?: Stage[];
  };
  description: string;
};

export type PublicFlowCreate = PublicFlowBase;

export type PublicFlowStatus = 'Approve' | 'Decline' | 'Review';
export type PublicFlow = BaseEntity &
  PublicFlowBase & {
    category?: PublicFlowCategory;
    is_copied: boolean;
    is_liked: boolean;
    /** Нет в статусе `Decline`  */
    copy_count: number;
    /** Нет в статусе `Decline`  */
    likes_count: number;
    /** model_id[] */
    models: EntityId[];
    social_networks: SocialAccountProviderName[];
    user_id: EntityId;
    created_at: string;
    status: PublicFlowStatus;
    /** Причина отказа публикации от модератора */
    decline_reason?: string | null;
    access?: FlowAccessData;
  };
