import { API_BASES, API_PREFIX } from '~/shared/utils/core/request.client';

type SSRRequestOptions = {
  url: string;
  params?: string;
};

/**
 * SSR-compatible fetch wrapper for public NEWS API endpoints.
 * Uses plain $fetch without auth, toasts, or Pinia.
 *
 * @example
 * const data = await ssrRequest<ResponseWithPagination<News[]>>({ url: '/news', params: queryString });
 */
export async function ssrRequest<T>(options: SSRRequestOptions): Promise<T> {
  const { url, params } = options;

  let fullUrl = API_BASES.NEWS + API_PREFIX + url;
  if (params) {
    fullUrl += `?${params}`;
  }

  return $fetch<T>(fullUrl, { method: 'GET' });
}
