import { generateVariables } from '../services/step-variables/generate';
import type { PromptVariable } from '../services/step-variables/types';
import type { StageViewModel } from '../view-models/stage.view-model';

export function useFlowFormStepVariables(params: {
  stepIndex: number;
  stageIndex: number;
  flowTree: StageViewModel[];
  isPublic?: boolean;
}) {
  /**
   * Все доступные переменные для Prompt
   */
  const promptVariables = computed<PromptVariable[]>(() =>
    generateVariables(params),
  );

  return {
    promptVariables,
  };
}

export default useFlowFormStepVariables;
