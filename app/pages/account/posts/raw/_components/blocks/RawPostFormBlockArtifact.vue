<template>
  <div
    class="post-block-artifact"
    :class="`type-${artifact.type}`">
    <!-- <pre>{{ JSON.stringify(artifact, undefined, 2) }}</pre> -->

    <div class="post-block-artifact__header">
      <div class="post-block-artifact__icon">
        <div class="post-block-artifact__icon-inner">
          <span v-if="artifact.type === 'text'">T</span>
          <span v-else-if="isImage">🖼️</span>
          <span v-else-if="isVideo">🎬</span>
          <span v-else-if="isAudio">🎵</span>
          <span v-else>📄</span>
        </div>
      </div>
      <div class="post-block-artifact__info">
        <h6 class="post-block-artifact__name">
          {{ formatArtifactType(artifact) }}
        </h6>
        <span class="post-block-artifact__meta">
          <span
            v-if="artifact.created_at"
            class="post-block-artifact__date">
            {{ formatDate(artifact.created_at) }}
          </span>
        </span>
      </div>
    </div>

    <div class="post-block-artifact__content">
      <!-- Текстовый артефакт -->
      <div
        v-if="artifact.type === 'text' && artifact.data"
        class="post-block-artifact__text"
      >
        <expandable-text
          :max-length="MAX_TEXT_ARTIFACT_INITIAL_SYMBOLS"
          :text="artifact.data"
        />
      </div>

      <!-- Бинарный артефакт -->
      <div
        v-else
        class="post-block-artifact__binary">
        <div class="post-block-artifact__file-info">
          <span class="post-block-artifact__file-type">
            {{ getFileTypeText(artifact) }}
          </span>
          <span
            v-if="artifact.content_type"
            class="post-block-artifact__content-type"
          >
            {{ artifact.content_type }}
          </span>
        </div>

        <artifact-preview
          v-if="isPreviewAvailable"
          :artifact="artifact"
          collapsible
          :max-width="BLOCK_BINARY_ARTIFACT_MAX_WIDTH"
        />

        <div class="post-block-artifact__actions">
          <!-- Кнопка скачивания -->
          <button-ui
            variant="outlined"
            color="primary"
            :disabled="!!state?.error"
            @click="downloadArtifactOnDisk()"
          >
            Скачать файл
          </button-ui>

          <span
            v-if="state?.error"
            class="post-block-artifact__no-file">
            Файл недоступен
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ExpandableText from '~/components/ExpandableText.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import type { Artifact } from '~/domain/artifact/models/artifact.types';
import {
  isAudioArtifact,
  isImageArtifact,
  isVideoArtifact,
} from '~/domain/artifact/services/artifact-type';
import ArtifactPreview from '~/domain/artifact/ui/ArtifactPreview.vue';

import { BLOCK_BINARY_ARTIFACT_MAX_WIDTH } from '../../_constants/binary-artifact.const';
import { useRawPostStore } from '../../_stores/raw-post-form';

type Props = {
  artifact: Artifact;
};

const props = defineProps<Props>();

const postStore = useRawPostStore();
const state = computed(() => postStore.getArtifactState(props.artifact.id));

const MAX_TEXT_ARTIFACT_INITIAL_SYMBOLS = 1000;

const isImage = computed(() => isImageArtifact(props.artifact));
const isVideo = computed(() => isVideoArtifact(props.artifact));
const isAudio = computed(() => isAudioArtifact(props.artifact));

const isPreviewAvailable = computed(
  () => isImage.value || isVideo.value || isAudio.value,
);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Форматирование типа артефакта
const formatArtifactType = (artifact: Artifact) => {
  if (artifact.type === 'text') return 'Текстовый артефакт';

  if (isImage.value) return 'Изображение';
  if (isVideo.value) return 'Видео';
  if (isAudio.value) return 'Аудио';
  if (artifact.content_type?.startsWith('application/pdf'))
    return 'PDF документ';

  return 'Файл';
};

// Текст для типа файла
const getFileTypeText = (artifact: Artifact) => {
  if (isImage.value) return 'Изображение';
  if (isVideo.value) return 'Видеофайл';
  if (isAudio.value) return 'Аудиофайл';
  if (artifact.content_type?.includes('pdf')) return 'PDF документ';
  if (artifact.content_type?.includes('text')) return 'Текстовый файл';
  if (artifact.content_type?.includes('json')) return 'JSON файл';

  return 'Двоичный файл';
};

// Скачать файл на диск
const downloadArtifactOnDisk = async () => {
  if (!state.value) return;

  const blob = await postStore.fetchArtifactBlob(
    props.artifact.id!,
    state.value,
  );
  if (!blob || !state.value?.previewUrl) return;

  const a = document.createElement('a');
  a.href = state.value.previewUrl;
  a.download = props.artifact.name || 'file';
  a.click();
};
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.post-block-artifact {
  border: 1px solid colors.$border;
  border-radius: 8px;
  padding: 16px;
  background: colors.$background;

  &.type-text {
    border-left: 3px solid colors.$primary;
  }

  &.type-binary {
    border-left: 3px solid colors.$accent;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  &__icon {
    flex-shrink: 0;
  }

  &__icon-inner {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: colors.$primary-light;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: colors.$white;
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-size: 15px;
    font-weight: 500;
    color: colors.$text;
    margin: 0 0 4px 0;
  }

  &__meta {
    font-size: 12px;
    color: colors.$text-light;
  }

  &__content {
    margin-top: 12px;
  }

  &__text {
    background: colors.$white;
    border: 1px solid colors.$border;
    border-radius: 6px;
    padding: 12px;
  }

  &__text-content {
    margin: 0 0 8px 0;
    font-size: 14px;
    line-height: 1.5;
    color: colors.$text;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__binary {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__file-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__file-type {
    font-size: 14px;
    font-weight: 500;
    color: colors.$text;
  }

  &__content-type {
    font-size: 12px;
    color: colors.$text-light;
    font-family: monospace;
  }

  &__actions {
    display: flex;
    gap: 8px;
  }

  &__no-file {
    font-size: 14px;
    color: colors.$text-light;
    font-style: italic;
  }

  &__loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
    color: colors.$text-light;

    p {
      animation: pulse 1.5s infinite;
    }
  }
}
</style>
