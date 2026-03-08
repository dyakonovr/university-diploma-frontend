import type { EntityId } from '~/shared/types/core/base-entity.types';
import { generateUuid } from '~/shared/utils/generateUuid';

import type { StageViewModel } from '../view-models/stage.view-model';
import { createEmptyStep } from './step.factories';

export const createEmptyStage = (
  flowId: EntityId,
  order: number,
): StageViewModel => ({
  id: '',
  flow_id: flowId,
  name: 'Новый этап',
  is_context: false,
  order,
  steps: [createEmptyStep('', 0)],
  ui: { is_new: true, is_dirty: true, uuid: generateUuid() },
});
