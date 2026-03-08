import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';

import { createSetting, updateSetting } from '../api/settings.api';
import type { Setting, SettingCreate } from '../model/setting.types';

/** Создаёт или сохраняет изменения Setting */
export async function saveSetting(
  id: EntityId | null,
  Setting: SettingCreate,
): Promise<Response<Setting>> {
  return id !== null
    ? await updateSetting(id, Setting)
    : await createSetting(Setting);
}
