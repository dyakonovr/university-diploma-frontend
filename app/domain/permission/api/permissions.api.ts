import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';
import type { Permission } from '~/domain/permission/models/permission.types';

export function getPermissions(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Permission[]>>({
    baseUrl: 'AUTH',
    url: '/admin/permissions',
    method: 'GET',
    params,
    signal,
  });
}

export function getPermission(id: string, signal: AbortSignal | null = null) {
  return request<{ data: Permission }>({
    baseUrl: 'AUTH',
    url: `/admin/permissions/${id}`,
    method: 'GET',
    signal,
  });
}

export function createPermission(data: { code: string }) {
  return request<Permission>({
    baseUrl: 'AUTH',
    url: '/admin/permissions',
    method: 'POST',
    data,
  });
}

export function updatePermission(id: string, data: { code: string }) {
  return request<{ data: Permission }>({
    baseUrl: 'AUTH',
    url: `/admin/permissions/${id}`,
    method: 'PUT',
    data,
  });
}

export function deletePermission(id: string) {
  return request<Response<Permission>>({
    baseUrl: 'AUTH',
    url: `/admin/permissions/${id}`,
    method: 'DELETE',
  });
}
