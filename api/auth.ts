import type { LoginData, Tokens } from '~/types/auth.types';
import type { User } from '~/types/user.types';
import { useAPIFetch, apiFetch } from '~/composables/useAPIFetch';

export function login(data: LoginData) {
  return useAPIFetch<{ user: User; tokens: Tokens }>('/auth/login', {
    method: 'post',
    body: data,
    watch: false,
  }, false);
}

export function refreshTokens() {
  return apiFetch<Tokens>('/auth/refresh-token', {
    method: 'post',
    body: { token: useCookie('refresh-token').value },
  });
}

export function getUserInfo() {
  return useAPIFetch<User>('/auth/me', {
    method: 'get',
    watch: false,
  });
}