import { generateUuid } from '~/shared/utils/generateUuid';

import type { Stage } from '../../model/stage.types';
import type { StageViewModel } from '../view-models/stage.view-model';
import { mapStepToVM } from './step.mappers';

export const mapStageToVM = (stage: Stage): StageViewModel => ({
  ...stage,
  steps: (stage.steps || []).map(mapStepToVM),
  ui: { is_new: false, is_dirty: false, uuid: generateUuid() },
});
