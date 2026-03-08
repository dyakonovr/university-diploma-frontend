import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type { NewsHashtag, NewsHashtagCreate } from '../models/news-hashtag.types';

export function getNewsHashtags(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<NewsHashtag[]>>({
    baseUrl: 'NEWS',
    url: '/hashtags',
    method: 'GET',
    params,
    signal,
  });
}

export function getNewsHashtag(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsHashtag>>({
    baseUrl: 'NEWS',
    url: `/hashtags/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function createNewsHashtag(
  body: NewsHashtagCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsHashtag>>({
    baseUrl: 'NEWS',
    url: '/hashtags',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updateNewsHashtag(
  id: EntityId,
  body: NewsHashtagCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsHashtag>>({
    baseUrl: 'NEWS',
    url: `/hashtags/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function deleteNewsHashtag(id: EntityId, signal: AbortSignal | null = null) {
  return request<Response<NewsHashtag>>({
    baseUrl: 'NEWS',
    url: `/hashtags/${id}`,
    method: 'DELETE',
    signal,
  });
}
