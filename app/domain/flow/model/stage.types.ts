import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

import type { Step } from './step.types';

type StageBase = {
  name: string;
  flow_id: EntityId;
  /** Если ```Stage``` контекстный, то он не имеет ```Output``` (не создаётся ```Block``` с результатами) */
  is_context: boolean;
  /** Порядковый номер ```Stage``` внутри ```Flow``` (пока не используется) */
  order: number;
};

export type StageCreate = StageBase;

/** Сущность предназначена для группировки ```Steps``` внутри конкретного ```Flow``` */
export type Stage = BaseEntity &
  StageCreate & {
    steps: Step[];
  };
