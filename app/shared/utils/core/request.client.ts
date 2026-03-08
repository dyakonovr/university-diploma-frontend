import { navigateTo } from '#app';
import { refreshTokens } from '~/domain/user/api/auth.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { RequestError } from '~/shared/errors/request.errors';
import useRequestStore from '~/shared/stores/requests-queue';
import type {
  JsonSerializable,
  QueryParams,
} from '~/shared/types/core/request.types';

export const API_PREFIX = '/api/v1';

export const API_BASES = {
  MAIN: import.meta.env.VITE_APP_MAIN_API_URL,
  // MODEL_PROVIDER: import.meta.env.VITE_APP_MODEL_PROVIDER_API_URL,
  // FLOW: import.meta.env.VITE_APP_FLOW_API_URL,
  // SUBSCRIPTION: import.meta.env.VITE_APP_SUBSCRIPTION_API_URL,
  // NEWS: import.meta.env.VITE_APP_NEWS_API_URL,
  // SOCIAL_ACCOUNT: import.meta.env.VITE_APP_SOCIAL_ACCOUNT_API_URL,
  // SOCIAL_POST: import.meta.env.VITE_APP_SOCIAL_POST_API_URL,
} as const;

type RequestOptions = {
  baseUrl: keyof typeof API_BASES;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: QueryParams;
  data?: JsonSerializable | FormData;
  contentType?: string;
  signal?: AbortSignal | null;
  authOnly?: boolean;
};

export const request = async <T>(
  options: RequestOptions,
  retryOn401 = true,
): Promise<T> => {
  const { toastError } = useCustomToast();
  const requestStore = useRequestStore();

  const {
    baseUrl,
    url,
    method,
    params,
    data,
    signal,
    contentType = 'application/json',
  } = options;

  if (signal?.aborted) {
    throw new DOMException('aborted', 'AbortError');
  }

  let fullUrl = API_BASES[baseUrl] + API_PREFIX + url;
  if (params && method === 'GET') {
    fullUrl += `?${params}`;
  }

  const headers: HeadersInit = {};

  // const accessToken = getCookie('access-token');
  // if (accessToken) {
  //   headers.Authorization = `Bearer ${accessToken}`;
  // } else if (authOnly) {
  //   // нет access → ждём refresh
  //   return requestStore.enqueue(() => request<T>(options, false), signal);
  // }

  if (!(data instanceof FormData)) {
    headers['Content-Type'] = contentType;
  }

  let response;
  try {
    response = await $fetch.raw(fullUrl, {
      method,
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
      signal,
      credentials: 'include',
    });
  } catch (error: any) {
    response = error.response;
    if (!response) throw error;
  }

  if (response.status === 401 && retryOn401) {
    if (requestStore.isRefreshing) {
      return requestStore.enqueue(() => request<T>(options, false), signal);
    }

    requestStore.startRefreshing();

    try {
      await refreshTokens();
      await requestStore.processQueueSuccess();
      return request<T>(options, false);
    } catch (e) {
      requestStore.processQueueFailure(e);
      toastError('Сессия истекла');
      await navigateTo('/auth/login');
      throw e;
    }
  }

  if (
    `${response.status}`.startsWith('4') ||
    `${response.status}`.startsWith('5')
  ) {
    const errorMessage = response._data?.error || response._data?.message || 'Ошибка запроса';
    throw new RequestError(
      response.status,
      errorMessage,
      response._data?.errors ?? {},
      response._data?.meta ?? {},
    );
  }

  return response._data as T;
};

export default request;
