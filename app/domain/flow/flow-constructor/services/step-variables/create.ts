import type { EntityId } from '~/shared/types/core/base-entity.types';

/** Создание переменной по общему шаблону */
function createStepVariable(value: string): string {
  return `\${${value}}`;
}

/** Создание переменной для предыдущего шага */
export function createPreviousStepVariable(
  paramName: string,
  artifactIndex: number,
): string {
  return createStepVariable(`previous_step_${paramName}[${artifactIndex}]`);
}

/** Создание переменной для выхода этапа */
export function createStageOutputVariable(
  groupId: string,
  paramName: string,
  artifactIndex: number,
): string {
  return createStepVariable(
    `stage_${groupId}_artifact_${paramName}[${artifactIndex}]`,
  );
}

/** Создание переменной для выхода этапа (публичный шаблон — по индексу этапа) */
export function createPublicStageOutputVariable(
  stageIndex: number,
  paramName: string,
  artifactIndex: number,
): string {
  return createStepVariable(
    `stage_${stageIndex}_artifact_${paramName}[${artifactIndex}]`,
  );
}

/** Создание переменной для глобального артефакта */
export function createGlobalArtifactVariable(artifactId: EntityId): string {
  return createStepVariable(`artifact_${artifactId}`);
}
