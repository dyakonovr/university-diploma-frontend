import type { EntityId } from '~/shared/types/core/base-entity.types';
import { generateUuid } from '~/shared/utils/generateUuid';

import type { StepViewModel } from '../view-models/step.view-model';
import { createEmptySetting } from './setting.factories';

export const createEmptyStep = (
  stageId: EntityId,
  order: number,
): StepViewModel => ({
  id: '',
  stage_id: stageId,
  description: '',
  order,
  output_artifacts_group_id: '',
  setting: createEmptySetting(''),
  input_artifacts_group_id: null,
  ui: { is_new: true, is_dirty: true, uuid: generateUuid() },
});
