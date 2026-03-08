import type { QueryParams, Response,ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type { User, UserCreate } from '../../models/user.types';


export function getUsers(
  params?: QueryParams,
  signal: AbortSignal | null = null
) {
  return request<ResponseWithPagination<User[]>>({
    baseUrl: 'AUTH',
    url: '/admin/users',
    method: 'GET',
    params,
    signal,
  });
}

export function getUser(id: string, signal: AbortSignal | null = null) {
  return request<Response<User>>({
    baseUrl: 'AUTH',
    url: `/admin/users/${id}`,
    method: 'GET',
    signal,
  });
}

export function createUser(data: UserCreate) {
  return request<Response<User>>({
    baseUrl: 'AUTH',
    url: '/admin/users',
    method: 'POST',
    data,
  });
}

export function updateUser(
  id: string,
  data: Partial<UserCreate>
) {
  if (!data.password) delete data.password;
  if (!data.telegram_id) delete data.telegram_id;

  return request<Response<User>>({
    baseUrl: 'AUTH',
    url: `/admin/users/${id}`,
    method: 'PUT',
    data,
  });
}

export function deleteUser(id: string) {
  return request<Response<User>>({
    baseUrl: 'AUTH',
    url: `/admin/users/${id}`,
    method: 'DELETE',
  });
}

export function getUserRoles(userId: string) {
  return request<Response<any[]>>({
    baseUrl: 'AUTH',
    url: `/admin/users/${userId}/roles`,
    method: 'GET',
  });
}

export function assignRoleToUser(userId: string, roleId: string) {
  return request<Response<any>>({
    baseUrl: 'AUTH',
    url: '/admin/users/roles',
    method: 'POST',
    data: {
      user_id: userId,
      role_id: roleId,
    },
  });
}

export function removeRoleFromUser(userId: string, roleId: string) {
  return request<Response<any>>({
    baseUrl: 'AUTH',
    url: '/admin/users/roles',
    method: 'DELETE',
    data: {
      user_id: userId,
      role_id: roleId,
    },
  });
}
