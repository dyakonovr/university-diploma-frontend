import type { ModelCapabilitiesInputParams } from '~/domain/model/models/model.types';

import type { InputCapabilityType } from '../../view-models/input-capability-values';
import type { SettingViewModelInputCapabilities } from '../../view-models/setting.view-model';
import { audioMapper, photoMapper, videoMapper } from './mapBinaryValue';
import { messageMapper } from './mapMessageValue';
import { settingMapper } from './mapSettingValue';
import { textMapper } from './mapTextValue';
import type { InputParamMapper, MappingError } from './types';

/** Registry всех per-type маперов */
export const mapperRegistry: Record<InputCapabilityType, InputParamMapper> = {
  Setting: settingMapper,
  Text: textMapper,
  Message: messageMapper,
  Photo: photoMapper,
  Video: videoMapper,
  Audio: audioMapper,
};

export type MapSettingDataResult = {
  values: SettingViewModelInputCapabilities;
  errors: MappingError[];
};

/**
 * (Domain) setting.data → (VM) setting.input_capabilities
 *
 * Маппит каждый параметр через registry, собирает ошибки.
 * Неизвестные типы параметров пропускаются с ошибкой.
 *
 * @example
 * const { values, errors } = mapSettingDataToVM(setting.data, model.capabilities.input_params);
 * if (errors.length) console.warn('Mapping errors:', errors);
 */
export function mapSettingDataToVM(
  data: Record<string, unknown> | null | undefined,
  capabilities: ModelCapabilitiesInputParams | null,
): MapSettingDataResult {
  const values: SettingViewModelInputCapabilities = {};
  const errors: MappingError[] = [];

  if (!capabilities) return { values, errors };

  for (const [key, paramInfo] of Object.entries(capabilities)) {
    const mapper = mapperRegistry[paramInfo.type];

    if (!mapper) {
      errors.push({ key, message: `Unknown param type: ${paramInfo.type}` });
      continue;
    }

    const rawValue = data?.[key];
    const result = mapper.toViewModel(rawValue, paramInfo);

    if (result.success) {
      values[key] = result.value;
    } else {
      errors.push({ key, message: result.error });
      if (result.fallbackValue) {
        values[key] = result.fallbackValue;
      }
    }
  }

  return { values, errors };
}

/**
 * (VM) setting.input_capabilities → (Domain) setting.data
 *
 * Обратный маппинг: для каждого параметра ищет маппер по типу из original_capabilities,
 * вызывает toDomain.
 *
 * @example
 * const data = mapSettingVMToDomain(setting.input_capabilities, setting.original_capabilities);
 */
export function mapSettingVMToDomain(
  inputCapabilities: SettingViewModelInputCapabilities,
  originalCapabilities: ModelCapabilitiesInputParams | null,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (!originalCapabilities) return result;

  for (const [key, value] of Object.entries(inputCapabilities)) {
    const paramInfo = originalCapabilities[key];
    if (!paramInfo || value === undefined) continue;

    const mapper = mapperRegistry[paramInfo.type];
    if (!mapper) continue;

    result[key] = mapper.toDomain(value);
  }

  return result;
}

export { type InputParamMapper, type MappingError } from './types';
