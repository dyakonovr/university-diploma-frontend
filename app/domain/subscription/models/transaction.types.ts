import type { EntityId } from '~/shared/types/core/base-entity.types';

/**
 * `subscription_initial` = Назначено с покупкой подписки
 *
 * `subscription_renewal` = Плановое пополнение
 *
 * `admin_grant` = Пополнение админом
 *
 * `step_usage` = Вычет за использование модели в шаге Flow (при генерации)
 */
export type TransactionType =
  | 'subscription_initial'
  | 'subscription_renewal'
  | 'admin_grant'
  | 'step_usage';

export type Transaction = {
  id: EntityId;
  amount: number;
  reason: TransactionType;
  /** Доступен при step_usage */
  post_id?: EntityId;
  created_at: string;
};
