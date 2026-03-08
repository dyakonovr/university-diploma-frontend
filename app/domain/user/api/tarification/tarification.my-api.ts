import type {
  SubscriptionUserWithDetails,
  Transaction,
} from '~/domain/subscription/models/subscription.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getMyTokenBalance(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<{ balance: number }>>({
    baseUrl: 'SUBSCRIPTION',
    url: '/me/balance',
    method: 'GET',
    params,
    signal,
  });
}

export function getMySubscriptions(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<SubscriptionUserWithDetails[]>>({
    baseUrl: 'SUBSCRIPTION',
    url: '/me/subscription',
    method: 'GET',
    params,
    signal,
  });
}

export function getMyTransactions(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Transaction[]>>({
    baseUrl: 'SUBSCRIPTION',
    url: '/me/transactions',
    method: 'GET',
    params,
    signal,
  });
}
