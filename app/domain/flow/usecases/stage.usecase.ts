import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';

import {
  createStage,
  deleteStage as deleteStageReq,
  updateStage,
} from '../api/stages.api';
import type { Stage, StageCreate } from '../model/stage.types';

/** Создаёт или сохраняет изменения Stage */
export async function saveStage(
  id: EntityId | null,
  Stage: StageCreate,
): Promise<Response<Stage>> {
  return id !== null ? await updateStage(id, Stage) : await createStage(Stage);
}

export async function deleteStage(id: EntityId): Promise<Response<Stage>> {
  return await deleteStageReq(id);
}
