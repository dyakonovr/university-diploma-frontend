import type { ModelCapabilityInputParam } from '~/domain/model/models/model.types';

import type {
  BinaryInputCapabilityValue,
  InputCapabilityType,
  InputCapabilityValue,
} from '../../view-models/input-capability-values';
import type { InputParamMapper, MapResult } from './types';

/**
 * Фабрика для создания маппера бинарного типа (Photo/Video/Audio).
 * Все бинарные типы имеют одинаковую логику: value — строка (ссылка на артефакт/переменная) или null.
 */
const createBinaryMapper = (
  typeName: InputCapabilityType,
): InputParamMapper => ({
  toViewModel(rawValue: unknown): MapResult {
    if (rawValue === undefined || rawValue === null) {
      return {
        success: true,
        value: { type: typeName, value: null } as BinaryInputCapabilityValue,
      };
    }

    if (typeof rawValue !== 'string') {
      return {
        success: false,
        error: `Expected string for ${typeName} param, got ${typeof rawValue}`,
        fallbackValue: { type: typeName, value: null } as BinaryInputCapabilityValue,
      };
    }

    return {
      success: true,
      value: { type: typeName, value: rawValue } as BinaryInputCapabilityValue,
    };
  },

  toDomain(value: InputCapabilityValue): unknown {
    return (value as BinaryInputCapabilityValue).value;
  },

  isCompatible(currentValue): boolean {
    return currentValue.type === typeName;
  },

  createDefault(_paramInfo: ModelCapabilityInputParam): BinaryInputCapabilityValue {
    return { type: typeName, value: null } as BinaryInputCapabilityValue;
  },
});

export const photoMapper = createBinaryMapper('Photo');
export const videoMapper = createBinaryMapper('Video');
export const audioMapper = createBinaryMapper('Audio');
