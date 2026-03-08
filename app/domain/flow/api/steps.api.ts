import type { Step, StepCreate } from '~/domain/flow/model/step.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getSteps(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Step[]>>({
    baseUrl: 'FLOW',
    url: '/steps',
    method: 'GET',
    params,
    signal,
  });
}

export function getStep(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<Step>>({
    baseUrl: 'FLOW',
    url: `/steps/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function createStep(
  body: StepCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<Step>>({
    baseUrl: 'FLOW',
    url: '/steps',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updateStep(
  id: EntityId,
  body: StepCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<Step>>({
    baseUrl: 'FLOW',
    url: `/steps/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function deleteStep(id: EntityId, signal: AbortSignal | null = null) {
  return request<Response<Step>>({
    baseUrl: 'FLOW',
    url: `/steps/${id}`,
    method: 'DELETE',
    signal,
  });
}
