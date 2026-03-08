<template>
  <div class="post-all-artifacts form-container-padding">
    <p class="text-14 weight-600">Все артефакты</p>

    <button-ui
      v-if="isButtonShowed && !loading"
      variant="outlined"
      color="accent"
      @click="onFetchButtonClick"
    >
      Запросить все артефакты
    </button-ui>

    <div
      v-if="loading && !artifacts.length"
      class="post-all-artifacts__loading"
    >
      Загрузка артефактов...
    </div>

    <span
      v-if="error"
      class="post-all-artifacts__error">{{ error }}</span>

    <draggable
      v-if="artifacts.length"
      v-model="artifacts"
      class="post-all-artifacts__list"
      item-key="id"
      handle=".artifact-drag"
      :disabled="isAnyEditing"
      @end="onReorderArtifacts"
    >
      <template #item="{ element }">
        <raw-post-form-all-artifacts-list-item
          :artifact="element"
          :state="stateMap[element.id]"
          @update-text="onUpdateTextArtifact"
          @edit-start="isAnyEditing = true"
          @edit-end="isAnyEditing = false"
        />
      </template>
    </draggable>
  </div>
</template>

<script lang="ts" setup>
import Draggable from 'vuedraggable';

import ButtonUi from '~/components/ui/ButtonUi.vue';
import type { RawPostBlock } from '~/domain/raw-post/models/raw-post.types';

import useRawPostFormAllArtifacts from '../../_composables/useRawPostFormAllArtifacts';
import { useRawPostStore } from '../../_stores/raw-post-form';
import RawPostFormAllArtifactsListItem from './RawPostFormAllArtifactsListItem.vue';

type Props = {
  postBlocks: RawPostBlock[];
};
const props = defineProps<Props>();

const postStore = useRawPostStore();

const isButtonShowed = computed(() => {
  return (
    props.postBlocks.length !== Object.keys(postStore.artifactsByBlock).length
  );
});
// Карта состояний для быстрого доступа
const stateMap = computed(() => postStore.artifactStates);

const {
  loading,
  error,
  artifacts,
  isAnyEditing,
  fetchAllArtifacts,
  initArtifacts,
  onReorderArtifacts,
  onUpdateTextArtifact,
} = useRawPostFormAllArtifacts();

const onFetchButtonClick = () =>
  fetchAllArtifacts(props.postBlocks.map((b) => b.id));

watch(
  () => postStore.artifactsByBlock,
  () => {
    initArtifacts(props.postBlocks);
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  onFetchButtonClick();
});
</script>

<style scoped lang="scss">
.post-all-artifacts {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
</style>
