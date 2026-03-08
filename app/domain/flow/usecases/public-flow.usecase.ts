import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';

import { updatePublicFlow } from '../api/public-flows.api';
import type { PublicFlow, PublicFlowCreate } from '../model/public-flow.types';

/** Сохраняет изменения PublicFlow */
export async function savePublicFlow(
  id: EntityId,
  flow: PublicFlowCreate,
): Promise<Response<PublicFlow>> {
  return await updatePublicFlow(id, flow);
}
