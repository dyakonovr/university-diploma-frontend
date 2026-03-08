import type { ModelCapabilitiesInputParams } from '~/domain/model/models/model.types';
import { generateUuid } from '~/shared/utils/generateUuid';

import type { Setting } from '../../model/setting.types';
import type { SettingViewModel, SettingViewModelInputCapabilities } from '../view-models/setting.view-model';
import { mapSettingDataToVM, mapSettingVMToDomain } from './setting-to-vm';

/**
 * (Domain) setting.data → (VM) setting.input_capabilities.
 * Делегирует в per-type mapper registry.
 */
export const mapSettingDataToViewModelInputCapabilities = (
  setting: Setting,
  original_capabilities: ModelCapabilitiesInputParams | null,
): SettingViewModelInputCapabilities => {
  const { values } = mapSettingDataToVM(
    setting.data as Record<string, unknown>,
    original_capabilities,
  );
  return values;
};

export const mapSettingToVM = (setting: Setting): SettingViewModel => ({
  ...setting,
  input_capabilities: mapSettingDataToViewModelInputCapabilities(
    setting,
    setting.model?.capabilities.input_params ?? null,
  ),
  original_capabilities: setting.model?.capabilities.input_params ?? null,
  ui: { is_new: false, is_dirty: false, uuid: generateUuid() },
});

export const mapSettingToDomain = (
  setting: Omit<SettingViewModel, 'ui'>,
): Setting => ({
  id: setting.id,
  model_id: setting.model_id,
  provider_id: setting.provider_id,
  step_id: setting.step_id,
  data: mapSettingViewModelInputCapabilitiesToDomainData(setting),
});

/**
 * (VM) setting.input_capabilities → (Domain) setting.data.
 * Делегирует в per-type mapper registry.
 */
export const mapSettingViewModelInputCapabilitiesToDomainData = (
  setting: Omit<SettingViewModel, 'ui'>,
): Setting['data'] => {
  return mapSettingVMToDomain(
    setting.input_capabilities,
    setting.original_capabilities,
  ) as Setting['data'];
};
