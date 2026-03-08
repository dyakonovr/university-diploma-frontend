import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';

export type PromptVariableSource =
  | 'previous_step'
  | 'stage_output'
  | 'global_artifact';

export type PromptVariableArtifactType = 'text' | 'photo' | 'audio' | 'video';

export type PromptVariable = SelectOption<string> & {
  source: PromptVariableSource;
  artifactType: PromptVariableArtifactType;
  artifactIndex: number;
  paramName: string;

  stageIndex?: number;
  stageId?: EntityId;
};
