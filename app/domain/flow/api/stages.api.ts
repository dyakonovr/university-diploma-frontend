import type { Stage, StageCreate } from '~/domain/flow/model/stage.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getStages(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Stage[]>>({
    baseUrl: 'FLOW',
    url: '/stages',
    method: 'GET',
    params,
    signal,
  });
}

export function getStage(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<Stage>>({
    baseUrl: 'FLOW',
    url: `/stages/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function createStage(
  body: StageCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<Stage>>({
    baseUrl: 'FLOW',
    url: '/stages',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updateStage(
  id: EntityId,
  body: StageCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<Stage>>({
    baseUrl: 'FLOW',
    url: `/stages/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function deleteStage(id: EntityId, signal: AbortSignal | null = null) {
  return request<Response<Stage>>({
    baseUrl: 'FLOW',
    url: `/stages/${id}`,
    method: 'DELETE',
    signal,
  });
}
