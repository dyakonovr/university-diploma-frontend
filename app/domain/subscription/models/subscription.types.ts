import type { EntityId } from '~/shared/types/core/base-entity.types';

export type Subscription = {
  id: EntityId;
  name: string;
  /** Цена в микроцентах (10^-6) */
  price: number;
  tokens_amount: number;
  /** Интервал начисления токенов (в часах) */
  tokens_interval: number;
  created_at: string;
};

export type SubscriptionAvailable = Subscription & {
  permission_ids: string[];
};

export type SubscriptionUser = {
  id: EntityId;
  user_id: EntityId;
  subscription_id: EntityId;
  expires_at: string;
  last_tokens_given_at: string;
  created_at: string;
};

export type SubscriptionUserWithDetails = SubscriptionUser & {
  subscription_name: string;
  price: number;
  tokens_amount: number;
  tokens_interval: number;
};

export type SubscriptionPermission = {
  id: EntityId;
  subscription_id: string;
  permission_id: string;
  permission_code: string;
  created_at: string;
};

// TODO: убрать отсюда экспорты
export {
  type Payment,
  PaymentResultStatus,
  PaymentStatus,
} from './payment.types';
export type { Transaction, TransactionType } from './transaction.types';
