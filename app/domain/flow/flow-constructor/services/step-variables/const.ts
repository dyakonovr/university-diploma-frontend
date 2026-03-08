/** Правила парсинга переменных из промпта */
export const PROMPT_VARIABLE_RULES = {
  /** Предыдущий шаг: ${previous_step_<paramName>[N]} */
  PREVIOUS_STEP: /\$\{previous_step_([a-zA-Z_]+)\[(\d+)\]\}/g,

  /** Выход этапа: ${stage_<groupId|stageIndex>_artifact_<paramName>[N]}. GroupID используется в Private Flow, StageIndex - в Public */
  STAGE_OUTPUT: /\$\{stage_([^_]+)_artifact_([a-zA-Z_]+)\[(\d+)\]\}/g,

  /** Глобальный артефакт: ${artifact_<id>} */
  GLOBAL_ARTIFACT: /\$\{artifact_([a-zA-Z0-9-]+)\}/g,
} as const;
