import type { EntityId } from '~/shared/types/core/base-entity.types';
import { generateUuid } from '~/shared/utils/generateUuid';

import type { SettingViewModel } from '../view-models/setting.view-model';

export const createEmptySetting = (stepId: EntityId): SettingViewModel => ({
  id: '',
  step_id: stepId,
  model_id: '',
  provider_id: '',
  data: { prompt: '' },
  input_capabilities: {},
  original_capabilities: null,
  ui: { is_new: true, is_dirty: true, uuid: generateUuid() },
});
