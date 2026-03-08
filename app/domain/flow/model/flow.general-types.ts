import type { EntityId } from '~/shared/types/core/base-entity.types';

export type FlowNeededSubscription = {
  id: EntityId;
  name: string;
  price: number;
  /** Покрывает ли подписка все недостающие модели/провайдеры */
  covers_all: boolean;
};

export type FlowAccessData = {
  /** Необходимые подписки для генерации шаблона */
  needed_subscriptions?: FlowNeededSubscription[];
  /** Доступна ли генерации Flow (проверяется по подписке) */
  accessible: boolean;
};
