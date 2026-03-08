import type { ModelCapabilitiesInputParams } from '~/domain/model/models/model.types';

import type { Setting } from '../../model/setting.types';
import type { FlowConstructorUiState } from './flow-constructor.view-models';
import type { InputCapabilityValue, MessageInputCapabilityValue } from './input-capability-values';

/**
 * @deprecated Используйте `MessageInputCapabilityValue` из `input-capability-values.ts`.
 * Оставлен для обратной совместимости на время миграции.
 */
export type SettingViewModelMessageInputCapability = MessageInputCapabilityValue;

/** Record<paramName, InputCapabilityValue> */
export type SettingViewModelInputCapabilities = Record<string, InputCapabilityValue>;

export type SettingViewModel = Setting & {
  /** Capabilities, которые приходят из модели */
  original_capabilities: ModelCapabilitiesInputParams | null;
  /** Capabilities, которые указывает пользователь */
  input_capabilities: SettingViewModelInputCapabilities;
  ui: FlowConstructorUiState;
};
