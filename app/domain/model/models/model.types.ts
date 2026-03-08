import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

type ModelBase = {
  /** Активна ли модель (не может быть активна, пока не сконфигурирована) */
  is_active: boolean;
  /** Название, которое будет выводиться для пользователей */
  display_name: string | null;
  /** Описание модели для пользователей */
  description: string | null;
};

export type ModelUpdate = ModelBase;

export type ModelCapabilityBinaryInputParamType = 'Photo' | 'Video' | 'Audio';
export type ModelCapabilityInputParamType =
  | 'Setting'
  | 'Text'
  | 'Message'
  | ModelCapabilityBinaryInputParamType;
export type MessageDefaultValueItem = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

export type ModelCapabilityInputParam = {
  limit_up: number;
  limit_down: number;
  /** Если type !== 'Setting', то variable_type всегда будет string */
  type: ModelCapabilityInputParamType;
  variable_type: 'int' | 'float' | 'string' | 'bool';
  is_optional: boolean;
  /** Дефолтное значение параметра */
  default: string | number | boolean | MessageDefaultValueItem[] | null;
  /** Название параметра */
  name?: string;
  /** Описание параметра */
  description?: string;
};

export type ModelCapabilitiesInputParams = Record<
  string,
  ModelCapabilityInputParam
>;

export type ModelPermissionInfo = {
  id: EntityId;
  code: string;
};

/** Список имён выходных параметров модели (например: ["text_output", "cover_image"]) */
export type ModelOutputParams = string[];

/** Стоимость в токенах для нетекстовых выходных параметров: имя → кол-во токенов */
export type ModelOutputParamCosts = Record<string, number>;

/** Тип артефакта выходного параметра: Text | Photo | Video | Audio */
export type ModelOutputParamTypes = Record<string, string>;

/** Ожидаемое количество артефактов для каждого выходного параметра: имя → кол-во */
export type ModelOutputParamCounts = Record<string, number>;

/** Модель для генерации */
export type Model = BaseEntity &
  ModelBase & {
    /** Системное название */
    name: string;
    provider_id: EntityId;
    provider_name?: string;
    /** Сконфигурирована ли модель (указано кол-во входных-выходных параметров и тд) */
    is_configured: boolean;
    /** Доступна ли модель для использования (исходя из подписки пользователя) */
    is_available?: boolean;
    /** Пермишны, привязанные к модели */
    permissions?: ModelPermissionInfo[];
    capabilities: {
      input_params: ModelCapabilitiesInputParams;
      /** Имена выходных параметров модели (например: ["text_output", "cover_image"]) */
      output_params: ModelOutputParams | null;
      /** Стоимость *нетекстовых* выходных параметров в токенах (имя → кол-во токенов) */
      output_param_costs: ModelOutputParamCosts | null;
      /** Тип каждого выходного параметра (имя → Text|Photo|Video|Audio) */
      output_param_types: ModelOutputParamTypes | null;
      /** Ожидаемое количество артефактов для каждого выходного параметра (имя → кол-во) */
      output_param_counts: ModelOutputParamCounts | null;
    };
    created_at: string;
  };
