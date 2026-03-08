import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type {
  SocialAccount,
  SocialAccountCreate,
} from '../models/social-account.types';

export function getSocialAccounts(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<SocialAccount[]>>({
    baseUrl: 'SOCIAL_ACCOUNT',
    url: '/social-accounts',
    method: 'GET',
    params,
    signal,
  });
}

/** Возвращает только аккаунт */
export function getSocialAccount(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<SocialAccount>>({
    baseUrl: 'SOCIAL_ACCOUNT',
    url: `/social-accounts/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

/** Возвращает аккаунт + credentials */
export function getSocialAccountCredentials(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<SocialAccount>>({
    baseUrl: 'SOCIAL_ACCOUNT',
    url: `/social-accounts/${id}/credentials`,
    method: 'GET',
    params,
    signal,
  });
}

export function createSocialAccount(
  body: SocialAccountCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<SocialAccount>>({
    baseUrl: 'SOCIAL_ACCOUNT',
    url: '/social-accounts',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updateSocialAccount(
  id: EntityId,
  body: SocialAccountCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<SocialAccount>>({
    baseUrl: 'SOCIAL_ACCOUNT',
    url: `/social-accounts/${id}`,
    method: 'PATCH',
    signal,
    data: body,
  });
}

export function deleteSocialAccount(
  id: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<SocialAccount>>({
    baseUrl: 'SOCIAL_ACCOUNT',
    url: `/social-accounts/${id}`,
    method: 'DELETE',
    signal,
  });
}
