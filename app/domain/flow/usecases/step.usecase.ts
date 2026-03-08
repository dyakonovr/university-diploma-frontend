import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';

import {
  createStep,
  deleteStep as deleteStepReq,
  updateStep,
} from '../api/steps.api';
import type { Step, StepCreate } from '../model/step.types';

/** Создаёт или сохраняет изменения Step */
export async function saveStep(
  id: EntityId | null,
  Step: StepCreate,
): Promise<Response<Step>> {
  return id !== null ? await updateStep(id, Step) : await createStep(Step);
}

export async function deleteStep(id: EntityId): Promise<Response<Step>> {
  return await deleteStepReq(id);
}
