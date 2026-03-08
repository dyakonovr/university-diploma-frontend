<template>
  <account-form-header @get-back="getBack" />
  <form-container>
    <input-ui
      v-model="formData.name"
      label="Название"
      :error="formErrors.name"
      :description="nameDescription"
      :input-props="{ placeholder: 'Введите название', disabled: loading }"
    />

    <select-ui
      v-model="formData.type"
      label="Тип"
      :options="ARTIFACTS_TYPE"
      :searchable="false"
      :error="formErrors.type"
      :select-props="{ disabled: loading }"
    />

    <template v-if="formData.type">
      <editor-element-ui
        v-if="formData.type === 'text'"
        v-model="formData.text"
        label="Значение"
        :disabled="loading"
        :error="formErrors.text"
      />

      <template v-else>
        <upload-file-ui
          v-model="formData.file"
          label="Файл"
          :allowed-file-extensions="allowedExtensions"
        >
          <template
            v-if="editId"
            #afterComponent>
            <artifact-download-link
              :artifact-id="editId"
              style="display: block; margin-top: 5px"
            />
          </template>
        </upload-file-ui>

        <!-- Binary artifact preview (edit mode only) -->
        <form-wrapper-ui
          v-if="editArtifact && previewType"
          label="Превью">
          <artifact-preview
            :artifact="editArtifact"
            collapsible
            max-height="400px"
          />
        </form-wrapper-ui>
      </template>
    </template>
  </form-container>
  <form-buttons
    :disabled="loading"
    @cancel="getBack"
    @submit="onSubmit" />
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import EditorElementUi from '~/components/ui/form/EditorElementUi.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import UploadFileUi from '~/components/ui/form/upload-file/UploadFileUi.vue';
import {
  ARTIFACT_BINARY_FILE_EXTENSIONS,
  ARTIFACTS_TYPE,
} from '~/domain/artifact/constants/artifact.const';
import {
  isAudioArtifact,
  isImageArtifact,
  isVideoArtifact,
} from '~/domain/artifact/services/artifact-type';
import ArtifactDownloadLink from '~/domain/artifact/ui/ArtifactDownloadLink.vue';
import ArtifactPreview from '~/domain/artifact/ui/ArtifactPreview.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';

import useArtifactForm from './_composables/useArtifactForm';

const {
  editId,
  isEditMode,
  editArtifact,
  formData,
  formErrors,
  loading,
  getData,
  onSubmit,
  getBack,
} = useArtifactForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

const previewType = computed(() => {
  if (!editArtifact.value) return null;
  if (isImageArtifact(editArtifact.value)) return 'image';
  if (isVideoArtifact(editArtifact.value)) return 'video';
  if (isAudioArtifact(editArtifact.value)) return 'audio';
  return null;
});

const nameDescription = computed(() => {
  if (formData.value.type !== 'binary' || isEditMode.value) return '';
  return 'Если поле оставить пустым, при загрузке файла в значение подставиться название файла';
});

const ALLOWED_FILE_EXTENSIONS_DICTIONARY = {
  text: [],
  binary: ARTIFACT_BINARY_FILE_EXTENSIONS,
};

const allowedExtensions = computed<string>(() => {
  if (!formData.value.type) return '';
  return (
    ALLOWED_FILE_EXTENSIONS_DICTIONARY[formData.value.type].join(',') ?? ''
  );
});

watch(
  () => formData.value.type,
  () => {
    if (formData.value.type === 'text') {
      formData.value.s3_key = null;
      formData.value.file = null;
      return;
    }

    formData.value.text = null;
  },
);

watch(
  () => formData.value.file,
  () => {
    if (
      !formData.value.file ||
      formData.value.type !== 'binary' ||
      formData.value.name ||
      isEditMode.value
    )
      return;
    formData.value.name = formData.value.file.name;
  },
);

onBeforeMount(() => {
  loading.value = true;
  Promise.all([getData()]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Артефакт' });
useAccountSeoTitle(() => formData.value.name, {
  snapshot: true,
  fallback: 'Артефакт',
});
</script>
