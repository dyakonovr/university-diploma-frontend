import type {
  ModelCapabilitiesInputParams,
  ModelCapabilityInputParam,
} from '~/domain/model/models/model.types';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';

import type {
  InputCapabilityValue,
  MessageInputCapabilityValue,
  SettingInputCapabilityValue,
  TextInputCapabilityValue,
} from '../../view-models/input-capability-values';
import type { SettingViewModelInputCapabilities } from '../../view-models/setting.view-model';
import type { StageViewModel } from '../../view-models/stage.view-model';

// ─── Error Types ────────────────────────────────────────────────────────────

/** Ошибки валидации одной Message capability (system prompt + pairs) */
export type StepMessageInputCapabilitiesError = {
  systemPrompt: string | null;
  /** Record<message_idx, errors> */
  pairs: Record<number, {
    userContent: string | null;
    assistantContent?: string | null;
  }>;
};

/**
 * Ошибки input capabilities шага.
 * Для Setting/Text/Binary — строка с текстом ошибки.
 * Для Message — структурированный объект `StepMessageInputCapabilitiesError`.
 */
export type StepInputCapabilitiesErrors = Record<string, string | StepMessageInputCapabilitiesError>;

/** Ошибки валидации одного шага */
export type StepValidationErrors = {
  description?: string;
  setting?: {
    provider_id?: string;
    model_id?: string;
    input_capabilities?: StepInputCapabilitiesErrors;
  };
};

/** Ошибки валидации одного этапа (название + массив шагов) */
export type StageValidationErrors = {
  name?: string;
  is_context?: string;
  steps: StepValidationErrors[];
};

/** Ошибки валидации всего flow-дерева */
export type FlowValidationErrors = {
  stages: StageValidationErrors[];
};

// ─── Per-Type Capability Validators ─────────────────────────────────────────

/**
 * Валидирует Setting capability (числа, строки, булевы).
 * Проверяет диапазон (limit_down / limit_up) для int/float,
 * длину для string.
 *
 * @returns текст ошибки или `null`, если валидно
 */
function validateSettingCapability(
  value: SettingInputCapabilityValue,
  cap: ModelCapabilityInputParam,
): string | null {
  if (cap.variable_type === 'int' || cap.variable_type === 'float') {
    const num = Number(value.value);

    if (Number.isNaN(num)) return 'Некорректное число';
    if (cap.limit_down != null && num < cap.limit_down) return `Минимум: ${cap.limit_down}`;
    if (cap.limit_up != null && num > cap.limit_up) return `Максимум: ${cap.limit_up}`;
  }

  if (cap.variable_type === 'string') {
    const str = String(value.value);
    if (cap.limit_up && str.length > cap.limit_up) return `Максимум ${cap.limit_up} символов`;
  }

  return null;
}

/**
 * Валидирует Text capability.
 * Проверяет длину текста (limit_up).
 *
 * @returns текст ошибки или `null`, если валидно
 */
function validateTextCapability(
  value: TextInputCapabilityValue,
  cap: ModelCapabilityInputParam,
): string | null {
  if (cap.limit_up && typeof value.value === 'string' && value.value.length > cap.limit_up) {
    return `Максимум ${cap.limit_up} символов`;
  }
  return null;
}

/**
 * Валидирует Message capability (system prompt + user/assistant pairs).
 *
 * Правила:
 * - `systemPrompt === undefined` → поле отсутствует, не валидируем
 * - `systemPrompt === null` → поле есть, но пустое → ошибка
 * - Каждая pair.userContent обязательна
 * - `assistantContent === undefined` → поле отсутствует, не валидируем
 * - `assistantContent === null` → поле есть, но пустое → ошибка
 *
 * @returns `{ valid, error }` — structured error object для всех pairs
 */
function validateMessageCapability(
  value: MessageInputCapabilityValue,
): { valid: boolean; error: StepMessageInputCapabilitiesError } {
  let valid = true;

  const error: StepMessageInputCapabilitiesError = {
    systemPrompt: null,
    pairs: {},
  };

  if (value.systemPrompt === null) {
    error.systemPrompt = ERROR_REQUIRED_FIELD;
    valid = false;
  }

  for (let pairIdx = 0; pairIdx < value.pairs.length; pairIdx++) {
    const pair = value.pairs[pairIdx];
    const pairError: StepMessageInputCapabilitiesError['pairs'][number] = {
      userContent: null,
    };

    if (!pair?.userContent) {
      pairError.userContent = ERROR_REQUIRED_FIELD;
      valid = false;
    }

    if (pair?.assistantContent === null) {
      pairError.assistantContent = ERROR_REQUIRED_FIELD;
      valid = false;
    }

    error.pairs[pairIdx] = pairError;
  }

  return { valid, error };
}

/**
 * Валидирует одну capability по типу, делегируя в per-type валидатор.
 *
 * @returns `{ valid, error }` — error может быть string или structured object
 */
