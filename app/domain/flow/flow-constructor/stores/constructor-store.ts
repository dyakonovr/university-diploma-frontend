import { createEmptyStage } from '~/domain/flow/flow-constructor/factories/stage.factories';
import { mapStageToVM } from '~/domain/flow/flow-constructor/mappers/stage.mappers';
import type {
  FlowValidationErrors,
  StepMessageInputCapabilitiesError,
} from '~/domain/flow/flow-constructor/services/tree';
import type { StageViewModel } from '~/domain/flow/flow-constructor/view-models/stage.view-model';
import type { Stage } from '~/domain/flow/model/stage.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';

/** Один элемент ```Flow```-дерева */
export type FlowTreeItem = StageViewModel;
type FlowConstructorStoreState = {
  flowId: EntityId | null;
  tree: FlowTreeItem[];
  loading: boolean;
  readonly: boolean;
  isPublic: boolean;
  validationErrors: FlowValidationErrors;
  postSaveCallback: (() => Promise<void>) | null;
};

export const useFlowConstructorStore = defineStore('flow-constructor', {
  state: (): FlowConstructorStoreState => ({
    flowId: null,
    tree: [],
    loading: false,
    readonly: false,
    isPublic: false,
    validationErrors: { stages: [] },
    postSaveCallback: null,
  }),

  getters: {
    hasUnsavedChanges(): boolean {
      return this.tree.some(
        (stage) =>
          stage.ui.is_dirty ||
          stage.ui.is_new ||
          stage.steps.some(
            (step) =>
              step.ui.is_dirty ||
              step.ui.is_new ||
              step.setting.ui.is_dirty ||
              step.setting.ui.is_new,
          ),
      );
    },
  },

  actions: {
    clear() {
      this.flowId = null;
      this.tree = [];
      this.loading = false;
      this.readonly = false;
      this.isPublic = false;
      this.validationErrors = { stages: [] };
    },

    initTree(flowId: EntityId, stages: Stage[]) {
      try {
        this.clear();

        this.flowId = flowId;
        this.tree = stages.length
          ? stages.map(mapStageToVM)
          : [createEmptyStage(flowId, 0)];
      } catch (error) {
        console.error('Ошибка при парсинге дерева:', error);
      }
    },

    removeStageErrors(stageIdx: number) {
      if (!this.validationErrors.stages?.length) return;
      this.validationErrors.stages.splice(stageIdx, 1);
    },

    removeStepErrors(stageIdx: number, stepIdx: number) {
      const stageErrors = this.validationErrors.stages?.[stageIdx];
      if (!stageErrors?.steps?.length) return;
      stageErrors.steps.splice(stepIdx, 1);
    },

    removeMessageInputParamError(
      stageIdx: number,
      stepIdx: number,
      settingName: string,
      messageIdx: number,
    ) {
      const stageErrors = this.validationErrors.stages?.[stageIdx];
      if (!stageErrors?.steps?.length) return;

      const stepErrors = stageErrors.steps[stepIdx];
      if (!stepErrors?.setting?.input_capabilities) return;

      const inputParamError = stepErrors.setting.input_capabilities;
      const settingErrors = inputParamError[settingName] as StepMessageInputCapabilitiesError;
      if (!settingErrors?.pairs) return;

      const { [messageIdx]: _, ...remainingPairs } = settingErrors.pairs;
      settingErrors.pairs = remainingPairs;
    },
  },
});

export default useFlowConstructorStore;
