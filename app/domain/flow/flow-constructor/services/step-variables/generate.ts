import type {
  ModelOutputParamCounts,
  ModelOutputParams,
  ModelOutputParamTypes,
} from '~/domain/model/models/model.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import type { FlowTreeItem } from '../../stores/constructor-store';
import type { StageViewModel } from '../../view-models/stage.view-model';
import {
  createPreviousStepVariable,
  createPublicStageOutputVariable,
  createStageOutputVariable,
} from './create';
import type { PromptVariable, PromptVariableArtifactType } from './types';

type OutputCapabilities = {
  output_params: ModelOutputParams | null;
  output_param_types: ModelOutputParamTypes | null;
  output_param_counts: ModelOutputParamCounts | null;
};

/** Генерация переменных из предыдущего шага */
export function generateVariablesFromPreviousStep(
  capabilities: OutputCapabilities,
): PromptVariable[] {
  const vars: PromptVariable[] = [];
  const params = capabilities.output_params;
  if (!params) return vars;

  for (const paramName of params) {
    const count = capabilities.output_param_counts?.[paramName] ?? 1;
    const type = (
      capabilities.output_param_types?.[paramName] ?? 'text'
    ).toLowerCase() as PromptVariableArtifactType;

    for (let i = 1; i <= count; i++) {
      vars.push({
        label: `Предыдущий шаг → Выходной параметр ${paramName} [артефакт №${i}]`,
        value: createPreviousStepVariable(paramName, i - 1), // 0-based

        source: 'previous_step',
        artifactType: type,
        artifactIndex: i,
        paramName,
      });
    }
  }

  return vars;
}

/** Генерация переменных из предыдущего этапа */
export function generateVariablesFromPreviousStage(options: {
  stage: StageViewModel;
  stageIndex: number;
  capabilities: OutputCapabilities;
  groupId: EntityId;
  isPublic?: boolean;
}): PromptVariable[] {
  const vars: PromptVariable[] = [];
  const params = options.capabilities.output_params;
  if (!params) return vars;

  for (const paramName of params) {
    const count = options.capabilities.output_param_counts?.[paramName] ?? 1;
    const type = (
      options.capabilities.output_param_types?.[paramName] ?? 'text'
    ).toLowerCase() as PromptVariableArtifactType;

    for (let idx = 1; idx <= count; idx++) {
      // 0-based
      const artifactOriginalIdx = idx - 1;
      const value = options.isPublic
        ? createPublicStageOutputVariable(
            options.stageIndex,
            paramName,
            artifactOriginalIdx,
          )
        : createStageOutputVariable(
            options.groupId,
            paramName,
            artifactOriginalIdx,
          );

      vars.push({
        label: `Этап ${options.stageIndex + 1} («${options.stage.name}») → Выходной параметр ${paramName} [артефакт №${idx}]`,
        value,

        source: 'stage_output',
        artifactType: type,
        artifactIndex: idx,
        paramName,

        stageId: options.stage.id,
        stageIndex: options.stageIndex,
      });
    }
  }

  return vars;
}

/**
 * Правила доступных переменных для Input Params в Step:
 *
 * 1. Если Step НЕ первый в своём Stage:
 *    - можно использовать результат ТОЛЬКО предыдущего Step
 *    - количество и типы артефактов берутся из model.capabilities
 *    - для каждого артефакта создаётся отдельная переменная:
 *        ${previous_step_<paramName>[N]} (N - 0-based)
 *
 * 2. Если Stage НЕ первый в Flow, внутри Step:
 *    - можно использовать результат ЛЮБОГО предыдущего Stage
 *    - используется результат ПОСЛЕДНЕГО Step этого Stage
 *    - формат:
 *        ${stage_(group_id)_artifact_<paramName>[N]} - для private flow (N - 0-based)
 *        ${stage_(stage_index)_artifact_<paramName>[N]} - для public flow (N - 0-based)
 *
 * 3. Если Step первый в первом Stage:
 *    - внешние переменные недоступны
 */
export function generateVariables(options: {
  stepIndex: number;
  stageIndex: number;
  flowTree: FlowTreeItem[];
  isPublic?: boolean;
}): PromptVariable[] {
  const vars: PromptVariable[] = [];

  /**
   * 1️⃣ previous step
   */
  if (options.stepIndex > 0) {
    const prevStep =
      options.flowTree[options.stageIndex]?.steps[options.stepIndex - 1];
    const caps = prevStep?.setting.model?.capabilities;

    if (caps) {
      vars.push(
        ...generateVariablesFromPreviousStep({
          output_params: caps.output_params,
          output_param_types: caps.output_param_types,
          output_param_counts: caps.output_param_counts,
        }),
      );
    }
  }

  /**
   * 2️⃣ outputs предыдущих Stage
   */
  if (options.stageIndex > 0) {
    for (let i = 0; i < options.stageIndex; i++) {
      const stage = options.flowTree[i];
      if (!stage?.steps.length) continue;

      const lastStep = stage.steps[stage.steps.length - 1];
      const groupId = lastStep?.output_artifacts_group_id;

      if (!groupId && !options.isPublic) continue;

      const caps = lastStep?.setting.model?.capabilities;
      if (!caps) continue;

      vars.push(
        ...generateVariablesFromPreviousStage({
          capabilities: {
            output_params: caps.output_params,
            output_param_types: caps.output_param_types,
            output_param_counts: caps.output_param_counts,
          },
          groupId: groupId ?? '',
          stage,
          stageIndex: i,
          isPublic: options.isPublic,
        }),
      );
    }
  }

  return vars;
}
