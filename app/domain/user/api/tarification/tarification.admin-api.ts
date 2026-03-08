import type {
  SubscriptionUserWithDetails,
  Transaction,
} from '~/domain/subscription/models/subscription.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

/** For admin */
export function getUserTokenBalance(
  userId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<{ balance: number }>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/users/${userId}/balance`,
    method: 'GET',
    params,
    signal,
  });
}

/** For admin */
export function getUserSubscriptions(
  userId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<SubscriptionUserWithDetails[]>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/users/${userId}/subscriptions`,
    method: 'GET',
    params,
    signal,
  });
}

/** For admin */
export function getUserTransactions(
  userId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Transaction[]>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/users/${userId}/transactions`,
    method: 'GET',
    params,
    signal,
  });
}
