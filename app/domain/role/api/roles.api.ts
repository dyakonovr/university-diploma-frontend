import type { Permission } from '~/domain/permission/models/permission.types';
import type { QueryParams, Response, ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type { Role } from '../models/role.types';

export function getRoles(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Role[]>>({
    baseUrl: 'AUTH',
    url: '/admin/roles',
    method: 'GET',
    params,
    signal,
  });
}

export function getRole(id: string, signal: AbortSignal | null = null) {
  return request<Response<Role>>({
    baseUrl: 'AUTH',
    url: `/admin/roles/${id}`,
    method: 'GET',
    signal,
  });
}

export function createRole(data: { name: string }) {
  return request<Role>({
    baseUrl: 'AUTH',
    url: '/admin/roles',
    method: 'POST',
    data,
  });
}

export function updateRole(id: string, data: { name: string }) {
  return request<Response<Role>>({
    baseUrl: 'AUTH',
    url: `/admin/roles/${id}`,
    method: 'PUT',
    data,
  });
}

export function deleteRole(id: string) {
  return request<Response<Role>>({
    baseUrl: 'AUTH',
    url: `/admin/roles/${id}`,
    method: 'DELETE',
  });
}

export function getRolePermissions(
  roleId: string,
  signal: AbortSignal | null = null,
) {
  return request<Response<Permission[]>>({
    baseUrl: 'AUTH',
    url: `/admin/roles/${roleId}/permissions`,
    method: 'GET',
    signal,
  });
}

export function assignPermissionToRole(data: {
  role_id: string;
  permission_id: string;
}) {
  return request<Response<unknown>>({
    baseUrl: 'AUTH',
    url: '/admin/roles/permissions',
    method: 'POST',
    data,
  });
}

export function removePermissionFromRole(data: {
  role_id: string;
  permission_id: string;
}) {
  return request<Response<unknown>>({
    baseUrl: 'AUTH',
    url: '/admin/roles/permissions',
    method: 'DELETE',
    data,
  });
}
