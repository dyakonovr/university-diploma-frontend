<template>
  <div
    :id="`step-${stepVM.ui.uuid}`"
    class="stage-step"
    :class="{ 'stage-step--collapsed': stepVM.ui.is_collapsed }"
  >
    <div class="stage-step__header">
      <button
        type="button"
        class="stage-step__chevron"
        @click="toggleCollapse">
        <chevron-down-icon />
      </button>

      <p class="stage-step__name text-18 weight-500">Шаг {{ index + 1 }}</p>

      <div class="stage-step__header-actions">
        <flow-form-delete-button
          v-if="!flowConstructorStore.readonly"
          :disabled="flowConstructorStore.loading"
          @click="handleDelete(index)"
        />
      </div>
    </div>

    <div
      v-show="!stepVM.ui.is_collapsed"
      class="stage-step__body">
      <!-- Descr -->
      <editor-element-ui
        v-model="stepVM.description"
        label="Описание шага"
        label-hint="Произвольное описание шага для удобства. Не влияет на генерацию."
        :disabled="
          flowConstructorStore.loading || flowConstructorStore.readonly
        "
        :error="validationErrors?.description"
      />
      <select-ui
        v-model="stepVM.setting.provider_id"
        v-model:search-query="providers.searchValue.value"
        :options="providers.data.value || []"
        label="Провайдер"
        label-hint="Провайдер — платформа, через которую вызывается модель"
        :error="validationErrors?.setting?.provider_id"
        :select-props="{
          disabled: providers.loading.value || flowConstructorStore.loading,
          readonly: flowConstructorStore.readonly,
        }"
        :description="stepVM.setting.provider?.description"
        @update:search-query="providers.debouncedGetData(1, true)"
        @reach-end="providers.getData(providers.meta.value.page + 1)"
      >
        <template #selected="{ value }">
          {{ findOptionByValue(providers.data.value, value)?.label }}
          <tag-ui
            v-if="
              findOptionByValue(providers.data.value, value)?.is_available ===
                false
            "
            type="error"
            class="ml"
          >
            Недоступно
          </tag-ui>
        </template>
        <template #option="{ option }">
          <span>{{ option.label }}</span>
          <tag-ui
            v-if="option.is_available === false"
            type="error">
            Недоступно
          </tag-ui>
        </template>
      </select-ui>
      <select-ui
        v-model="stepVM.setting.model_id"
        v-model:search-query="models.searchValue.value"
        :options="models.data.value || []"
        :error="validationErrors?.setting?.model_id"
        label="Модель"
        label-hint="Модель определяет:
          <ul>
          <li>какие входные параметры нужно заполнить</li>
          <li>какие типы результатов будут сгенерированы</li>
          </ul>"
        :description="stepVM.setting.model?.description"
        :select-props="{
          disabled:
            models.loading.value ||
            flowConstructorStore.loading ||
            !stepVM.setting.provider_id,
          readonly: flowConstructorStore.readonly,
        }"
        @update:model-value="onModelSelectChange($event as EntityId | null)"
        @update:search-query="models.debouncedGetData(1, true)"
        @reach-end="models.getData(models.meta.value.page + 1)"
      >
        <template #selected="{ value }">
          {{ findOptionByValue(models.data.value, value)?.label }}
          <tag-ui
            v-if="
              findOptionByValue(models.data.value, value)?.is_available ===
                false
            "
            type="error"
            class="ml"
          >
            Недоступно
          </tag-ui>
        </template>
        <template #option="{ option }">
          <span>{{ option.label }}</span>
          <tag-ui
            v-if="option.is_available === false"
            type="error">
            Недоступно
          </tag-ui>
        </template>
      </select-ui>

      <flow-form-step-input-params
        v-model="stepVM.setting.input_capabilities"
        :original-capabilities="stepVM.setting.original_capabilities ?? {}"
        :errors="validationErrors?.setting?.input_capabilities"
      />

      <flow-form-step-output-params
        :output-params="stepVM.setting.model?.capabilities.output_params"
        :output-param-types="
          stepVM.setting.model?.capabilities.output_param_types
        "
        :output-param-counts="
          stepVM.setting.model?.capabilities.output_param_counts
        "
        :output-param-costs="
          stepVM.setting.model?.capabilities.output_param_costs
        "
      />

      <div
        v-if="!flowConstructorStore.readonly"
        class="stage-step__buttons">
        <button-ui
          v-if="isNeedToSave"
          color="accent"
          :disabled="flowConstructorStore.loading"
          @click="onSaveButtonClick"
        >
          Сохранить Шаг
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

