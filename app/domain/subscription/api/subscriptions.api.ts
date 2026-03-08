import type {
  Subscription,
  SubscriptionPermission,
} from '~/domain/subscription/models/subscription.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getSubscriptions(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Subscription[]>>({
    baseUrl: 'SUBSCRIPTION',
    url: '/subscriptions',
    method: 'GET',
    params,
    signal,
  });
}

export function getSubscription(id: EntityId, signal: AbortSignal | null = null) {
  return request<Response<Subscription>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/subscriptions/${id}`,
    method: 'GET',
    signal,
  });
}

export function createSubscription(data: {
  name: string;
  price: number;
  tokens_amount: number;
  tokens_interval: number;
}) {
  return request<Response<Subscription>>({
    baseUrl: 'SUBSCRIPTION',
    url: '/subscriptions',
    method: 'POST',
    data,
  });
}

export function updateSubscription(
  id: EntityId,
  data: {
    name: string;
    price: number;
    tokens_amount: number;
    tokens_interval: number;
  },
) {
  return request<Response<Subscription>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/subscriptions/${id}`,
    method: 'PUT',
    data,
  });
}

export function deleteSubscription(id: EntityId) {
  return request<Response<Subscription>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/subscriptions/${id}`,
    method: 'DELETE',
  });
}

// Subscription Permissions
export function getSubscriptionPermissions(subscriptionId: EntityId) {
  return request<Response<SubscriptionPermission[]>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/subscriptions/${subscriptionId}/permissions`,
    method: 'GET',
  });
}

export function bindPermission(subscriptionId: string, permissionId: string) {
  return request<Response<SubscriptionPermission>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/subscriptions/${subscriptionId}/permissions`,
    method: 'POST',
    data: {
      permission_id: permissionId,
    },
  });
}

export function unbindPermission(subscriptionId: string, permissionId: string) {
  return request<Response<SubscriptionPermission>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/subscriptions/${subscriptionId}/permissions/${permissionId}`,
    method: 'DELETE',
  });
}