function validateSingleCapability(
  capValue: InputCapabilityValue,
  cap: ModelCapabilityInputParam,
): { valid: boolean; error: string | StepMessageInputCapabilitiesError | null } {
  switch (capValue.type) {
    case 'Message':
      return validateMessageCapability(capValue);
    case 'Setting': {
      const err = validateSettingCapability(capValue, cap);
      return { valid: err === null, error: err };
    }
    case 'Text': {
      const err = validateTextCapability(capValue, cap);
      return { valid: err === null, error: err };
    }
    case 'Photo':
    case 'Video':
    case 'Audio':
      return { valid: true, error: null };
  }
}

// ─── Composite Validators ───────────────────────────────────────────────────

/**
 * Валидирует все input capabilities шага.
 *
 * Обходит `original` capabilities (из модели), для каждого проверяет наличие
 * значения в `values` (из VM), обязательность и type-specific правила.
 *
 * @param original - capabilities из модели (определяют какие параметры ожидаются)
 * @param values - текущие значения пользователя (VM)
 * @returns `{ valid, errors }` — errors содержит ошибки по имени параметра
 *
 * @example
 * const { valid, errors } = validateCapabilities(
 *   step.setting.original_capabilities,
 *   step.setting.input_capabilities,
 * );
 */
export function validateCapabilities(
  original: ModelCapabilitiesInputParams,
  values: SettingViewModelInputCapabilities,
): { valid: boolean; errors: StepInputCapabilitiesErrors } {
  const errors: StepInputCapabilitiesErrors = {};
  let valid = true;

  for (const [name, cap] of Object.entries(original)) {
    const capValue = values[name];

    // Пустое значение — ошибка только для обязательных
    if (!capValue || (capValue.type !== 'Message' && capValue.value == null)) {
      if (!cap.is_optional) {
        errors[name] = ERROR_REQUIRED_FIELD;
        valid = false;
      }
      continue;
    }

    const result = validateSingleCapability(capValue, cap);

    if (!result.valid && result.error !== null) {
      errors[name] = result.error;
      valid = false;
    } else if (capValue.type === 'Message' && result.error !== null) {
      // Message всегда пишет structured error (даже если valid)
      errors[name] = result.error;
    }
  }

  return { valid, errors };
}

/**
 * Валидирует один шаг: обязательные поля (provider, model) и input capabilities.
 *
 * @param step - шаг из VM-дерева
 * @returns `{ valid, errors }`
 *
 * @example
 * const { valid, errors } = validateStep(stage.steps[0]);
 */
export function validateStep(step: StageViewModel['steps'][number]): {
  valid: boolean;
  errors: StepValidationErrors;
} {
  const errors: StepValidationErrors = { setting: {} };
  let valid = true;

  if (!step.setting.provider_id) {
    errors.setting!.provider_id = ERROR_REQUIRED_FIELD;
    valid = false;
  }

  if (!step.setting.model_id) {
    errors.setting!.model_id = ERROR_REQUIRED_FIELD;
    valid = false;
  }

  const caps = validateCapabilities(
    step.setting.original_capabilities ?? {},
    step.setting.input_capabilities,
  );

  if (!caps.valid) {
    errors.setting!.input_capabilities = caps.errors;
    valid = false;
  }

  return { valid, errors };
}

/**
 * Валидирует один этап: название и все шаги.
 *
 * @param stage - этап из VM-дерева
 * @returns `{ valid, errors }`
 *
 * @example
 * const { valid, errors } = validateStage(store.tree[0]);
 */
export function validateStage(stage: StageViewModel): {
  valid: boolean;
  errors: StageValidationErrors;
} {
  const errors: StageValidationErrors = {
    name: '',
    steps: [],
  };

  let valid = true;

  if (!stage.name?.trim()) {
    errors.name = ERROR_REQUIRED_FIELD;
    valid = false;
  }

  stage.steps.forEach((step, idx) => {
    const res = validateStep(step);
    if (!res.valid) valid = false;
    errors.steps[idx] = res.errors;
  });

  return { valid, errors };
}

/**
 * Валидирует всё flow-дерево: все этапы и их шаги.
 *
 * @param tree - массив StageViewModel (flow-дерево)
 * @returns `{ valid, errors }` — errors содержит ошибки по индексу этапа
 *
 * @example
 * const { valid, errors } = validateFlowTree(store.tree);
 * if (!valid) store.validationErrors = errors;
 */
export function validateFlowTree(tree: StageViewModel[]): {
  valid: boolean;
  errors: FlowValidationErrors;
} {
  const errors: FlowValidationErrors = { stages: [] };
  let valid = true;

  tree.forEach((stage, idx) => {
    const res = validateStage(stage);
    if (!res.valid) valid = false;
    errors.stages[idx] = res.errors;
  });

  return { valid, errors };
}
