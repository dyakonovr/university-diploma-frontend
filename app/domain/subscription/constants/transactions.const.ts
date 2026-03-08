import type { TransactionType } from '../models/subscription.types';

export const TRANSACTIONS_LABEL: Record<TransactionType, string> = {
  subscription_initial: 'Покупка подписки: первичное начисление',
  subscription_renewal: 'Плановое пополнение токенов подписки',
  admin_grant: 'Начисление администратором',
  step_usage: 'Использование модели при генерации Шаблона',
};
