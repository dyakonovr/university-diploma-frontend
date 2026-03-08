/** Конфигурация конструктора Flow для разных контекстов (private/public/moderation) */
export type FlowConstructorConfig = {
  /** Запретить редактирование */
  readonly: boolean;
  /** Публичный шаблон (влияет на формат переменных stage_output) */
  isPublic: boolean;
  /** Нужна ли гидрация моделей (для raw JSONB flow_data без JOIN'ов) */
  needsHydration: boolean;
};

/** Приватный шаблон — полное редактирование, данные с JOIN'ами */
export const PRIVATE_FLOW_CONFIG: FlowConstructorConfig = {
  readonly: false,
  isPublic: false,
  needsHydration: false,
};

/** Публичный шаблон — readonly, raw JSONB */
export const PUBLIC_FLOW_CONFIG: FlowConstructorConfig = {
  readonly: true,
  isPublic: true,
  needsHydration: true,
};

/** Модерация — readonly, raw JSONB */
export const MODERATION_FLOW_CONFIG: FlowConstructorConfig = {
  readonly: true,
  isPublic: true,
  needsHydration: true,
};
