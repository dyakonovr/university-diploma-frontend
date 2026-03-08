import type { ModelCapabilityInputParam } from '~/domain/model/models/model.types';

import type { InputCapabilityValue, SettingInputCapabilityValue } from '../../view-models/input-capability-values';
import type { InputParamMapper, MapResult } from './types';

const isValueCompatibleWithVariableType = (
  value: unknown,
  variableType: ModelCapabilityInputParam['variable_type'],
): boolean => {
  if (value === null) return true;

  switch (variableType) {
    case 'int':
      return typeof value === 'number' && Number.isInteger(value);
    case 'float':
      return typeof value === 'number';
    case 'bool':
      return typeof value === 'boolean';
    case 'string':
      return typeof value === 'string';
    default:
      return false;
  }
};

export const settingMapper: InputParamMapper = {
  toViewModel(rawValue: unknown, paramInfo: ModelCapabilityInputParam): MapResult {
    if (rawValue === undefined || rawValue === null) {
      return {
        success: true,
        value: { type: 'Setting', value: null },
      };
    }

    if (!isValueCompatibleWithVariableType(rawValue, paramInfo.variable_type)) {
      return {
        success: false,
        error: `Incompatible value type for Setting param (expected ${paramInfo.variable_type}, got ${typeof rawValue})`,
        fallbackValue: { type: 'Setting', value: paramInfo.default as number | string | boolean | null ?? null },
      };
    }

    return {
      success: true,
      value: { type: 'Setting', value: rawValue as number | string | boolean | null },
    };
  },

  toDomain(value: InputCapabilityValue): unknown {
    return (value as SettingInputCapabilityValue).value;
  },

  isCompatible(currentValue, newParamInfo): boolean {
    if (currentValue.type !== 'Setting') return false;
    return isValueCompatibleWithVariableType(currentValue.value, newParamInfo.variable_type);
  },

  createDefault(paramInfo: ModelCapabilityInputParam): SettingInputCapabilityValue {
    if (
      paramInfo.default !== undefined &&
      paramInfo.default !== null &&
      isValueCompatibleWithVariableType(paramInfo.default, paramInfo.variable_type)
    ) {
      return { type: 'Setting', value: paramInfo.default };
    }
    return { type: 'Setting', value: null };
  },
};
