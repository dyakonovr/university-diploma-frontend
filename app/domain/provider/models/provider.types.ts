import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

type ProdivderBase = {
  default_model_id: EntityId | null;
  is_active: boolean;
  /** Тип вычисления */
  computing_type: string | null;
  /** Тип контента */
  content_type: string | null;
  /** Название, которое будет выводиться для пользователей */
  display_name: string | null;
  /** Описание провайдера для пользователей */
  description: string | null;
};

export type ProviderUpdate = ProdivderBase;

export type ProviderPermissionInfo = {
  id: EntityId;
  code: string;
};

/** Провайдер модели (например ChatGPT) */
export type Provider = BaseEntity & ProdivderBase & {
  /** Системное название провайдера */
  name: string;
  /** Сконфигурирован ли провайдер (указан тип вычисления, тип контента, дефолтная модель) */
  is_configured: boolean;
  /** Доступен ли провайдер для использования (исходя из подписки пользователя) */
  is_available?: boolean;
  default_model_name?: string | null;
  /** 'Image Generation', 'Text Generation' */
  category: string;
  /** Пермишны, привязанные к провайдеру */
  permissions?: ProviderPermissionInfo[];
  created_at: string;
};
