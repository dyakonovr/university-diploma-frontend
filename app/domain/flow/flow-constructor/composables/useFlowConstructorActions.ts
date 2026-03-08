import { useCustomToast } from '~/shared/composables/useCustomToast';
import { RequestError } from '~/shared/errors/request.errors';
import type { BackendErrors } from '~/shared/types/core/backend-errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import type { Stage } from '../../model/stage.types';
import type { FlowConstructorConfig } from '../models/constructor-config';
import { hydrateModelCapabilities } from '../services/capabilities';
import {
  insertStage,
  insertStep,
  removeStage,
  removeStep,
  saveStageWithSteps,
  saveStepWithSetting,
  saveTreeStage,
  validateFlowTree,
  validateStage,
  validateStep,
} from '../services/tree';
import type { StageValidationErrors, StepValidationErrors } from '../services/tree/validation';
import useFlowConstructorStore from '../stores/constructor-store';
import type { StageViewModel } from '../view-models/stage.view-model';
import type { StepViewModel } from '../view-models/step.view-model';

/**
 * Composable для orchestration действий конструктора Flow.
 * Делегирует бизнес-логику в services, управляет state через store.
 *
 * @example
 * const actions = useFlowConstructorActions();
 * await actions.initConstructor(flowId, stages, PRIVATE_FLOW_CONFIG);
 * await actions.saveFlow();
 */
