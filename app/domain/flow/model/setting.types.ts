import type { Model } from '~/domain/model/models/model.types';
import type { Provider } from '~/domain/provider/models/provider.types';
import type {
  BaseEntity,
  EntityId,
} from '~/shared/types/core/base-entity.types';

export type SettingMessageInputParamData = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

type SettingBase = {
  step_id: EntityId;
  provider_id: EntityId;
  provider?: Provider;
  model_id: EntityId;
  model?: Model;
  /** Dictionary-поле для хранения настроек модели и промпта. Пример:
   * ```
   * {
   *  "prompt": "Example prompt ${artifact_1}",
   *  "height": 512,
   *  "output_param_types": {"text_output": "Text", "cover_image": "Photo"}
   * }
   * ```
   */
  data: Record<string, number | string | boolean | SettingMessageInputParamData[] | Record<string, string> | null>;
};

export type SettingCreate = SettingBase;

/** Сущность предназначена для хранения ```Provider```, ```Model``` и его настроек у конкретного ```Step'а``` */
export type Setting = BaseEntity & SettingBase;
