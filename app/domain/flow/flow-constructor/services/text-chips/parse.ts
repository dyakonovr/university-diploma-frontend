import type { Artifact } from '~/domain/artifact/models/artifact.types';

import type { FlowTreeItem } from '../../stores/constructor-store';
import { PROMPT_VARIABLE_RULES } from '../step-variables/const';
import type { PromptVariableArtifactType } from '../step-variables/types';
import type { PromptSourceChip } from './types';

export function parseTextChipsFromPreviousStep(
  text: string,
): PromptSourceChip[] {
  const chips: PromptSourceChip[] = [];
  let match: RegExpExecArray | null;

  while ((match = PROMPT_VARIABLE_RULES.PREVIOUS_STEP.exec(text))) {
    const paramName = match[1];
    const artifactIndex = Number(match[2]);

    chips.push({
      source: 'previous_step',
      artifactType: paramName as PromptVariableArtifactType,
      artifactIndex,
      label: `Предыдущий шаг → ${paramName} [${artifactIndex}]`,
    });
  }

  return chips;
}

export function parseTextChipsFromPreviousStage(options: {
  text: string;
  flowTree: FlowTreeItem[];
}): PromptSourceChip[] {
  const chips: PromptSourceChip[] = [];
  let match: RegExpExecArray | null;

  while ((match = PROMPT_VARIABLE_RULES.STAGE_OUTPUT.exec(options.text))) {
    const groupId = match[1];
    const paramName = match[2];
    const artifactIndex = Number(match[3]);

    const stage = options.flowTree.find((s) =>
      s.steps.some((st) => st.output_artifacts_group_id === groupId),
    );

    if (!stage) continue;

    chips.push({
      source: 'stage_output',
      artifactType: paramName as PromptVariableArtifactType,
      artifactIndex,

      stageId: stage.id,
      stageIndex: options.flowTree.indexOf(stage),
      label: `Этап ${options.flowTree.indexOf(stage) + 1} → ${paramName} [${artifactIndex}]`,
    });
  }

  return chips;
}

export function parseTextChipsFromGlobalArtifacts(options: {
  text: string;
  artifacts: Artifact[];
}): PromptSourceChip[] {
  const chips: PromptSourceChip[] = [];
  let match: RegExpExecArray | null;

  while ((match = PROMPT_VARIABLE_RULES.GLOBAL_ARTIFACT.exec(options.text))) {
    const artifactId = match[1];
    const artifact = options.artifacts?.find((a) => a.id === artifactId);
    if (!artifact) continue;

    chips.push({
      source: 'global_artifact',
      artifactType: artifact.type.toLowerCase() as PromptVariableArtifactType,
      artifactId: artifact.id,
      label: artifact.name ?? 'Без названия',
    });
  }

  return chips;
}

export function parseTextChips(options: {
  text: string;
  flowTree: FlowTreeItem[];
  artifacts: Artifact[];
}) {
  const chips: PromptSourceChip[] = [];

  /**
   * previous step
   */
  chips.push(...parseTextChipsFromPreviousStep(options.text));

  /**
   * stage outputs
   */
  chips.push(...parseTextChipsFromPreviousStage(options));

  // global artifacts
  chips.push(...parseTextChipsFromGlobalArtifacts(options));

  return chips;
}
