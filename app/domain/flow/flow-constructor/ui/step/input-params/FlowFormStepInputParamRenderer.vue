<template>
  <!-- Setting -->
  <template v-if="capability.type === 'Setting'">
    <number-input-ui
      v-if="
        capability.variable_type === 'int' ||
          capability.variable_type === 'float'
      "
      v-model="primitiveValue as number | null"
      :label="capabilityLabel"
      :input-props="{
        placeholder: `Введите значение ${capabilityLabel}`,
        disabled: flowConstructorStore.loading,
        readonly: flowConstructorStore.readonly,
      }"
      :min="capability.limit_down ?? -999999"
      :max="capability.limit_up ?? -999999"
      :step="capability.variable_type === 'int' ? 1 : 0.1"
      :error="error as string"
      :description="capabilityDescription"
    />

    <input-ui
      v-if="capability.variable_type === 'string'"
      v-model="primitiveValue as string | null"
      :label="capabilityLabel"
      :input-props="{
        minlength: capability.limit_down ?? 0,
        maxlength: capability.limit_up ?? 999999,
        placeholder: `Введите значение ${capabilityName}`,
        disabled: flowConstructorStore.loading,
        readonly: flowConstructorStore.readonly,
      }"
      :error="error as string"
      :description="capabilityDescription"
    />

    <switch-ui
      v-if="capability.variable_type === 'bool'"
      v-model="primitiveValue as boolean | null"
      :label="capabilityLabel"
      :error="error as string"
      :switch-props="{
        disabled: flowConstructorStore.loading || flowConstructorStore.readonly,
      }"
      :description="capabilityDescription"
    />
  </template>

  <!-- Text -->
  <template v-if="capability.type === 'Text'">
    <template v-if="capability.variable_type === 'string'">
      <flow-form-step-text-setting
        v-model="primitiveValue as string | null"
        :capability="capability"
        :description="capabilityDescription"
        :label="capabilityLabel"
        :disabled="
          flowConstructorStore.loading || flowConstructorStore.readonly
        "
        :variables="textArtifactVariables"
      />
    </template>
  </template>

  <!-- Message -->
  <flow-form-step-message-input-param
    v-if="capability.type === 'Message'"
    v-model="messageValue"
    :label="capabilityLabel"
    :errors="error as StepMessageInputCapabilitiesError"
    :variables="textArtifactVariables"
    :description="capabilityDescription"
    :disabled="flowConstructorStore.loading || flowConstructorStore.readonly"
    @delete-pair="
      (pairIdx: number) => emit('deleteMessagePair', pairIdx, capabilityName)
    "
  />

  <!-- Binary (Audio, Video, Photo) -->
  <template
    v-if="
      capability.type === 'Photo' ||
        capability.type === 'Video' ||
        capability.type === 'Audio'
    "
  >
    <flow-form-step-binary-input-param
      :label="capabilityLabel"
      :error="error as string"
      :prompt-variables="binaryArtifactVariables"
      :artifact-type="capability.type"
      :description="capabilityDescription"
      :disabled="flowConstructorStore.loading || flowConstructorStore.readonly"
      @select-variable="emit('binaryVariableSelect', $event)"
      @upload-file="emit('binaryFileUpload', $event)"
      @select-exists-artifact="emit('binaryExistsArtifactSelect', $event)"
    />
  </template>
</template>

<script lang="ts" setup>
import InputUi from '~/components/ui/form/InputUi.vue';
import NumberInputUi from '~/components/ui/form/NumberInputUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import type { ModelCapabilityInputParam } from '~/domain/model/models/model.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import type { PromptVariable } from '../../../services/step-variables/types';
import type { StepMessageInputCapabilitiesError } from '../../../services/tree';
import useFlowConstructorStore from '../../../stores/constructor-store';
import type { InputCapabilityValue, MessageInputCapabilityValue } from '../../../view-models/input-capability-values';
import FlowFormStepBinaryInputParam from './FlowFormStepBinaryInputParam.vue';
import FlowFormStepMessageInputParam from './FlowFormStepMessageInputParam.vue';
import FlowFormStepTextSetting from './FlowFormStepTextSetting.vue';

type Props = {
  capability: ModelCapabilityInputParam;
  capabilityName: string;
  error?: string | StepMessageInputCapabilitiesError | Record<string, unknown>;
  textArtifactVariables: PromptVariable[];
  binaryArtifactVariables: PromptVariable[];
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'deleteMessagePair', pairIdx: number, capabilityName: string): void;
  (e: 'binaryVariableSelect', variable: PromptVariable | null): void;
  (e: 'binaryFileUpload', file: File | null): void;
  (e: 'binaryExistsArtifactSelect', artifactId: EntityId | null): void;
}>();

const model = defineModel<InputCapabilityValue>();

const flowConstructorStore = useFlowConstructorStore();

/** Computed для Setting/Text/Binary — разворачивает .value из InputCapabilityValue */
const primitiveValue = computed({
  get: () => {
    const v = model.value;
    if (!v || v.type === 'Message') return null;
    return (v as { value: unknown }).value;
  },
  set: (newVal) => {
    if (!model.value || model.value.type === 'Message') return;
    model.value = { ...model.value, value: newVal } as InputCapabilityValue;
  },
});

/** Computed для Message — пробрасывает объект целиком */
const messageValue = computed({
  get: (): MessageInputCapabilityValue | null => {
    return model.value?.type === 'Message' ? model.value : null;
  },
  set: (newVal: MessageInputCapabilityValue | null) => {
    if (newVal) model.value = newVal;
  },
});

const capabilityLabel = computed(() => {
  return props.capability.name || props.capabilityName;
});

const capabilityDescription = computed(() => {
  const parts: string[] = [];

  if (props.capability.is_optional) {
    parts.push('Это поле является опциональным, вы можете его не заполнять');
  }

  if (props.capability.description) {
    parts.push(props.capability.description);
  }

  return parts.join('<br>');
});
</script>
