import type { SubscriptionUser, SubscriptionUserWithDetails } from '~/domain/subscription/models/subscription.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getUserSubscriptions(userId: EntityId) {
  return request<Response<SubscriptionUserWithDetails[]>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/users/${userId}/subscriptions`,
    method: 'GET',
  });
}

export function assignSubscriptionToUser(data: {
  user_id: EntityId;
  subscription_id: EntityId;
  expires_at: string;
}) {
  return request<Response<SubscriptionUser>>({
    baseUrl: 'SUBSCRIPTION',
    url: '/subscription-users',
    method: 'POST',
    data,
  });
}

export function removeSubscriptionFromUser(id: EntityId) {
  return request<Response<SubscriptionUser>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/subscription-users/${id}`,
    method: 'DELETE',
  });
}