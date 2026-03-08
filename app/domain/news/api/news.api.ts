import type { News, NewsCreate } from '~/domain/news/models/news.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getNewsList(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<News[]>>({
    baseUrl: 'NEWS',
    url: '/news',
    method: 'GET',
    params,
    signal,
  });
}

export function getNewsById(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<News>>({
    baseUrl: 'NEWS',
    url: `/news/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function getNewsByUrl(url: string, signal: AbortSignal | null = null) {
  return request<Response<News>>({
    baseUrl: 'NEWS',
    url: `/news/url/${url}`,
    method: 'GET',
    signal,
  });
}

export function createNews(
  body: NewsCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<News>>({
    baseUrl: 'NEWS',
    url: '/news',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updateNews(
  id: EntityId,
  body: NewsCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<News>>({
    baseUrl: 'NEWS',
    url: `/news/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function deleteNews(id: EntityId, signal: AbortSignal | null = null) {
  return request<Response<News>>({
    baseUrl: 'NEWS',
    url: `/news/${id}`,
    method: 'DELETE',
    signal,
  });
}

export function updateImage(
  body: FormData,
  signal: AbortSignal | null = null,
) {
  return request<Response<{ key: string; url: string; }>>({
    baseUrl: 'NEWS',
    url: '/images/upload',
    method: 'POST',
    signal,
    data: body,
  });
}