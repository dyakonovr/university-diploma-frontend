<template>
  <form-wrapper v-bind="props">
    <tiny-editor-component
      v-model="model"
      api-key="s8ye2vcmj08ilx91oyf0rn259zae6enys7n73w1dawu0lx48"
      :init="mergedSettings" />
  </form-wrapper>
</template>

<script lang="ts" setup>
import TinyEditorComponent from '@tinymce/tinymce-vue';
import FormWrapper, { type FormWrapperProps } from './FormWrapper.vue';
import type Editor from '@tinymce/tinymce-vue';

// @types/tinymce не обновлялись 2 года
interface TinyMCESettings {
  height?: number;
  body_class?: string;
  plugins?: string;
  toolbar?: string | string[] | boolean;
  menubar?: string | boolean;
  block_formats?: string;
  content_css?: string;
  skin_url?: string;
  branding?: boolean;
  promotion?: boolean;
  language_url?: string;
  language?: string;
  readonly?: boolean;
  disabled?: boolean;
  editable_root?: boolean;
  setup?: (editor: typeof Editor) => void;
  init_instance_callback?: (editor: typeof Editor) => void;
}

interface TinyMCEAdditionallyProps {
  isCharactersCounterInitially: boolean;
}

type NewEditorElementProps = FormWrapperProps & { customSettings?: TinyMCESettings; additionallyProps?: TinyMCEAdditionallyProps };

const model = defineModel<string>();
const props = defineProps<NewEditorElementProps>();

const defaultSettings: TinyMCESettings = {
  height: 500,
  plugins:
    'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code insertdatetime media table code wordcount fullscreen',
  toolbar:
    'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table | fullscreen',
  menubar: 'file edit view insert format tools help',
  block_formats: 'Абзац=p; Заголовок 1=h1; Заголовок 2=h2; Заголовок 3=h3',
  branding: false,
  promotion: false,
  disabled: false,
  readonly: false,
  editable_root: true,
  language: 'ru',
  setup: (editor: typeof Editor) => {
    editor.on('input', () => {
      model.value = editor.getContent();
    });
   
    props.customSettings?.setup?.(editor);
  },
  init_instance_callback(editor: typeof Editor) {
    if (props.additionallyProps?.isCharactersCounterInitially) {
      // Меняем текст с подсчётом слов на подсчёт символов
      const wordcountEl = editor.getContainer().querySelector('.tox-statusbar__wordcount') as HTMLButtonElement;
      if (!wordcountEl) return;
      wordcountEl.click();
    }
  },
};

const mergedSettings = computed(() => ({
  ...defaultSettings,
  ...props.customSettings,
}));
</script>