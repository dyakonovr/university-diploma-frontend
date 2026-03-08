import type {
  PublicFlow,
  PublicFlowCreate,
} from '~/domain/flow/model/public-flow.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

/** Список Public Flow. Используется для отображения маркетплейса */
export function getPublicFlows(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<PublicFlow[]>>({
    baseUrl: 'FLOW',
    url: '/public_flows',
    method: 'GET',
    params,
    signal,
  });
}

/** Список Public Flow. Используется для отображения маркетплейса */
export function getMyPublicFlows(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<PublicFlow[]>>({
    baseUrl: 'FLOW',
    url: '/public_flows/me',
    method: 'GET',
    params,
    signal,
  });
}

export function getPublicFlow(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<PublicFlow>>({
    baseUrl: 'FLOW',
    url: `/public_flows/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

/** Копирования `Public Flow` по ID. В случае успеха создаёт аналогичный `Private Flow` */
export function copyPublicFlow(
  id: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<
    Response<{ flow_id: EntityId; message: string; name: string }>
  >({
    baseUrl: 'FLOW',
    url: `/public_flows/${id}/copy`,
    method: 'POST',
    signal,
  });
}

export function updatePublicFlow(
  id: EntityId,
  body: PublicFlowCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<PublicFlow>>({
    baseUrl: 'FLOW',
    url: `/public_flows/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function deletePublicFlow(id: EntityId, signal: AbortSignal | null = null) {
  return request<Response<PublicFlow>>({
    baseUrl: 'FLOW',
    url: `/public_flows/${id}`,
    method: 'DELETE',
    signal,
  });
}

export function toggleLikePublicFlow(
  id: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<{ liked: boolean; likes_count: number; }>>({
    baseUrl: 'FLOW',
    url: `/public_flows/${id}/like`,
    method: 'POST',
    signal,
  });
}

/** Список Public Flow на рассмотрении. Доступно только админу */
export function getPublicFlowsOnModeration(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<PublicFlow[]>>({
    baseUrl: 'FLOW',
    url: '/public_flows/moderate',
    method: 'GET',
    params,
    signal,
  });
}

/** Public Flow на рассмотрении. Доступно только админу */
export function getPublicFlowOnModeration(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<PublicFlow>>({
    baseUrl: 'FLOW',
    url: `/public_flows/moderate/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export type ModerationDecision = {
  status: 'Approve' | 'Decline';
  decline_reason?: string;
};

/** Одобрение/отклонение публикации Public Flow. Доступно только админу */
export function finishPublicFlowModeration(
  id: EntityId,
  body: ModerationDecision,
  signal: AbortSignal | null = null,
) {
  return request<Response<PublicFlow>>({
    baseUrl: 'FLOW',
    url: `/public_flows/moderate/${id}`,
    method: 'POST',
    signal,
    data: body,
  });
}
