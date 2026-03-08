<template>
  <flow-form-prompt-editor
    v-model="model"
    v-model:search-model="artifacts.searchValue.value"
    :label="label"
    label-hint="Переменные позволяют использовать результаты генерации предыдущих шагов и этапов"
    :variables="variables"
    :additionally-props="{
      isCharactersCounterInitially: true,
      maxChars: capability?.limit_up ?? 999999,
    }"
    :error="error"
    :description="description"
    :artifact-options="artifacts.data.value || []"
    :artifacts-loading="artifacts.loading.value"
    :disabled="disabled"
    @reach-end="artifacts.getData(artifacts.meta.value.page + 1)"
    @update-search-query="artifacts.debouncedGetData(1, true)"
  />
</template>

<script lang="ts" setup>
import { getArtifacts } from '~/domain/artifact/api/artifacts.api';
import type { Artifact } from '~/domain/artifact/models/artifact.types';
import type { ModelCapabilityInputParam } from '~/domain/model/models/model.types';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';

import { cachedFetch } from '../../../services/cached-fetch';
import FlowFormPromptEditor, {
  type FlowFormPromptEditorProps,
} from './FlowFormPromptEditor.vue';

type Props = FlowFormPromptEditorProps & {
  capability?: ModelCapabilityInputParam;
};

defineProps<Props>();

const model = defineModel<string | null>();

function buildArtifactLabel(item: Artifact): string {
  if (item.name) return item.name;
  if (item.type === 'binary') {
    return item.content_type
      ? `Файл (${item.content_type})`
      : 'Файл без названия';
  }
  if (item.data) {
    const preview = item.data.replace(/<[^>]*>/g, '').slice(0, 50);
    return preview + (item.data.length > 50 ? '...' : '');
  }
  return 'Артефакт без названия';
}

const artifacts = useSelectInfiniteScroll<Artifact>({
  mapFunc: (item) => ({
    label: buildArtifactLabel(item),
    value: `\${artifact_${item.id}}`,
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
    type: 'text',
    group_id: 'null', // Только общие артефакты
  }),
});

onBeforeMount(() => {
  artifacts.getData(1);
});
</script>
