import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';

import {
  createPrivateFlow,
  deletePrivateFlow as deletePrivateFlowReq,
  exportPrivateFlowRequest,
  updatePrivateFlow,
} from '../api/private-flows.api';
import type {
  PrivateFlow,
  PrivateFlowCreate,
} from '../model/private-flow.types';

/** Создаёт или сохраняет изменения PrivateFlow */
export async function savePrivateFlow(
  id: EntityId | null,
  flow: PrivateFlowCreate,
): Promise<Response<PrivateFlow>> {
  return id !== null
    ? await updatePrivateFlow(id, flow)
    : await createPrivateFlow(flow);
}

export async function deletePrivateFlow(
  id: EntityId,
): Promise<Response<PrivateFlow>> {
  return await deletePrivateFlowReq(id);
}

export async function exportPrivateFlow(id: EntityId, flowName: string) {
  const response = await exportPrivateFlowRequest(id);
  const blob = new Blob([JSON.stringify(response, null, 2)], {
    type: 'application/json',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${flowName}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
