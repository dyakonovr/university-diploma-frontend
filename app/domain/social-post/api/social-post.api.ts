import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type { SocialPost } from '../models/social-post.types';
import type { SocialPostData } from '../models/social-post-preview.types';
import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';

export function getSocialPostPreviewRequest(
  body: { post_id: EntityId; social_network_type: SocialAccountProviderName },
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<SocialPostData>>({
    baseUrl: 'SOCIAL_POST',
    url: '/preview',
    method: 'POST',
    params,
    data: body,
    signal,
  });
}

export function publishSocialPostRequest(
  body: { post_id: EntityId; account_id: EntityId; post_time: string },
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<SocialPost>>({
    baseUrl: 'SOCIAL_POST',
    url: '/posts',
    method: 'POST',
    params,
    data: body,
    signal,
  });
}

/** Множественный постинг (в несколько аккаунтов) */
export function bulkPublishSocialPostRequest(
  body: { post_id: EntityId; accounts_id: EntityId[]; post_time: string },
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<SocialPost>>({
    baseUrl: 'SOCIAL_POST',
    url: '/posts/bulk',
    method: 'POST',
    params,
    data: body,
    signal,
  });
}

export function getSocialPostsRequest(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<SocialPost[]>>({
    baseUrl: 'SOCIAL_POST',
    url: '/posts',
    method: 'GET',
    params,
    signal,
  });
}

export function getSocialPostRequest(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<SocialPost>>({
    baseUrl: 'SOCIAL_POST',
    url: `/posts/${id}`,
    method: 'GET',
    params,
    signal,
  });
}
