<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <form-wrapper-ui
    :label="label"
    :label-hint="labelHint"
    :direction="direction"
    :description="description"
    :form-wrapper-class="formWrapperClass"
    :error="error || $props.error"
  >
    <div
      v-if="!file"
      class="upload-file"
      :class="{
        error: isError || error || $props.error,
        'is-dragover': isDragOver,
        'upload-file__wrapper--disabled': disabled,
        'upload-file__wrapper--with-file': file,
      }"
      tabindex="0"
      @click="triggerFileInput"
      @keydown.enter="triggerFileInput"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        ref="fileInput"
        type="file"
        class="upload-file__input"
        :accept="
          allowedFileExtensions
            ?.split(',')
            .map((el: string) => `.${el}`)
            .join(',')
        "
        @change="handleFileChange"
      >
      <p class="upload-file__title text-14">
        <span class="upload-file__title-highlight">Выберите файл </span>
        <span class="mobile-hide">или перетащите его в данную область</span>
      </p>
      <div
        v-if="file"
        class="upload-file__buttons">
        <button
          class="upload-file__button"
          @click.stop="removeFile">
          Удалить
        </button>
      </div>
    </div>
    <upload-file-badge
      v-else
      :file="file"
      :dowload-link="downloadLink"
      :loading="loading"
      @remove-file="removeFile"
    />
    <slot name="afterComponent" />
  </form-wrapper-ui>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useCustomToast } from '~/shared/composables/useCustomToast';

import FormWrapperUi, { type FormWrapperProps } from '../FormWrapperUi.vue';
import UploadFileBadge from './UploadFileBadgeUi.vue';

export type UploadFileProps = {
  isError?: boolean;
  disabled?: boolean;
  /** Example value: "png,jpg,svg" */
  allowedFileExtensions?: string | null;
  downloadLink?: string | null;
};

type Props = FormWrapperProps & UploadFileProps;

export type UploadFileBaseExposables = {
  clearInput: () => void;
};

export type UploadFileUiModel = File | null;

const props = withDefaults(defineProps<Props>(), {
  allowedFileExtensions: '',
  downloadLink: '',
});

const emit = defineEmits<{
  (e: 'file-uploaded', file: UploadFileUiModel, err: string | null): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const loading = ref<boolean>(false);
const file = defineModel<UploadFileUiModel>({ default: null });
const error = defineModel<string | null>('error', { default: null });

const { toastError } = useCustomToast();

const triggerFileInput = () => {
  if (props.disabled || loading.value) return;
  fileInput.value?.click();
};

const onDragOver = () => {
  if (props.disabled || loading.value) return;
  isDragOver.value = true;
};

const onDragLeave = () => {
  if (props.disabled || loading.value) return;
  isDragOver.value = false;
};

const handleFiles = async (files: FileList) => {
  if (props.disabled || loading.value) return;

  error.value = null;

  if (files.length === 0) return;

  loading.value = true;

  const uploadedFile = files[0];

  if (props.allowedFileExtensions && uploadedFile) {
    const allowed = props.allowedFileExtensions
      .split(',')
      .map((ext) => ext.trim().toLowerCase());

    const fileExt = uploadedFile.name.split('.').pop()?.toLowerCase() || '';

    if (!allowed.includes(fileExt)) {
      const errorText = `Неверный формат файла. Разрешено: ${allowed.join(', ')}`;
      if (!file.value) error.value = errorText;
      else toastError(errorText);

      emit('file-uploaded', file.value, error.value);
      loading.value = false;
      return;
    }
  }

  file.value = uploadedFile ?? null;

  emit('file-uploaded', uploadedFile ?? null, null);
  loading.value = false;
};

const onDrop = (e: DragEvent) => {
  if (props.disabled || loading.value) return;

  isDragOver.value = false;
  if (e.dataTransfer?.files) {
    handleFiles(e.dataTransfer.files);
  }
};

const handleFileChange = (e: Event) => {
  if (props.disabled || loading.value) return;

  const input = e.target as HTMLInputElement;
  if (input.files) {
    handleFiles(input.files);
  }
};

const clearInput = () => {
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const removeFile = () => {
  file.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  emit('file-uploaded', null, null);
};

defineExpose<UploadFileBaseExposables>({
  clearInput,
});
</script>

<style scoped lang="scss">
@use '/assets/styles/base/colors' as colors;

.mobile-hide {
  @media screen and (max-width: 768px) {
    display: none;
  }
}

.upload-file {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 22px 40px;
  min-height: 100px;
  border-radius: 8px;
  background-color: colors.$white;
  transition:
    background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  position: relative;

  border: 1px dashed #bbbdc0;
  outline-color: #bbbdc0;
  cursor: pointer;

  @media screen and (max-width: 576px) {
    padding: 16px;
  }

  &:not(.upload-file--disabled):not(.upload-file--with-file) {
    &.is-dragover,
    &:focus,
    &:hover {
      cursor: copy;
      background-color: #72c3150d;
    }
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--with-file {
    border-style: solid;
    background-color: transparent;
  }

  &.error {
    border-color: colors.$danger !important;
  }

  &__title {
    text-align: center;

    &-highlight {
      color: colors.$primary;
    }
  }

  &__input {
    display: none;
  }
}
</style>
