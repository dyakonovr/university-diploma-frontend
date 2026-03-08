import type { ModelCapabilityInputParam } from '~/domain/model/models/model.types';

import type { InputCapabilityValue } from '../../view-models/input-capability-values';

/** Результат маппинга одного параметра */
export type MapSuccess<T extends InputCapabilityValue = InputCapabilityValue> = {
  success: true;
  value: T;
};

export type MapFailure<T extends InputCapabilityValue = InputCapabilityValue> = {
  success: false;
  error: string;
  fallbackValue: T | null;
};

export type MapResult<T extends InputCapabilityValue = InputCapabilityValue> =
  | MapSuccess<T>
  | MapFailure<T>;

/** Ошибка маппинга для конкретного параметра */
export type MappingError = {
  key: string;
  message: string;
};

/**
 * Маппер для одного типа input capability.
 *
 * Все методы работают с базовым `InputCapabilityValue`,
 * конкретные реализации сужают тип внутри через type guards.
 */
export type InputParamMapper = {
  /** domain setting.data[key] → VM InputCapabilityValue */
  toViewModel: (rawValue: unknown, paramInfo: ModelCapabilityInputParam) => MapResult;
  /** VM InputCapabilityValue → domain setting.data[key] */
  toDomain: (value: InputCapabilityValue) => unknown;
  /** Проверка совместимости текущего VM value с новым paramInfo */
  isCompatible: (currentValue: InputCapabilityValue, newParamInfo: ModelCapabilityInputParam) => boolean;
  /** Создание default value для нового параметра */
  createDefault: (paramInfo: ModelCapabilityInputParam) => InputCapabilityValue;
};
