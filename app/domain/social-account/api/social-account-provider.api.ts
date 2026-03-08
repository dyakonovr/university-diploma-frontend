import type {
  QueryParams,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type { SocialAccountProvider } from '../models/social-account-provider';

export function getSocialAccountProvidersApi(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<SocialAccountProvider[]>>({
    baseUrl: 'SOCIAL_ACCOUNT',
    url: '/providers',
    method: 'GET',
    params,
    signal,
  });
}
