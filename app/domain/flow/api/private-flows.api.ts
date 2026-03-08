import type {
  PrivateFlow,
  PrivateFlowCreate,
  PublishPrivateFlowBody,
} from '~/domain/flow/model/private-flow.types';
import type { RawPostStatus } from '~/domain/raw-post/models/raw-post.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getPrivateFlows(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<PrivateFlow[]>>({
    baseUrl: 'FLOW',
    url: '/flows',
    method: 'GET',
    params,
    signal,
  });
}

export function getPrivateFlow(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<PrivateFlow>>({
    baseUrl: 'FLOW',
    url: `/flows/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function createPrivateFlow(
  body: PrivateFlowCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<PrivateFlow>>({
    baseUrl: 'FLOW',
    url: '/flows',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updatePrivateFlow(
  id: EntityId,
  body: PrivateFlowCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<PrivateFlow>>({
    baseUrl: 'FLOW',
    url: `/flows/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function deletePrivateFlow(
  id: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<PrivateFlow>>({
    baseUrl: 'FLOW',
    url: `/flows/${id}`,
    method: 'DELETE',
    signal,
  });
}

export function startPrivateFlowGeneration(id: EntityId, params?: QueryParams) {
  return request<Response<{ post_id: EntityId; status: RawPostStatus }>>({
    baseUrl: 'FLOW',
    url: `/flows/${id}/generate`,
    method: 'POST',
    params,
  });
}

export function publishPrivateFlow(
  id: EntityId,
  body: PublishPrivateFlowBody,
  signal: AbortSignal | null = null,
) {
  return request<Response<PrivateFlow>>({
    baseUrl: 'FLOW',
    url: `/flows/${id}/publish`,
    method: 'POST',
    signal,
    data: body,
  });
}

/** Принимает FormData с ключом file */
export function importPrivateFlow(
  body: FormData,
  signal: AbortSignal | null = null,
) {
  return request<Response<{ flow_id: EntityId }>>({
    baseUrl: 'FLOW',
    url: '/flows/import',
    method: 'POST',
    signal,
    data: body,
  });
}

/** Возвращает json */
export function exportPrivateFlowRequest(
  id: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Omit<PrivateFlow, 'id'>>({
    baseUrl: 'FLOW',
    url: `/flows/${id}/export`,
    method: 'GET',
    signal,
  });
}
