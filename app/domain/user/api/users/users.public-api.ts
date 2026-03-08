import type { PublicUser } from '~/domain/user/models/user.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getPublicUsers(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<PublicUser[]>>({
    baseUrl: 'AUTH',
    url: '/users',
    method: 'GET',
    params,
    signal,
  });
}

export function getPublicUser(id: string, signal: AbortSignal | null = null) {
  return request<Response<PublicUser>>({
    baseUrl: 'AUTH',
    url: `/users/${id}`,
    method: 'GET',
    signal,
  });
}