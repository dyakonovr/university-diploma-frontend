import type {
  NewsCategory,
  NewsCategoryCreate,
} from '~/domain/news-category/models/news-category.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getNewsCategories(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<NewsCategory[]>>({
    baseUrl: 'NEWS',
    url: '/categories',
    method: 'GET',
    params,
    signal,
  });
}

export function getNewsCategory(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsCategory>>({
    baseUrl: 'NEWS',
    url: `/categories/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function createNewsCategory(
  body: NewsCategoryCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsCategory>>({
    baseUrl: 'NEWS',
    url: '/categories',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updateNewsCategory(
  id: EntityId,
  body: NewsCategoryCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsCategory>>({
    baseUrl: 'NEWS',
    url: `/categories/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function deleteNewsCategory(
  id: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsCategory>>({
    baseUrl: 'NEWS',
    url: `/categories/${id}`,
    method: 'DELETE',
    signal,
  });
}
