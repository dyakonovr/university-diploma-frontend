import type { EntityId } from '~/shared/types/core/base-entity.types';

import type {
  PromptVariableArtifactType,
  PromptVariableSource,
} from '../step-variables/types';

export type PromptSourceChip = {
  source: PromptVariableSource;
  artifactType: PromptVariableArtifactType;
  artifactIndex?: number;

  label: string;

  stageIndex?: number;
  artifactId?: EntityId;
  stageId?: EntityId;
};
