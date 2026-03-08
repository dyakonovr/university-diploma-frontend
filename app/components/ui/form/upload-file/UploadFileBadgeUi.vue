<template>
  <div class="uploaded-file-badge">
    <div class="uploaded-file-badge__icon">
      <loading-icon
        v-if="loading"
        class="uploaded-file-badge__loading" />
      <file-icon v-else />
    </div>
    <div class="uploaded-file-badge__content">
      <p class="uploaded-file-badge__title text-14 weight-500">
        {{ fileName }}
      </p>
      <p class="uploaded-file-badge__type text-12">
        {{ readableSize }}, {{ extension.toUpperCase() }} File
      </p>
    </div>
    <div class="uploaded-file-badge__buttons">
      <!-- <button-ui
        v-if="dowloadLink"
        variant="muted"
        tag="a"
        :href="dowloadLink"
        class="uploaded-file-badge__button"
      >
        <download-icon />
      </button-ui> -->
      <button-ui
        class="uploaded-file-badge__button"
        @click="emit('removeFile')"
      >
        <trash-icon />
      </button-ui>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// import DownloadIcon from '@/assets/icons/download.svg';
import FileIcon from '@/assets/images/icons/file.svg';
import TrashIcon from '@/assets/images/icons/trash.svg';

import ButtonUi from '../../ButtonUi.vue';
import type { UploadFileUiModel } from './UploadFileUi.vue';
// import LoadingIcon from '@/components/LoadingIcon.vue';

type Props = {
  file: UploadFileUiModel;
  dowloadLink?: string | null;
  loading?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'removeFile'): void;
}>();

const fileName = computed(() => {
  // если это File из браузера
  // if (props.file instanceof window.File) {

  // }
  return props.file?.name ?? '';

  // если это объект из API
  // return (props.file as ApiFile).original_filename || null;
});

const readableSize = computed(() => {
  let bytes = 0;

  // если это File из браузера
  if (props.file instanceof window.File) {
    bytes = props.file.size;
  }
  // else {
  //   // если это объект из API
  //   bytes = (props.file as ApiFile).size || 0;
  // }

  if (bytes === 0) return '0 Б';
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
});

const extension = computed(() => {
  let name = '';
  // если это File из браузера
  if (props.file instanceof window.File) {
    name = props.file.name;
  }
  // else {
  //   name = (props.file as ApiFile).original_filename;
  // }

  const splittedName = name.split('.');
  // если это объект из API
  return splittedName[splittedName.length - 1] ?? '';
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/components/form' as form;

.uploaded-file-badge {
  display: flex;
  gap: 12px;
  padding: 12px 8px 12px 12px;
  border: 1px solid form.$form-item-border-color;
  border-radius: form.$form-item-border-radius;
  background-color: colors.$white;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 4px;
    background-color: colors.$border;

    svg {
      width: 26px;
      height: 26px;
      color: #bbbdc0;
    }
  }

  // &__loading {
  //   color: colors.$primary;
  // }

  &__content {
    flex: 1;
  }

  &__title {
    color: colors.$black;
    overflow-wrap: break-word;
  }

  &__type {
    font-size: 14px;
    line-height: 20px;
    color: colors.$text-light;
  }

  &__buttons {
    display: flex;
    align-items: center;
    gap: 8px;

    @media screen and (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__button {
    padding: 8px !important;
    height: 32px !important;
    color: #bbbdc0;
    background-color: colors.$border;
    border-color: colors.$border;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
}
</style>
