import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';
import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

import type { FlowAccessData } from './flow.general-types';
import type { Stage } from './stage.types';

type PrivateFlowBase = {
  name: string;
};

export type PrivateFlowCreate = PrivateFlowBase;

/** ```Шаблон```, по которому будет генерироваться ```Пост (Raw Post)``` */
export type PrivateFlow = BaseEntity &
  PrivateFlowBase & {
    stages?: Stage[];
    access?: FlowAccessData;
    created_at: string;
  };

/** Тело запроса для публикации (Private Flow → Public Flow) */
export type PublishPrivateFlowBody = {
  name: string;
  description: string;
  category_id: EntityId;
  social_networks: SocialAccountProviderName[];
};
