import type { InjectionKey, Ref } from 'vue';

import type { StepViewModel } from '../view-models/step.view-model';

/**
 * Provide/inject контракты для flow-конструктора.
 *
 * @example
 * // provide (FlowFormStage.vue)
 * provide(FLOW_STAGE_KEY, { stageIndex: props.index });
 *
 * // inject (FlowFormStep.vue)
 * const stage = inject(FLOW_STAGE_KEY);
 */

export type FlowFormStageProvide = {
  stageIndex: number;
};

export type FlowFormStepProvide = {
  step: Ref<StepViewModel>;
  stepIndex: number;
};

export const FLOW_STAGE_KEY: InjectionKey<FlowFormStageProvide> = Symbol('flow-stage');
export const FLOW_STEP_KEY: InjectionKey<FlowFormStepProvide> = Symbol('flow-step');
