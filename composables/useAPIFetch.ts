import { useUserStore } from '~/stores/user';
import type { Tokens } from '~/types/auth.types';
import { useCookie, useRuntimeConfig, useFetch, type AsyncData } from '#app';
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from '~/constants/cookies';
import type { FetchError } from 'ofetch';
import useRequestStore from '~/stores/request';
import useSetTokents from './useSetTokents';

const PREFIX = '/api/v1';

export class CustomFetchError extends Error {
  errors: Record<string, string[]>;
  statusCode: number;

  constructor(message: string, errors: Record<string, string[]>, statusCode: number) {
    super(message);
    this.name = 'CustomFetchError';
    this.errors = errors;
    this.statusCode = statusCode;
  }
}

export const useAPIFetch = async <T = unknown>(
  path: string,
  options: Record<string, unknown> = {},
  retryOn401: boolean = true,
): Promise<AsyncData<T, FetchError<unknown> | null>> => {
  const runtimeConfig = useRuntimeConfig();

  const requestStore = useRequestStore();
  const { setTokens } = useSetTokents();

  options.baseURL = `${runtimeConfig.public.baseURL}${PREFIX}`;

  if (useCookie(COOKIE_ACCESS_TOKEN).value) {
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${useCookie(COOKIE_ACCESS_TOKEN).value}`,
    };
  }

  const response = await useFetch<T>(path, options);

  if (
    response.status.value === 'error' &&
    response.error.value?.statusCode === 401 &&
    retryOn401
  ) {
    try {
      if (!useCookie(COOKIE_REFRESH_TOKEN).value) throw new Error();

      if (requestStore.isRefreshing) {
        return new Promise((resolve, reject) => {
          requestStore.addToQueue({
            resolve: (value: unknown) => resolve(value as AsyncData<T, FetchError<unknown> | null>),
            reject,
            retry: () => useAPIFetch<T>(path, options),
          });
        });
      }

      requestStore.setRefreshing(true);

      const refreshResponse = await useFetch<Tokens>(
        `${options.baseURL}/auth/refresh-token`,
        {
          method: 'POST',
          body: {
            token: useCookie(COOKIE_REFRESH_TOKEN).value,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (refreshResponse.status.value === 'success' && refreshResponse.data.value) {
        setTokens(refreshResponse.data.value);        

        requestStore.processQueue();

        return useAPIFetch<T>(path, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${refreshResponse.data.value.accessToken}`,
          },
        });
      }

      throw new Error('Failed to refresh tokens');
    } catch {
      useCookie(COOKIE_ACCESS_TOKEN).value = null;
      useCookie(COOKIE_REFRESH_TOKEN).value = null;

      const userStore = useUserStore();
      userStore.user = null;

      throw new Error('Failed to refresh authorization token');
    } finally {
      requestStore.setRefreshing(false);
    }
  }

  if (response.status.value === 'error') {
    throw new CustomFetchError(
      response.error.value?.data.message,
      response.error.value?.data.errors,
      response.error.value?.statusCode ?? -1
    );
  }

  return response as AsyncData<T, FetchError<unknown> | null>;
};

export const apiFetch = <T>(path: string, options: Parameters<typeof $fetch>[1] = {} as Parameters<typeof $fetch>[1]) => {
  const runtimeConfig = useRuntimeConfig();
  const baseURL = `${runtimeConfig.public.baseURL}${PREFIX}`;

  options = {
    ...options,
    headers: {
      ...(options?.headers || {}),
      'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization'
    }
  };

  if (useCookie('access-token').value) {
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${useCookie('access-token').value}`,
    };
  }

  return $fetch<T>(`${baseURL}${path}`, options);
};
