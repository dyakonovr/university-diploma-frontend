<template>
  <form-wrapper-ui v-bind="$props">
    <div class="binary-artifact-input">
      <!-- Mode selector -->
      <div class="binary-artifact-input__modes">
        <radio-ui
          v-model="mode"
          value="variable"
          label="Использовать результат прошлого шага/этапа"
          :disabled="disabled"
        />

        <radio-ui
          v-model="mode"
          value="upload"
          label="Загрузить файл"
          :disabled="disabled"
        />

        <radio-ui
          v-model="mode"
          value="exists_artifact"
          label="Выбрать существующий артефакт"
          :disabled="disabled"
        />

        <radio-ui
          v-if="optional"
          v-model="mode"
          value="empty"
          label="Не использовать"
          :disabled="disabled"
        />
      </div>

      <!-- Variable select -->
      <select-ui
        v-if="mode === 'variable'"
        v-model="selectedVariable"
        :searchable="false"
        :options="availableVariables"
        :select-props="{ disabled }"
        @update:model-value="onVariableSelect($event as string | null)"
      />

      <!-- File upload -->
      <upload-file-ui
        v-if="mode === 'upload'"
        v-model="file"
        :accept="accept"
        :disabled="disabled"
        @update:model-value="onFileUpload"
      />

      <!-- Exists Artifact -->
      <select-ui
        v-if="mode === 'exists_artifact'"
        v-model="selectedGeneralArtifact"
        v-model:search-query="artifacts.searchValue.value"
        :options="artifacts.data.value || []"
        :select-props="{
          placeholder: 'Выберите артефакт',
          disabled: artifacts.loading.value || disabled,
        }"
        @update:model-value="onExistsArtifactChange($event as EntityId | null)"
        @reach-end="artifacts.getData(artifacts.meta.value.page + 1)"
        @update:search-query="artifacts.debouncedGetData(1, true)"
      />
    </div>
  </form-wrapper-ui>
</template>

<script lang="ts" setup>
import type { FormWrapperProps } from '~/components/ui/form/FormWrapperUi.vue';
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import RadioUi from '~/components/ui/form/RadioUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import UploadFileUi from '~/components/ui/form/upload-file/UploadFileUi.vue';
import { getArtifacts } from '~/domain/artifact/api/artifacts.api';
import type { Artifact } from '~/domain/artifact/models/artifact.types';
import type { ModelCapabilityBinaryInputParamType } from '~/domain/model/models/model.types';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import { cachedFetch } from '../../../services/cached-fetch';
import type { PromptVariable } from '../../../services/step-variables/types';

type Props = FormWrapperProps & {
  artifactType: ModelCapabilityBinaryInputParamType;
  promptVariables: PromptVariable[];
  optional?: boolean;
  disabled?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select-variable', variable: PromptVariable | null): void;
  (e: 'select-exists-artifact', artifactId: EntityId | null): void;
  (e: 'upload-file', file: File | null): void;
  (e: 'clear'): void;
}>();

type Mode = 'variable' | 'upload' | 'exists_artifact' | 'empty';

const mode = ref<Mode>(props.optional ? 'empty' : 'variable');
const selectedVariable = ref<PromptVariable | null>(null);
const selectedGeneralArtifact = ref<EntityId | null>(null);
const file = ref<File | null>(null);

/**
 * доступные переменные по типу
 */
const availableVariables = computed(() =>
  props.promptVariables.filter(
    (v) => v.artifactType === props.artifactType.toLowerCase(),
  ),
);

/**
 * accept для Upload
 */
const accept = computed(() => {
  switch (props.artifactType) {
    case 'Photo':
      return 'image/*';
    case 'Audio':
      return 'audio/*';
    case 'Video':
      return 'video/*';
    default:
      return '';
  }
});

const artifactContentType = computed(() => {
  switch (props.artifactType) {
    case 'Photo':
      return 'image';
    case 'Audio':
      return 'audio';
    case 'Video':
      return 'video';
    default:
      return null;
  }
});

const artifacts = useSelectInfiniteScroll<Artifact>({
  mapFunc: (item) => ({
    label: `${item.name ?? 'Название не указано'}, тип: ${item.type}${item.type === 'binary' ? `, Content type: ${item.content_type}` : ''}`,
    value: item.id,
  }),
  requestFunc: (params, signal) =>
    cachedFetch({
      entity: 'artifacts',
      params,
      request: () => getArtifacts(params, signal),
    }),
  errorMessage: 'Ошибка при получении артефактов',
  requestParams: (_, searchValue) => ({
    name: searchValue,
    type: 'binary',
    content_type: artifactContentType.value,
    group_id: null, // Только общие артефакты
  }),
});

/**
 * emits
 */
const onVariableSelect = (variableValue: string | null) => {
  const variable = props.promptVariables.find(
    (el) => el.value === variableValue,
  );
  emit('select-variable', variable ?? null);
};

const onFileUpload = (file: File | null) => {
  emit('upload-file', file);
};

const onExistsArtifactChange = (artifactId: EntityId | null) => {
  emit('select-exists-artifact', artifactId);
};

/**
 * очистка при смене режима
 */
watch(mode, () => {
  selectedVariable.value = null;
  file.value = null;
  emit('clear');
});

onBeforeMount(() => {
  artifacts.getData(1);
});
</script>

<style lang="scss">
.binary-artifact-input {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__modes {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
