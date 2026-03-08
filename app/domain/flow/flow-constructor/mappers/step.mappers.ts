import { generateUuid } from '~/shared/utils/generateUuid';

import type { Step } from '../../model/step.types';
import { createEmptySetting } from '../factories/setting.factories';
import type { StepViewModel } from '../view-models/step.view-model';
import { mapSettingToVM } from './setting.mappers';

export const mapStepToVM = (step: Step): StepViewModel => ({
  ...step,
  setting: step.setting
    ? mapSettingToVM(step.setting)
    : createEmptySetting(step.id),
  ui: { is_new: false, is_dirty: false, uuid: generateUuid() },
  input_artifacts_group_id: null,
  output_artifacts_group_id: step.output_artifacts_group_id,
});
