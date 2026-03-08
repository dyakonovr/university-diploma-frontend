import type {
  PublicFlowCategory,
  PublicFlowCategoryCreate,
} from '~/domain/flow-category/models/flow-category.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getPublicFlowCategories(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<PublicFlowCategory[]>>({
    baseUrl: 'FLOW',
    url: '/flow-categories',
    method: 'GET',
    params,
    signal,
  });
}

export function getPublicFlowCategory(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<PublicFlowCategory>>({
    baseUrl: 'FLOW',
    url: `/flow-categories/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function createPublicFlowCategory(
  body: PublicFlowCategoryCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<PublicFlowCategory>>({
    baseUrl: 'FLOW',
    url: '/flow-categories',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updatePublicFlowCategory(
  id: EntityId,
  body: PublicFlowCategoryCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<PublicFlowCategory>>({
    baseUrl: 'FLOW',
    url: `/flow-categories/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function deletePublicFlowCategory(
  id: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<PublicFlowCategory>>({
    baseUrl: 'FLOW',
    url: `/flow-categories/${id}`,
    method: 'DELETE',
    signal,
  });
}
