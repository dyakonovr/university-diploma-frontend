import { deleteStage } from '~/domain/flow/api/stages.api';
import { deleteStep } from '~/domain/flow/api/steps.api';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import { createEmptyStage } from '../../factories/stage.factories';
import { createEmptyStep } from '../../factories/step.factories';
import type { FlowTreeItem } from '../../stores/constructor-store';
import type { StageViewModel } from '../../view-models/stage.view-model';

/** Добавить новый пустой этап в дерево */
export function insertStage(tree: FlowTreeItem[], flowId: EntityId): void {
  tree.push(createEmptyStage(flowId, tree.length));
}

/** Добавить новый пустой шаг в этап */
export function insertStep(stage: StageViewModel): void {
  stage.steps.push(createEmptyStep(stage.id, stage.steps.length));
}

/** Удалить этап из дерева (с API-вызовом, если сохранён) */
export async function removeStage(
  tree: FlowTreeItem[],
  id: EntityId,
  idx: number,
): Promise<void> {
  if (id) await deleteStage(id);
  tree.splice(idx, 1);
}

/** Удалить шаг (API-вызов, splice делает вызывающий код) */
export async function removeStep(stepId: EntityId): Promise<void> {
  if (stepId) await deleteStep(stepId);
}
