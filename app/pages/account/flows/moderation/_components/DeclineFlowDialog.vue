<template>
  <dialog-ui
    v-model="model"
    title="Отклонение шаблона"
    confirm-button-text="Отклонить"
    :confirm-button-props="{ color: 'danger', disabled: loading }"
    :auto-close-on-confirm="false"
    @confirm="handleConfirm"
  >
    <div class="decline-flow-dialog">
      <input-ui
        v-model="formData.decline_reason"
        label="Причина отклонения"
        :input-props="{
          placeholder: 'Укажите причину отклонения',
          isTextarea: true,
          disabled: loading,
        }"
        :error="formErrors.decline_reason"
      />
    </div>
  </dialog-ui>
</template>

<script lang="ts" setup>
import DialogUi from '~/components/ui/DialogUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import useDeclineFlowForm from '../_composables/useDeclineFlowForm';

const props = defineProps<{
  flowId: EntityId | null;
}>();

const model = defineModel<boolean>();

const emit = defineEmits<{
  (e: 'declined'): void;
}>();

const flowIdRef = computed(() => props.flowId);
const { formData, formErrors, loading, onSubmit, resetForm } =
  useDeclineFlowForm(flowIdRef);

const handleConfirm = async (done: () => void) => {
  const success = await onSubmit();

  if (success) {
    done();
    emit('declined');
  }
};

watch(model, (newValue) => {
  if (newValue) {
    resetForm();
  }
});
</script>

<style lang="scss" scoped>
.decline-flow-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
