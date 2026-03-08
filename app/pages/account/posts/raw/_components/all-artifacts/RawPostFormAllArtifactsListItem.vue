<template>
  <div class="all-artifacts-item artifact-drag">
    <button
      type="button"
      class="artifact-drag-handle">⋮⋮</button>

    <!-- Текстовый артефакт -->
    <div
      v-if="artifact.type === 'text' && artifact.data"
      ref="artifactTextRef"
      class="artifact-text"
    >
      <!-- Режим просмотра -->
      <pre
        v-if="!isEditing"
        ref="preRef"
        class="artifact-text__pre"
        @click="startEditing"
      >{{ artifact.data }}</pre
      >

      <!-- Режим редактирования -->
      <template v-else>
        <textarea
          ref="textareaRef"
          v-model="editText"
          class="artifact-text__textarea"
          :style="{ height: textareaHeight }"
          @keydown.escape="onCancel"
          @keydown.enter.exact.prevent="onSave"
        />

        <div class="artifact-text__actions">
          <button-ui
            size="small"
            @click="onSave">Сохранить</button-ui>

          <button-ui
            size="small"
            variant="outlined"
            @click="onCancel"
          >Отменить</button-ui
          >
        </div>
      </template>
    </div>

    <!-- Бинарный артефакт -->
    <div
      v-else
      class="artifact-binary"
      :style="{ maxWidth: ALL_ARTIFACTS_BINARY_ARTIFACT_MAX_WIDTH }"
    >
      <artifact-preview
        :artifact="artifact"
        :src="state?.previewUrl" />

      <div class="artifact-actions">
        <span
          v-if="state?.error"
          class="artifact-error">
          {{ state?.error }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

import ButtonUi from '~/components/ui/ButtonUi.vue';
import type { Artifact } from '~/domain/artifact/models/artifact.types';
import ArtifactPreview from '~/domain/artifact/ui/ArtifactPreview.vue';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import { ALL_ARTIFACTS_BINARY_ARTIFACT_MAX_WIDTH } from '../../_constants/binary-artifact.const';
import type { ArtifactState } from '../../_stores/raw-post-form';

type Props = {
  artifact: Artifact;
  state?: ArtifactState;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  'update-text': [artifactId: EntityId, newText: string];
  'edit-start': [];
  'edit-end': [];
}>();

const isEditing = ref(false);
const editText = ref('');
const textareaHeight = ref('auto');
const preRef = ref<HTMLPreElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const artifactTextRef = ref<HTMLDivElement | null>(null);

const startEditing = () => {
  editText.value = props.artifact.data ?? '';

  if (preRef.value) {
    textareaHeight.value = `${preRef.value.offsetHeight}px`;
  }

  isEditing.value = true;
  emit('edit-start');

  nextTick(() => {
    textareaRef.value?.focus();
  });
};

const onSave = () => {
  emit('update-text', props.artifact.id, editText.value);
  isEditing.value = false;
  emit('edit-end');
};

const onCancel = () => {
  isEditing.value = false;
  emit('edit-end');
};

onClickOutside(artifactTextRef, () => {
  if (isEditing.value) onCancel();
});
</script>

<style lang="scss">
.all-artifacts-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 6px;
  background: #fafafa;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  .artifact-drag-handle {
    cursor: grab;
    opacity: 0.6;
  }

  .artifact-text {
    flex: 1;
    min-width: 0;
  }

  .artifact-text__pre {
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
    cursor: pointer;
    padding: 8px;
    border: 1px solid transparent;
    border-radius: 4px;
    font-size: 14px;
    line-height: 1.5;

    &:hover {
      border-color: #ddd;
      background: #f5f5f5;
    }
  }

  .artifact-text__textarea {
    width: 100%;
    min-height: 80px;
    resize: vertical;
    border: 1px solid #999;
    border-radius: 4px;
    padding: 8px;
    font-family: inherit;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: #666;
    }
  }

  .artifact-text__actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .artifact-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    align-items: center;
  }

  .artifact-error {
    color: red;
    font-size: 12px;
  }
}
</style>
