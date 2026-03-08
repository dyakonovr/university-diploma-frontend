<template>
  <editor-element-ui
    v-model="content"
    v-bind="$attrs"
    :custom-settings="customSettings"
  />

  <dialog-ui
    v-model="dialogVisible"
    title="Загрузить изображение"
    :auto-close-on-confirm="false"
    @confirm="onUploadConfirm"
  >
    <div class="news-content-editor__dialog">
      <upload-file-ui
        v-model="imageFile"
        label="Файл"
        allowed-file-extensions="png,jpg,jpeg,gif,webp"
      />
      <input-ui
        v-model="imageAlt"
        label="Alt-текст"
        description="Он будет отображён, если возникнут проблемы со скачиванием картинки"
        :input-props="{ placeholder: 'Описание изображения' }"
      />
    </div>
  </dialog-ui>
</template>

<script lang="ts" setup>
import type { Editor } from 'public/libs/tinymce-v7/tinymce';

import DialogUi from '~/components/ui/DialogUi.vue';
import EditorElementUi from '~/components/ui/form/EditorElementUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import UploadFileUi from '~/components/ui/form/upload-file/UploadFileUi.vue';
import { updateImage } from '~/domain/news/api/news.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';

const content = defineModel<string | null>();

const { toastError } = useCustomToast();

const editor = ref<Editor | null>(null);
const dialogVisible = ref(false);
const imageFile = ref<File | null>(null);
const imageAlt = ref('');

const customSettings = {
  height: 500,
  setup(ed: Editor) {
    editor.value = ed;

    ed.ui.registry.addButton('upload-image', {
      icon: 'image',
      tooltip: 'Загрузить изображение',
      onAction: () => {
        imageFile.value = null;
        imageAlt.value = '';
        dialogVisible.value = true;
      },
    });
  },
  toolbar:
    'undo redo | blocks | bold italic underline strikethrough | bullist numlist outdent indent | link table | upload-image | code',
};

async function onUploadConfirm(done: () => void) {
  if (!imageFile.value) {
    toastError('Выберите изображение');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', imageFile.value);

    const response = await updateImage(formData);

    if (editor.value) {
      const alt = imageAlt.value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      editor.value.insertContent(
        `<img src="${response.data.url}" alt="${alt}" />`,
      );
    }

    done();
  } catch {
    toastError('Ошибка загрузки изображения');
  }
}
</script>

<style lang="scss">
.news-content-editor {
  &__dialog {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
