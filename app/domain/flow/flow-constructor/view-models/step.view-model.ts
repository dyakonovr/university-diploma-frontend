import type { EntityId } from '~/shared/types/core/base-entity.types';

import type { Step } from '../../model/step.types';
import type { FlowConstructorUiState } from './flow-constructor.view-models';
import type { SettingViewModel } from './setting.view-model';

export type StepViewModel = Omit<Step, 'setting'> & {
  input_artifacts_group_id: EntityId | null;
  setting: SettingViewModel;
  ui: FlowConstructorUiState;
};
