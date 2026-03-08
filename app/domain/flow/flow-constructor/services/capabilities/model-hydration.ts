import { getModel } from '~/domain/model/api/models.api';
import type { Model } from '~/domain/model/models/model.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import { mapSettingDataToVM } from '../../mappers/setting-to-vm';
import type { FlowTreeItem } from '../../stores/constructor-store';

/**
 * Гидрация capabilities моделей для шагов, у которых `original_capabilities` не был
 * заполнен при маппинге (например, в публичных шаблонах, где `flow_data` — raw JSONB
 * без JOIN'ов).
 *
 * Собирает уникальные `model_id`, загружает их параллельно и
 * проставляет `model`, `original_capabilities` и `input_capabilities`.
 */
export async function hydrateModelCapabilities(tree: FlowTreeItem[]): Promise<void> {
  const modelIdsToFetch = new Set<EntityId>();

  for (const stage of tree) {
    for (const step of stage.steps) {
      const { model_id, original_capabilities } = step.setting;
      if (model_id && !original_capabilities) {
        modelIdsToFetch.add(model_id);
      }
    }
  }

  if (!modelIdsToFetch.size) return;

  const modelMap = new Map<EntityId, Model>();

  await Promise.all(
    Array.from(modelIdsToFetch).map(async (modelId) => {
      try {
        const response = await getModel(modelId);
        modelMap.set(modelId, response.data);
      } catch {
        // Не удалось получить модель — шаг останется без capabilities
      }
    }),
  );

  for (const stage of tree) {
    for (const step of stage.steps) {
      if (step.setting.original_capabilities) continue;

      const model = modelMap.get(step.setting.model_id);
      if (!model) continue;

      step.setting.model = model;
      step.setting.original_capabilities = model.capabilities.input_params ?? null;

      const { values } = mapSettingDataToVM(
        step.setting.data as Record<string, unknown>,
        model.capabilities.input_params ?? null,
      );
      step.setting.input_capabilities = values;
    }
  }
}
