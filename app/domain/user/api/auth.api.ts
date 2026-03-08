import type { User } from '~/domain/user/models/user.types';
import {
  API_BASES,
  API_PREFIX,
  request,
} from '~/shared/utils/core/request.client';

export function refreshTokens() {
  return $fetch(`${API_BASES.MAIN}${API_PREFIX}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
}

export function getCurrentUser() {
  return request<{ data: User }>({
    baseUrl: 'MAIN',
    url: '/me',
    method: 'GET',
  });
}

export type LoginRequest = {
  email: string;
  password: string;
};

export function login(data: LoginRequest) {
  return request<{ message: string }>({
    baseUrl: 'MAIN',
    url: '/auth/login',
    method: 'POST',
    data,
  }, false);
}

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};

export function register(data: RegisterRequest) {
  return request<{ message: string }>({
    baseUrl: 'MAIN',
    url: '/auth/register',
    method: 'POST',
    data,
  });
}

// export type RegisterVerifyRequest = {
//   email: string;
//   code: string;
//   username: string;
// };

// export function registerVerifyEmail(data: RegisterVerifyRequest) {
//   return request<{ message: string }>({
//     baseUrl: 'AUTH',
//     url: '/auth/verify',
//     method: 'POST',
//     data,
//   });
// }

// export type ForgotPasswordRequest = {
//   email: string;
// };

// export function requestForgotPassword(data: ForgotPasswordRequest) {
//   return request<{ message: string }>({
//     baseUrl: 'AUTH',
//     url: '/auth/forgot-password',
//     method: 'POST',
//     data,
//   });
// }

// export type ResetPasswordRequest = {
//   email: string;
//   code: string;
//   new_password: string;
// };

// export function resetPassword(data: ResetPasswordRequest) {
//   return request<{ message: string }>({
//     baseUrl: 'AUTH',
//     url: '/auth/reset-password',
//     method: 'POST',
//     data,
//   });
// }
