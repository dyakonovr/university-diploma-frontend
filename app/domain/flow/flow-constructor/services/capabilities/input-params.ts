import type {
  Model,
  ModelCapabilitiesInputParams,
} from '~/domain/model/models/model.types';

import { mapperRegistry, type MappingError, mapSettingDataToVM } from '../../mappers/setting-to-vm';
import type { InputCapabilityValue } from '../../view-models/input-capability-values';
import type { SettingViewModelInputCapabilities } from '../../view-models/setting.view-model';
import type { StepViewModel } from '../../view-models/step.view-model';

/** Стратегия разрешения значений при смене модели */
export type CapabilityResolutionStrategy = 'use-saved-data' | 'use-defaults';

export type ResolveInputCapabilitiesResult = {
  values: SettingViewModelInputCapabilities;
  errors: MappingError[];
};

/**
 * Разрешает input capabilities при смене модели или первом монтировании.
 *
 * - `use-saved-data` (первый mount / edit): пытаемся сохранить текущие значения,
 *    если тип параметра совместим. Если нет — fallback на defaults.
 * - `use-defaults`: всегда создаёт чистые default значения.
 *
 * @example
 * // При смене модели
 * const { values } = resolveInputCapabilities(
 *   step.setting.input_capabilities,
 *   newModel.capabilities.input_params,
 *   'use-defaults',
 * );
 *
 * // При первом mount (edit mode)
 * const { values } = resolveInputCapabilities(
 *   step.setting.input_capabilities,
 *   model.capabilities.input_params,
 *   'use-saved-data',
 * );
 */
export function resolveInputCapabilities(
  currentValues: SettingViewModelInputCapabilities,
  newCapabilities: ModelCapabilitiesInputParams | null,
  strategy: CapabilityResolutionStrategy,
): ResolveInputCapabilitiesResult {
  if (!newCapabilities) return { values: {}, errors: [] };

  const result: SettingViewModelInputCapabilities = {};
  const errors: MappingError[] = [];

  for (const [key, paramInfo] of Object.entries(newCapabilities)) {
    const mapper = mapperRegistry[paramInfo.type];

    if (!mapper) {
      errors.push({ key, message: `Unknown param type: ${paramInfo.type}` });
      continue;
    }

    if (strategy === 'use-saved-data') {
      const existing: InputCapabilityValue | undefined = currentValues[key];

      if (existing && mapper.isCompatible(existing, paramInfo)) {
        result[key] = existing;
        continue;
      }
    }

    result[key] = mapper.createDefault(paramInfo);
  }

  return { values: result, errors };
}

/**
 * Обёртка для использования в `FlowFormStep.vue`.
 * Совместима с прежним API `getModelCapabilitiesForStep`.
 */
export const getModelCapabilitiesForStep = (
  step: StepViewModel,
  model: Model | null,
  isUsedSavedData: boolean = false,
): SettingViewModelInputCapabilities => {
  const strategy: CapabilityResolutionStrategy = isUsedSavedData
    ? 'use-saved-data'
    : 'use-defaults';

  // При use-saved-data с domain data (первый mount) — маппим из domain формата
  if (isUsedSavedData && step.setting.data && Object.keys(step.setting.data).length > 0) {
    const { values } = mapSettingDataToVM(
      step.setting.data as Record<string, unknown>,
      model?.capabilities.input_params ?? null,
    );
    return values;
  }

  const { values } = resolveInputCapabilities(
    step.setting.input_capabilities,
    model?.capabilities.input_params ?? null,
    strategy,
  );

  return values;
};
