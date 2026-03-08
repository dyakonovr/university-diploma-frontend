<template>
  <div
    v-if="previewType"
    class="artifact-preview">
    <!-- Collapsible mode: placeholder + eye toggle -->
    <template v-if="collapsible">
      <div
        class="artifact-preview__container"
        :class="{ 'artifact-preview__container--open': isShowed }"
      >
        <template v-if="!isShowed">
          <span>{{ fileTypeText }}</span>
          <small>Для просмотра нажмите на кнопку в правом верхнем углу</small>
        </template>

        <div
          v-show="isShowed"
          class="artifact-preview__media"
          :style="{ maxWidth }"
        >
          <img
            v-show="previewType === 'image'"
            :src="previewSrc"
            alt="Превью изображения"
            class="artifact-preview__image"
            :style="{ maxWidth, maxHeight }"
          >

          <video
            v-show="previewType === 'video'"
            :src="previewSrc"
            controls
            class="artifact-preview__video"
            :style="{ maxWidth, maxHeight }"
          />

          <audio
            v-show="previewType === 'audio'"
            :src="previewSrc"
            controls
            class="artifact-preview__audio"
          />
        </div>

        <button-ui
          size="icon"
          class="artifact-preview__toggle-button"
          @click="isShowed = !isShowed"
        >
          <eye-icon v-if="!isShowed" />
          <eye-crossed-icon v-else />
        </button-ui>
      </div>
    </template>

    <!-- Simple mode: media only -->
    <template v-else>
      <img
        v-show="previewType === 'image'"
        :src="previewSrc"
        alt="Превью изображения"
        class="artifact-preview__image"
        :style="{ maxWidth, maxHeight }"
      >

      <video
        v-show="previewType === 'video'"
        :src="previewSrc"
        controls
        class="artifact-preview__video"
        :style="{ maxWidth, maxHeight }"
      />

      <audio
        v-show="previewType === 'audio'"
        :src="previewSrc"
        controls
        class="artifact-preview__audio"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import EyeIcon from '@/assets/images/icons/eye.svg';
import EyeCrossedIcon from '@/assets/images/icons/eye-crossed.svg';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import type { Artifact } from '~/domain/artifact/models/artifact.types';
import {
  isAudioArtifact,
  isImageArtifact,
  isVideoArtifact,
} from '~/domain/artifact/services/artifact-type';
import { API_BASES, API_PREFIX } from '~/shared/utils/core/request.client';

type Props = {
  artifact: Artifact;
  /** Override preview URL (e.g. blob URL from store state) */
  src?: string | null;
  maxWidth?: string;
  maxHeight?: string;
  /** Enable show/hide toggle with placeholder */
  collapsible?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  src: null,
  maxWidth: '100%',
  maxHeight: '200px',
  collapsible: false,
});

const isShowed = ref(false);

const downloadUrl = computed(
  () =>
    `${API_BASES.FLOW}${API_PREFIX}/artifacts/${props.artifact.id}/download`,
);

const previewSrc = computed(() => props.src || downloadUrl.value);

const previewType = computed(() => {
  if (isImageArtifact(props.artifact)) return 'image';
  if (isVideoArtifact(props.artifact)) return 'video';
  if (isAudioArtifact(props.artifact)) return 'audio';
  return null;
});

const fileTypeText = computed(() => {
  if (isImageArtifact(props.artifact)) return 'Изображение';
  if (isVideoArtifact(props.artifact)) return 'Видеофайл';
  if (isAudioArtifact(props.artifact)) return 'Аудиофайл';
  return 'Двоичный файл';
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.artifact-preview {
  &__image {
    object-fit: contain;
    border-radius: 8px;
    display: block;
  }

  &__video {
    border-radius: 8px;
    display: block;
  }

  &__audio {
    width: 100%;
    display: block;
  }

  &__container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    min-height: 120px;
    border: 2px dashed colors.$border;
    border-radius: 8px;
    color: colors.$text-light;
    background: colors.$white;
    padding: 16px;

    small {
      font-size: 12px;
      opacity: 0.7;
    }

    &--open {
      height: auto;
      border-style: solid;
    }
  }

  &__media {
    width: 100%;
  }

  &__toggle-button {
    position: absolute;
    right: 8px;
    top: 8px;
  }
}
</style>
