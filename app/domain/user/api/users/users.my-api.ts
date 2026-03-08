import type { Response } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function requestEmailChange(body: { new_email: string; }) {
  return request({
    baseUrl: 'AUTH',
    url: '/me/change-email',
    method: 'POST',
    data: body,
  });
}

export function verifyEmailChange(body: { new_email: string; code: string; }) {
  return request({
    baseUrl: 'AUTH',
    url: '/me/verify-email-change',
    method: 'POST',
    data: body,
  });
}

export function updateUsername(username: string) {
  return request<Response<{ message: string; }>>({
    baseUrl: 'AUTH',
    url: '/me/username',
    method: 'PUT',
    data: { username },
  });
}
