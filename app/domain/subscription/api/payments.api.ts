import type {
  Payment,
  Subscription,
  SubscriptionAvailable,
} from '~/domain/subscription/models/subscription.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function createPayment(subscriptionId: EntityId) {
  return request<
    Response<{
      payment_id: string;
      confirmation_url: string;
      status: string;
    }>
  >({
    baseUrl: 'SUBSCRIPTION',
    url: '/me/payments',
    method: 'POST',
    data: { subscription_id: subscriptionId },
  });
}

export function getPaymentStatus(paymentId: EntityId) {
  return request<Response<Payment>>({
    baseUrl: 'SUBSCRIPTION',
    url: `/me/payments/${paymentId}`,
    method: 'GET',
  });
}

export function getAvailableSubscriptions() {
  return request<Response<SubscriptionAvailable[]>>({
    baseUrl: 'SUBSCRIPTION',
    url: '/subscriptions/available',
    method: 'GET',
  });
}
