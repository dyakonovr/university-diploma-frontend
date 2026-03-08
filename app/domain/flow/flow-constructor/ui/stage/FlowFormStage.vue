<template>
  <div
    :id="`stage-${stage.ui.uuid}`"
    class="flow-stage"
    :class="{ 'flow-stage--collapsed': stage.ui.is_collapsed }"
  >
    <div class="flow-stage__header">
      <button
        type="button"
        class="flow-stage__chevron"
        @click="toggleCollapse">
        <chevron-down-icon />
      </button>

      <div class="flow-stage__title-wrapper">
        <div class="flow-stage__name-field">
          <h3 class="flow-stage__title weight-600">
            <span>Этап {{ index + 1 }} —</span>
            <button
              v-if="!isNameEditing"
              type="button"
              class="flow-stage__name-button"
              :class="{ 'flow-stage__name-button--empty': !stage.name }"
              :title="stage.name"
              @click="startNameEdit"
            >
              {{ stage.name || 'Введите название' }}
            </button>
            <input
              v-else
              ref="nameInputRef"
              v-model="stage.name"
              class="flow-stage__name-inline-input"
              placeholder="Введите название этапа"
              :disabled="flowConstructorStore.loading"
              @blur="stopNameEdit"
              @keydown.enter="stopNameEdit"
              @keydown.escape="stopNameEdit"
            >
          </h3>
          <p
            v-if="nameError"
            class="flow-stage__name-error form-wrapper__description form-wrapper__description--error"
          >
            {{ nameError }}
          </p>
        </div>
      </div>

      <div class="flow-stage__header-actions">
        <switch-ui
          :model-value="!stage.is_context"
          with-label
          enabled-label="Обычный"
          disabled-label="Контекстный"
          :switch-props="{
            disabled:
              flowConstructorStore.loading || flowConstructorStore.readonly,
          }"
          form-wrapper-class="flow-stage__switcher-compact"
          @update:model-value="stage.is_context = !$event"
        />
        <flow-form-delete-button
          v-if="!flowConstructorStore.readonly"
          :disabled="flowConstructorStore.loading"
          @click="handleDelete(index)"
        />
      </div>
    </div>

    <div
      v-show="!stage.ui.is_collapsed"
      class="flow-stage__body">
      <div class="flow-stage__steps">
        <p v-if="!stage.steps.length">Пока здесь нет шагов...</p>
        <flow-form-step
          v-for="(step, stepIdx) in stage?.steps"
          v-else
          :key="step.ui.uuid"
          v-model="stage.steps[stepIdx]!"
          :index="stepIdx"
          @delete="onStepDelete"
        />
      </div>

      <div
        v-if="!flowConstructorStore.readonly"
        class="flow-stage__buttons">
        <button-ui
          color="accent"
          variant="outlined"
          :disabled="
            flowConstructorStore.loading || flowConstructorStore.readonly
          "
          @click="flowActions.insertStepIntoStage(stage)"
        >Добавить шаг</button-ui
        >
        <button-ui
          v-if="isNeedToSave"
          :disabled="
            flowConstructorStore.loading || flowConstructorStore.readonly
          "
          @click="onSaveButtonClick"
        >
          Сохранить Этап
        </button-ui>
      </div>
    </div>
  </div>

  <delete-confirmation-dialog
    v-model="deleteDialogVisible"
    v-bind="deleteItemDialogContent"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import ChevronDownIcon from '~/assets/images/icons/chevron-down.svg';
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useDeleteItem from '~/shared/composables/useDeleteItem';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import useFlowConstructorActions from '../../composables/useFlowConstructorActions';
import { FLOW_STAGE_KEY } from '../../models/injection-keys';
import useFlowConstructorStore from '../../stores/constructor-store';
import type { StageViewModel } from '../../view-models/stage.view-model';
import FlowFormDeleteButton from '../FlowFormDeleteButton.vue';
import FlowFormStep from '../step/FlowFormStep.vue';

type Props = {
  index: number;
};

const props = defineProps<Props>();

const { toastSuccess, toastError } = useCustomToast();

const stage = defineModel<StageViewModel>({ required: true });
const isNeedToSave = computed(() => {
  return stage.value.ui.is_dirty || stage.value.ui.is_new;
});

const flowConstructorStore = useFlowConstructorStore();
const flowActions = useFlowConstructorActions();
const validationErrors = computed(
  () => flowConstructorStore.validationErrors.stages?.[props.index],
);

