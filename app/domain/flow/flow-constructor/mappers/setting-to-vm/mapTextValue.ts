import type { ModelCapabilityInputParam } from '~/domain/model/models/model.types';

import type { InputCapabilityValue, TextInputCapabilityValue } from '../../view-models/input-capability-values';
import type { InputParamMapper, MapResult } from './types';

export const textMapper: InputParamMapper = {
  toViewModel(rawValue: unknown): MapResult {
    if (rawValue === undefined || rawValue === null) {
      return {
        success: true,
        value: { type: 'Text', value: null },
      };
    }

    if (typeof rawValue !== 'string') {
      return {
        success: false,
        error: `Expected string for Text param, got ${typeof rawValue}`,
        fallbackValue: { type: 'Text', value: null },
      };
    }

    return {
      success: true,
      value: { type: 'Text', value: rawValue },
    };
  },

  toDomain(value: InputCapabilityValue): unknown {
    return (value as TextInputCapabilityValue).value;
  },

  isCompatible(currentValue): boolean {
    return currentValue.type === 'Text';
  },

  createDefault(paramInfo: ModelCapabilityInputParam): TextInputCapabilityValue {
    if (typeof paramInfo.default === 'string') {
      return { type: 'Text', value: paramInfo.default };
    }
    return { type: 'Text', value: null };
  },
};
