import type { EntityId } from '~/shared/types/core/base-entity.types';

export const enum PaymentStatus {
  Pending = 'pending',
  Succeeded = 'succeeded',
  Canceled = 'canceled',
}

export const enum PaymentResultStatus {
  Loading = 'loading',
  Succeeded = 'succeeded',
  Canceled = 'canceled',
  Error = 'error',
}

export type Payment = {
  id: EntityId;
  external_id: string;
  user_id: EntityId;
  subscription_id: EntityId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  confirmation_url: string;
  created_at: string;
  updated_at: string;
};