export function useFlowConstructorActions() {
  const store = useFlowConstructorStore();
  const { toastError } = useCustomToast();

  /**
   * Маппинг backend-ошибок 422 в store.validationErrors.
   *
   * Backend возвращает ошибки вида:
   * - `{ "name": [...] }` — ошибка этапа
   * - `{ "description": [...] }` — ошибка шага
   * - `{ "data.prompt": [...] }` — ошибка setting capability (prefix `data.`)
   *
   * @param errors - объект ошибок из RequestError
   * @param stageIdx - индекс этапа
   * @param stepIdx - индекс шага (если ошибка относится к шагу/setting)
   */
  function mapBackendErrorsToStore(
    errors: BackendErrors,
    stageIdx: number,
    stepIdx?: number,
  ) {
    if (!store.validationErrors.stages[stageIdx]) {
      store.validationErrors.stages[stageIdx] = { name: '', steps: [] };
    }

    const stageErrors = store.validationErrors.stages[stageIdx] as StageValidationErrors;

    for (const [key, messages] of Object.entries(errors)) {
      const errorText = messages[0] ?? '';
      if (!errorText) continue;

      if (key.startsWith('data.') && stepIdx != null) {
        const capabilityKey = key.slice('data.'.length);

        if (!stageErrors.steps[stepIdx]) {
          stageErrors.steps[stepIdx] = { setting: {} };
        }

        const stepErrors = stageErrors.steps[stepIdx] as StepValidationErrors;

        if (!stepErrors.setting) stepErrors.setting = {};
        if (!stepErrors.setting.input_capabilities) stepErrors.setting.input_capabilities = {};

        stepErrors.setting.input_capabilities[capabilityKey] = errorText;
      } else if (stepIdx != null && ['description'].includes(key)) {
        if (!stageErrors.steps[stepIdx]) {
          stageErrors.steps[stepIdx] = { setting: {} };
        }
        (stageErrors.steps[stepIdx] as StepValidationErrors).description = errorText;
      } else if (['name', 'is_context'].includes(key)) {
        (stageErrors as Record<string, unknown>)[key] = errorText;
      }
    }
  }

  /**
   * Обрабатывает ошибки при сохранении этапа/шага.
   * Для 422 — маппит ошибки в store.validationErrors.
   * Для остальных RequestError — показывает toast.
   *
   * @throws всегда пробрасывает ошибку дальше
   */
  function handleBackendError(
    e: unknown,
    stageIdx: number,
    stepIdx?: number,
  ): never {
    if (e instanceof RequestError) {
      if (e.statusCode === 422) {
        mapBackendErrorsToStore(e.errors, stageIdx, stepIdx);
        toastError('Ошибка валидации формы');
      } else {
        toastError(`Ошибка сохранения: ${e.message}`);
      }
    }

    throw e;
  }

  /** Инициализация конструктора с config-объектом */
  async function initConstructor(
    flowId: EntityId,
    stages: Stage[],
    config: FlowConstructorConfig,
  ) {
    store.initTree(flowId, stages);
    store.readonly = config.readonly;
    store.isPublic = config.isPublic;

    if (config.needsHydration) {
      await hydrateModelCapabilities(store.tree);
    }
  }

  /** Валидация всего дерева, сохраняет ошибки в store */
  function validateFlow(): boolean {
    const { valid, errors } = validateFlowTree(store.tree);
    store.validationErrors = errors;
    return valid;
  }

  /** Валидация этапа по индексу */
  function validateStageByIndex(stageIdx: number): boolean {
    const stage = store.tree[stageIdx];
    if (!stage) return false;

    const { valid, errors } = validateStage(stage);
    store.validationErrors.stages[stageIdx] = errors;
    return valid;
  }

  /** Валидация шага по индексу */
  function validateStepByIndex(stageIdx: number, stepIdx: number): boolean {
    const stage = store.tree[stageIdx];
    const step = stage?.steps[stepIdx];
    if (!stage || !step) return false;

    const { valid, errors } = validateStep(step);
    if (!store.validationErrors.stages[stageIdx]) {
      store.validationErrors.stages[stageIdx] = { name: '', steps: [] };
    }
    store.validationErrors.stages[stageIdx].steps[stepIdx] = errors;
    return valid;
  }

  /** Сохранение всего дерева */
  async function saveFlow() {
    if (!validateFlow()) throw new Error('Validation error');

    try {
      store.loading = true;

      for (let i = 0; i < store.tree.length; i++) {
        await saveStageAction(store.tree[i]!, i, true, true);
      }
    } finally {
      store.loading = false;
      if (store.postSaveCallback) store.postSaveCallback().catch(() => {});
    }
  }

  /**
   * Обёртка saveFlow, которая не пробрасывает ошибки.
   * Ошибки 422 маппятся в store.validationErrors внутри saveStageAction.
   * Возвращает `true` если сохранение прошло успешно.
   */
  async function saveFlowSafe(): Promise<boolean> {
    try {
      await saveFlow();
      return true;
    } catch {
      return false;
    }
  }

  /** Сохранение одного этапа */
  async function saveStageAction(
    stage: StageViewModel,
    stageIdx: number,
    withSteps: boolean = false,
    _skipCallback: boolean = false,
  ) {
    if (!validateStageByIndex(stageIdx)) throw new Error('Validation error');

    try {
      store.loading = true;

      if (withSteps) {
        await saveStageWithSteps(stage);
      } else {
        await saveTreeStage(stage);
      }
    } catch (e) {
      handleBackendError(e, stageIdx);
    } finally {
      store.loading = false;
      if (!_skipCallback && store.postSaveCallback)
        store.postSaveCallback().catch(() => {});
    }
  }

  /** Сохранение одного шага */
  async function saveStepAction(
    step: StepViewModel,
    stageIdx: number,
    stepIdx: number,
    _skipCallback: boolean = false,
  ) {
    const stage = store.tree[stageIdx];
    if (!stage) throw new Error('Empty stage');

    if (!stage.id) {
      await saveStageAction(stage, stageIdx, false, true);
    }

    if (!validateStepByIndex(stageIdx, stepIdx)) {
      throw new Error('Validation error');
    }

    try {
      store.loading = true;
      await saveStepWithSetting(step, stage);
    } catch (e) {
      handleBackendError(e, stageIdx, stepIdx);
    } finally {
      store.loading = false;
      if (!_skipCallback && store.postSaveCallback)
        store.postSaveCallback().catch(() => {});
    }
  }

  /** Добавить этап */
  function insertStageIntoTree() {
    if (!store.flowId) return;
    insertStage(store.tree, store.flowId);
  }

  /** Добавить шаг в этап */
  function insertStepIntoStage(stage: StageViewModel) {
    if (!store.flowId) return;
    insertStep(stage);
  }

  /** Удалить этап */
  async function deleteStageFromTree(id: EntityId, idx: number) {
    await removeStage(store.tree, id, idx);
  }

  /** Удалить шаг */
  async function deleteStepFromStage(stepId: EntityId) {
    await removeStep(stepId);
  }

  return {
    initConstructor,
    validateFlow,
    validateStageByIndex,
    validateStepByIndex,
    saveFlow,
    saveFlowSafe,
    saveStageAction,
    saveStepAction,
    insertStageIntoTree,
    insertStepIntoStage,
    deleteStageFromTree,
    deleteStepFromStage,
  };
}

export default useFlowConstructorActions;
