import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type {
  NewsSubcategory,
  NewsSubcategoryCreate,
} from '../models/news-subcategory.types';

export function getNewsSubcategories(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<NewsSubcategory[]>>({
    baseUrl: 'NEWS',
    url: '/subcategories',
    method: 'GET',
    params,
    signal,
  });
}

export function getNewsSubcategory(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsSubcategory>>({
    baseUrl: 'NEWS',
    url: `/subcategories/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function createNewsSubcategory(
  body: NewsSubcategoryCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsSubcategory>>({
    baseUrl: 'NEWS',
    url: '/subcategories',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updateNewsSubcategory(
  id: EntityId,
  body: NewsSubcategoryCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsSubcategory>>({
    baseUrl: 'NEWS',
    url: `/subcategories/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function deleteNewsSubcategory(
  id: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsSubcategory>>({
    baseUrl: 'NEWS',
    url: `/subcategories/${id}`,
    method: 'DELETE',
    signal,
  });
}
