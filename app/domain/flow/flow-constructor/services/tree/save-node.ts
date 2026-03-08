import { saveSetting } from '../../../usecases/setting.usecase';
import { saveStage } from '../../../usecases/stage.usecase';
import { saveStep } from '../../../usecases/step.usecase';
import { mapSettingToDomain } from '../../mappers/setting.mappers';
import type {
  FlowConstructorUiState,
} from '../../view-models/flow-constructor.view-models';
import type { SettingViewModel } from '../../view-models/setting.view-model';
import type { StageViewModel } from '../../view-models/stage.view-model';
import type { StepViewModel } from '../../view-models/step.view-model';


export type SaveAction = 'create' | 'update' | 'skip';

function getSaveAction(ui: FlowConstructorUiState): SaveAction {
  if (ui.is_new) return 'create';
  if (ui.is_dirty) return 'update';
  return 'skip';
}

export function stripUi<T extends { ui: FlowConstructorUiState }>(
  vm: T,
): Omit<T, 'ui'> {
  const { ui, ...rest } = vm;
  return rest;
}

export function markFlowTreeNodeAsSaved(ui: FlowConstructorUiState) {
  ui.is_new = false;
  ui.is_dirty = false;
}

export async function saveTreeStage(
  stage: StageViewModel,
): Promise<SaveAction> {
  const action = getSaveAction(stage.ui);
  if (action === 'skip') return action;

  const response = await saveStage(stage.id || null, stripUi(stage));
  if (action === 'create') {
    stage.id = response.data.id;

    stage.steps.forEach((s) => {
      s.stage_id = stage.id;
    });
  }

  markFlowTreeNodeAsSaved(stage.ui);

  return action;
}

export async function saveTreeStep(step: StepViewModel): Promise<SaveAction> {
  const action = getSaveAction(step.ui);
  if (action === 'skip') return action;

  const response = await saveStep(step.id || null, stripUi(step));
  if (action === 'create') {
    step.id = response.data.id;
    step.output_artifacts_group_id = response.data.output_artifacts_group_id;
  }

  markFlowTreeNodeAsSaved(step.ui);

  return action;
}

export async function saveTreeSetting(
  setting: SettingViewModel,
): Promise<SaveAction> {
  const action = getSaveAction(setting.ui);
  if (action === 'skip') return action;

  const data = mapSettingToDomain(stripUi(setting));
  const response = await saveSetting(data.id || null, data);
  if (action === 'create') {
    setting.id = response.data.id;
  }

  markFlowTreeNodeAsSaved(setting.ui);

  return action;
}
