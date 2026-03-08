import type { FlowTreeItem } from '../../stores/constructor-store';
import type { StageViewModel } from '../../view-models/stage.view-model';
import type { StepViewModel } from '../../view-models/step.view-model';
import { saveTreeSetting, saveTreeStage, saveTreeStep } from './save-node';
import {
  type FlowValidationErrors,
  validateFlowTree,
} from './validation';

export type SaveFlowResult = {
  success: boolean;
  errors?: FlowValidationErrors;
};

/**
 * Сохраняет всё дерево Flow: все этапы → все шаги → все настройки.
 * Валидирует перед сохранением.
 */
export async function saveFlowTree(
  tree: FlowTreeItem[],
): Promise<SaveFlowResult> {
  const { valid, errors } = validateFlowTree(tree);
  if (!valid) return { success: false, errors };

  for (const stage of tree) {
    await saveStageWithSteps(stage);
  }

  return { success: true };
}

/** Сохраняет один этап со всеми шагами */
export async function saveStageWithSteps(stage: StageViewModel): Promise<void> {
  await saveTreeStage(stage);

  for (const step of stage.steps) {
    await saveStepWithSetting(step, stage);
  }
}

/** Сохраняет один шаг и его настройки. Если stage ещё не сохранён — сохраняет его первым. */
export async function saveStepWithSetting(
  step: StepViewModel,
  stage: StageViewModel,
): Promise<void> {
  if (!stage.id) {
    await saveTreeStage(stage);
  }

  await saveTreeStep(step);
  step.setting.step_id = step.id;
  await saveTreeSetting(step.setting);
}