/* --- Accordion --- */
const toggleCollapse = () => {
  stage.value.ui.is_collapsed = !stage.value.ui.is_collapsed;
};

/* --- Inline name editing --- */
const isNameEditing = ref(false);
const nameInputRef = ref<HTMLInputElement | null>(null);
const localNameError = ref<string | null>(null);

const nameError = computed(
  () => (validationErrors.value?.name || null) || localNameError.value,
);

const startNameEdit = () => {
  if (flowConstructorStore.loading || flowConstructorStore.readonly) return;
  isNameEditing.value = true;
  localNameError.value = null;
  nextTick(() => nameInputRef.value?.focus());
};

const stopNameEdit = () => {
  if (!stage.value.name) {
    localNameError.value = 'Название этапа не может быть пустым';
    return;
  }
  localNameError.value = null;
  isNameEditing.value = false;
};

const onSaveButtonClick = () => {
  if (flowConstructorStore.loading) return;
  flowActions.saveStageAction(stage.value, props.index);
};

const onStepDelete = async (stepId: EntityId, stepIdx: number) => {
  if (stage.value.steps.length === 1) {
    toastError('Нельзя удалить единственный шаг');
    return;
  }

  try {
    await flowActions.deleteStepFromStage(stepId);
    stage.value.steps.splice(stepIdx, 1);
    flowConstructorStore.removeStepErrors(props.index, stepIdx);
    toastSuccess('Шаг успешно удалён');
  } catch {
    toastError('Ошибка при удалении шага');
  }
};

const {
  deleteItemDialogContent,
  deleteDialogVisible,
  itemToDelete,
  confirmDelete,
  handleDelete,
} = useDeleteItem<number>({
  successMessage: 'Этап успешно удалён',
  errorMessage: 'Ошибка при удалении этапа',
  deleteFunc: () => {
    try {
      flowActions.deleteStageFromTree(stage.value.id, itemToDelete.value ?? -1);
      flowConstructorStore.removeStageErrors(props.index);
    } catch (error) {
      console.error('@Error while deleting Stage:', error);
    }
  },
});

watch(
  () => [stage.value.name, stage.value.is_context],
  () => {
    stage.value.ui.is_dirty = true;
  },
  { deep: true },
);

provide(FLOW_STAGE_KEY, {
  stageIndex: props.index,
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/components/form' as form;

.flow-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: form.$form-container-fields-gap;
  border: 1px solid colors.$border;
  border-radius: 16px;
  padding: 24px;
  background: colors.$background;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 4px;
    border-radius: 4px;
    background: colors.$primary;
  }

  &:not(:last-child) {
    margin-bottom: 24px;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    margin-left: auto;
    // выровнять по первой строке заголовка
    margin-top: 2px;
  }

  &__title-wrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    flex: 1;
  }

  &__name-field {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }

  &__name-button {
    background: none;
    border: none;
    border-bottom: 2px dashed transparent;
    padding: 0 2px 1px;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    color: colors.$text;
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: inherit;

    &--empty {
      color: colors.$text-light;
      font-weight: 400;
      font-style: italic;
      border-bottom-color: colors.$text-light;
    }

    &:hover {
      border-bottom-color: colors.$primary;
      color: colors.$primary;
    }
  }

  &__name-inline-input {
    padding: 0 2px 1px;
    max-width: 400px;
    min-width: 180px;
    height: 27px;
    font: inherit;
    font-weight: 600;
    outline: none;
    border: none;
    border-bottom: 2px solid colors.$primary;
    background: transparent;
    line-height: inherit;

    &::placeholder {
      font-size: 20px;
      font-weight: 500;
      color: colors.$text-light;
    }
  }

  &__name-error {
    font-size: 12px;
    color: colors.$danger;
  }

  &__chevron {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border: none;
    border-radius: 6px;
    background: transparent;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      background-color 0.15s ease;
    margin-top: 2px;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  &--collapsed &__chevron {
    transform: rotate(-90deg);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: form.$form-container-fields-gap;
  }

  &__switcher-compact {
    .form-wrapper__label-and-description {
      display: none;
    }

    .switch-ui {
      flex-direction: row-reverse;
      min-height: unset;
    }
  }

  &__buttons {
    display: flex;
    align-items: center;
    gap: 16px;
    align-self: flex-end;
  }
}
</style>
