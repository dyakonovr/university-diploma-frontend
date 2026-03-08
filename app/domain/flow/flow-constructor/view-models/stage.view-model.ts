import type { Stage } from '../../model/stage.types';
import type { FlowConstructorUiState } from './flow-constructor.view-models';
import type { StepViewModel } from './step.view-model';

export type StageViewModel = Omit<Stage, 'steps'> & {
  steps: StepViewModel[];
  ui: FlowConstructorUiState;
};
