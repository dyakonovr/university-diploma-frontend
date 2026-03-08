<template>
  <form-wrapper-ui v-if="messages">
    <model-message-input-param-editor
      v-model="messages"
      :disabled="disabled"
      :errors="errors"
    >
      <template #text-editor="{ modelValue, onUpdate, error }">
        <flow-form-step-text-setting
          :model-value="modelValue"
          :error="error"
          :variables="variables"
          :disabled="disabled"
          @update:model-value="onUpdate"
        />
      </template>
    </model-message-input-param-editor>
  </form-wrapper-ui>
</template>

<script setup lang="ts">
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import type { MessageInputErrors } from '~/shared/types/message-input.types';
import ModelMessageInputParamEditor from '~/shared/ui/ModelMessageInputParamEditor.vue';

import type { PromptVariable } from '../../../services/step-variables/types';
import type { MessageInputCapabilityValue } from '../../../view-models/input-capability-values';
import FlowFormStepTextSetting from './FlowFormStepTextSetting.vue';

type Props = {
  errors?: MessageInputErrors | null;
  variables: PromptVariable[];
  disabled?: boolean;
};

defineProps<Props>();

const messages = defineModel<MessageInputCapabilityValue | null>({
  required: true,
});
</script>
