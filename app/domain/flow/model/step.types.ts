import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

import type { Setting } from './setting.types';

type StepBase = {
  stage_id: EntityId;
  description: string;
  /** Порядковый номер ```Step``` внутри ```Stage``` (пока не используется) */
  order: number;
};

export type StepCreate = StepBase;

/** Отдельный шаг ```Stage``` */
export type Step = BaseEntity &
  StepCreate & {
    output_artifacts_group_id: string;
    setting?: Setting;
  };