<script lang="ts" setup>
import ChevronDownIcon from '~/assets/images/icons/chevron-down.svg';
import DeleteConfirmationDialog from '~/components/dialogs/DeleteConfirmationDialog.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import EditorElementUi from '~/components/ui/form/EditorElementUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import TagUi from '~/components/ui/TagUi.vue';
import { getModels } from '~/domain/model/api/models.api';
import type { Model } from '~/domain/model/models/model.types';
import { getProviders } from '~/domain/provider/api/providers.api';
import type { Provider } from '~/domain/provider/models/provider.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useDeleteItem from '~/shared/composables/useDeleteItem';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import useFlowConstructorActions from '../../composables/useFlowConstructorActions';
import { FLOW_STAGE_KEY, FLOW_STEP_KEY } from '../../models/injection-keys';
import { cachedFetch } from '../../services/cached-fetch';
import { getModelCapabilitiesForStep } from '../../services/capabilities';
import useFlowConstructorStore from '../../stores/constructor-store';
import type { StepViewModel } from '../../view-models/step.view-model';
import FlowFormDeleteButton from '../FlowFormDeleteButton.vue';
import FlowFormStepOutputParams from './FlowFormStepOutputParams.vue';
import FlowFormStepInputParams from './input-params/FlowFormStepInputParams.vue';

/**
 * Flow step form component for the flow constructor.
 *
 * Renders a collapsible card for a single step within a flow stage,
 * allowing the user to configure:
 * - Step description (rich text editor)
 * - Provider selection (infinite scroll select with search)
 * - Model selection (filtered by selected provider, infinite scroll)
 * - Input parameters (derived from selected model capabilities)
 * - Output parameters (read-only, from model capabilities)
 *
 * @example
 * ```vue
 * <flow-form-step
 *   v-model="step"
 *   :index="0"
 *   @delete="onStepDelete"
 * />
 * ```
 *
 * @props
 * - `modelValue` (StepViewModel, required) — The step view model (v-model)
 * - `index` (number, required) — Zero-based step index within the stage
 *
 * @emits
 * - `delete(stepId: EntityId, idx: number)` — Fired when user confirms step deletion
 *
 * Key behaviors:
 * - Collapse/expand: click the chevron to toggle step body visibility
 * - Validation: errors are pulled from `flowConstructorStore.validationErrors`
 * - Save: a "Сохранить Шаг" button appears when the step has unsaved changes (`is_dirty` or `is_new`)
 * - Model capabilities: when a model is selected, its input capabilities are applied to the step
 * - Provider change resets the model selection
 * - Items marked as `is_available === false` are shown with a TagUi "Недоступно" badge
 */

type Props = {
  index: number;
};

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'delete', stepId: EntityId, idx: number): void;
}>();

const stageInject = inject(FLOW_STAGE_KEY, {
  stageIndex: -1,
});

const { toastSuccess, toastError } = useCustomToast();

const stepVM = defineModel<StepViewModel>({ required: true });
const isNeedToSave = computed(() => {
  return (
    stepVM.value.ui.is_dirty ||
    stepVM.value.ui.is_new ||
    stepVM.value.setting.ui.is_dirty ||
    stepVM.value.setting.ui.is_new
  );
});

const flowConstructorStore = useFlowConstructorStore();
const flowActions = useFlowConstructorActions();

/* --- Accordion --- */
const toggleCollapse = () => {
  stepVM.value.ui.is_collapsed = !stepVM.value.ui.is_collapsed;
};

const validationErrors = computed(
  () =>
    flowConstructorStore.validationErrors.stages?.[stageInject.stageIndex]
      ?.steps?.[props.index],
);

