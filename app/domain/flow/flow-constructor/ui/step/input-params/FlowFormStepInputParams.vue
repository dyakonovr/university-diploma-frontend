<template>
  <div v-if="Object.keys(originalCapabilities).length">
    <p class="text-18 weight-500">Входные параметры модели</p>
    <p>
      Заполните параметры, которые требует выбранная модель. Поля могут
      использовать переменные из предыдущих шагов и этапов.
    </p>
  </div>

  <!-- Required params -->
  <template
    v-for="(cap, name, idx) in requiredCapabilities"
    :key="`required-${idx}`"
  >
    <flow-form-step-input-param-renderer
      v-model="capabilities[name]"
      :capability="cap"
      :capability-name="String(name)"
      :error="errors?.[name]"
      :text-artifact-variables="textArtifactVariables"
      :binary-artifact-variables="binaryArtifactVariables"
      @delete-message-pair="onMessageInputParamDeletePair"
      @binary-variable-select="
        onBinaryParamVariableSelect($event, String(name))
      "
      @binary-file-upload="onBinaryParamFileUpload($event, String(name))"
      @binary-exists-artifact-select="
        onBinaryParamExsistsArtifactSelect($event, String(name))
      "
    />
  </template>

  <!-- Optional params (accordion) -->
  <div
    v-if="Object.keys(optionalCapabilities).length"
    class="flow-form-step-input-params__optional"
  >
    <button
      type="button"
      class="flow-form-step-input-params__optional-title"
      :class="{
        'flow-form-step-input-params__optional-title--opened': isOpened,
      }"
      @click="toggle"
    >
      Необязательные параметры
      <chevron-down-icon />
    </button>

    <template v-if="isOpened">
      <template
        v-for="(cap, name, idx) in optionalCapabilities"
        :key="`optional-${idx}`"
      >
        <flow-form-step-input-param-renderer
          v-model="capabilities[name]"
          :capability="cap"
          :capability-name="String(name)"
          :error="errors?.[name]"
          :text-artifact-variables="textArtifactVariables"
          :binary-artifact-variables="binaryArtifactVariables"
          @delete-message-pair="onMessageInputParamDeletePair"
          @binary-variable-select="
            onBinaryParamVariableSelect($event, String(name))
          "
          @binary-file-upload="onBinaryParamFileUpload($event, String(name))"
          @binary-exists-artifact-select="
            onBinaryParamExsistsArtifactSelect($event, String(name))
          "
        />
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import ChevronDownIcon from '~/assets/images/icons/chevron-down.svg';
import { createBinaryArtifact } from '~/domain/artifact/api/artifacts.api';
import useFlowFormStepVariables from '~/domain/flow/flow-constructor/composables/useFlowFormStepVariables';
import type { ModelCapabilitiesInputParams } from '~/domain/model/models/model.types';
import useAccordion from '~/shared/composables/useAccordion';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import { FLOW_STAGE_KEY, FLOW_STEP_KEY } from '../../../models/injection-keys';
import type { PromptVariable } from '../../../services/step-variables/types';
import type { StepInputCapabilitiesErrors } from '../../../services/tree';
import useFlowConstructorStore from '../../../stores/constructor-store';
import type { SettingViewModelInputCapabilities } from '../../../view-models/setting.view-model';
import FlowFormStepInputParamRenderer from './FlowFormStepInputParamRenderer.vue';

type Props = {
  originalCapabilities: ModelCapabilitiesInputParams;
  errors?: StepInputCapabilitiesErrors;
};
const props = defineProps<Props>();

const { toastError } = useCustomToast();
const { isOpened, toggle } = useAccordion();

const capabilities = defineModel<SettingViewModelInputCapabilities>({
  required: true,
});

const stageInject = inject(FLOW_STAGE_KEY);
const stepInject = inject(FLOW_STEP_KEY);

const flowConstructorStore = useFlowConstructorStore();

const { promptVariables } = useFlowFormStepVariables({
  stepIndex: stepInject?.stepIndex ?? -1,
  stageIndex: stageInject?.stageIndex ?? -1,
  flowTree: flowConstructorStore.tree,
  isPublic: flowConstructorStore.isPublic,
});

const textArtifactVariables = computed(() => {
  return promptVariables.value.filter((el) => el.artifactType === 'text');
});
const binaryArtifactVariables = computed(() => {
  return promptVariables.value.filter((el) => el.artifactType !== 'text');
});

const requiredCapabilities = computed(() => {
  const result: ModelCapabilitiesInputParams = {};
  for (const [key, cap] of Object.entries(props.originalCapabilities)) {
    if (!cap.is_optional) result[key] = cap;
  }
  return result;
});

const optionalCapabilities = computed(() => {
  const result: ModelCapabilitiesInputParams = {};
  for (const [key, cap] of Object.entries(props.originalCapabilities)) {
    if (cap.is_optional) result[key] = cap;
  }
  return result;
});

/** ПРАВИЛА РАБОТЫ БИНАРНЫХ АРТЕФАКТОВ:
 * - Если это внешний артефакт, то мы устанавливаем его ID в model
 * - Если это динамический артефакт (создаём на месте), то отправляем запрос на создание артефакта
 *  и после устанавливаем его ID
 * - Если это артефакт из Step/Stage Output, то устанавливаем в model значение переменной
 */
const onBinaryParamVariableSelect = (
  variable: PromptVariable | null,
  capabilityName: string,
) => {
  const current = capabilities.value[capabilityName];
  if (
    !current ||
    current.type === 'Text' ||
    current.type === 'Setting' ||
    current.type === 'Message'
  )
    return;
  capabilities.value[capabilityName] = {
    ...current,
    value: variable?.value ?? null,
  };
};

const onBinaryParamExsistsArtifactSelect = (
  artifactId: EntityId | null,
  capabilityName: string,
) => {
  const current = capabilities.value[capabilityName];
  if (
    !current ||
    current.type === 'Text' ||
    current.type === 'Setting' ||
    current.type === 'Message'
  )
    return;
  capabilities.value[capabilityName] = {
    ...current,
    value: artifactId === null ? null : `\${artifact_${artifactId}}`,
  };
};

const onBinaryParamFileUpload = async (
  file: File | null,
  capabilityName: string,
) => {
  if (file === null) {
    onBinaryParamExsistsArtifactSelect(null, capabilityName);
    return;
  }

  try {
    const fd = new FormData();
    fd.append('file', file);

    const response = await createBinaryArtifact(fd);
    onBinaryParamExsistsArtifactSelect(response.data.id, capabilityName);
  } catch (error) {
    console.error('Ошибка при загрузке артефакта:', error);
    toastError('Ошибка при загрузке артефакта');
  }
};

const onMessageInputParamDeletePair = (
  pairIdx: number,
  capabilityName: string,
) => {
  flowConstructorStore.removeMessageInputParamError(
    stageInject?.stageIndex ?? -1,
    stepInject?.stepIndex ?? -1,
    capabilityName,
    pairIdx,
  );
};
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.flow-form-step-input-params {
  &__optional {
    display: flex;
    flex-direction: column;
    gap: 24px;

    &-title {
      display: flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
      font-size: 16px;
      font-weight: 500;

      svg {
        width: 14px;
        height: 14px;
        transform: rotate(0deg);
      }

      &--opened {
        svg {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