const models = useSelectInfiniteScroll<Model>({
  mapFunc: (item) => {
    const name = item.display_name || item.name;
    return {
      label: name,
      value: item.id,
      is_available: item.is_available,
    };
  },
  requestFunc: (params, signal) =>
    cachedFetch({
      entity: 'models',
      params,
      request: () => getModels(params, signal),
    }),
  errorMessage: 'Ошибка при получении моделей',
  requestParams: (_, searchValue) => ({
    is_configured: true,
    is_active: true,
    // TODO: изменить на правильное поле
    name: searchValue ?? null,
    provider_id: stepVM.value.setting.provider_id,
  }),
});

const providers = useSelectInfiniteScroll<Provider>({
  mapFunc: (item) => {
    const name = item.display_name || item.name;
    return {
      label: `${name} (${item.category})`,
      value: item.id,
      is_available: item.is_available,
    };
  },
  requestFunc: (params, signal) =>
    cachedFetch({
      entity: 'providers',
      params,
      request: () => getProviders(params, signal),
    }),
  errorMessage: 'Ошибка при получении провайдеров',
  requestParams: (_, searchValue) => ({
    is_configured: true,
    is_active: true,
    // TODO: изменить на правильное поле
    name: searchValue ?? null,
  }),
});

const findOptionByValue = (
  options: Record<string, unknown>[] | null,
  value: unknown,
) => options?.find((opt) => opt.value === value) ?? null;

const onSaveButtonClick = async () => {
  try {
    await flowActions.saveStepAction(
      stepVM.value,
      stageInject.stageIndex,
      props.index,
    );
    toastSuccess('Шаг успешно сохранён');
  } catch (error) {
    console.error('@SAVE STEP ERROR:', error);
    // toastError('Ошибка при сохранении шага');
  }
};

const onModelSelectChange = (value: EntityId | null) => {
  const model = models.rawData.value?.find((m) => m.id === value) ?? null;
  stepVM.value.setting.model = model || undefined;

  applyModelCapabilities(model);
};

const applyModelCapabilities = (
  model: Model | null,
  isFirstMount: boolean = false,
) => {
  stepVM.value.setting.original_capabilities =
    model?.capabilities.input_params ?? null;

  stepVM.value.setting.input_capabilities = getModelCapabilitiesForStep(
    stepVM.value,
    model,
    isFirstMount,
  );
};

const {
  deleteItemDialogContent,
  deleteDialogVisible,
  itemToDelete,
  confirmDelete,
  handleDelete,
} = useDeleteItem<number>({
  deleteFunc: () => {
    emit('delete', stepVM.value.id, itemToDelete.value ?? -1);
  },
});

watch(
  () => [stepVM.value.description],
  () => {
    stepVM.value.ui.is_dirty = true;
  },
  { deep: true },
);

watch(
  () => [
    stepVM.value.setting.model_id,
    stepVM.value.setting.provider_id,
    stepVM.value.setting.data,
    stepVM.value.setting.input_capabilities,
  ],
  () => {
    stepVM.value.ui.is_dirty = true;
    stepVM.value.setting.ui.is_dirty = true;
  },
  { deep: true },
);

watch(
  () => stepVM.value.setting.provider_id,
  () => {
    stepVM.value.setting.model_id = null;
    stepVM.value.setting.model = undefined;
    models.getData(1);
  },
);

onMounted(() => {
  Promise.all([providers.getData(1), models.getData(1)]);

  if (
    stepVM.value.setting.model &&
    (!stepVM.value.setting.input_capabilities ||
      Object.keys(stepVM.value.setting.input_capabilities).length === 0)
  ) {
    applyModelCapabilities(stepVM.value.setting.model, true);
  }
});

provide(FLOW_STEP_KEY, {
  step: stepVM,
  stepIndex: props.index,
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/components/form' as form;

.stage-step {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: form.$form-container-fields-gap;
  border: 1px solid colors.$border;
  border-radius: 12px;
  padding: 16px 16px 16px 20px;
  background: colors.$white;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 3px;
    border-radius: 4px;
    background: colors.$accent;
    opacity: 0.7;
  }

  &:not(:last-child) {
    margin-bottom: 16px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    margin-left: auto;
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

    svg {
      width: 14px;
      height: 14px;
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

  &__buttons {
    display: flex;
    align-items: center;
    gap: 12px;
    align-self: flex-end;
  }

  &__sources-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}
</style>
