<template>
  <form-wrapper v-bind="props">
    <tiny-editor-component
      v-model="model"
      :init="mergedSettings"
      tinymce-script-src="/libs/tinymce-v7/tinymce.min.js"
      :api-key="apiKey"
      :disabled="disabled"
    />
  </form-wrapper>
</template>

<script lang="ts" setup>
import TinyEditorComponent from '@tinymce/tinymce-vue';
import type { Editor } from 'public/libs/tinymce-v7/tinymce';
import { computed } from 'vue';

import type { FormItemEditorElementProps } from '~/shared/types/ui/form.components.types';

import FormWrapper, { type FormWrapperProps } from './FormWrapperUi.vue';

const apiKey = import.meta.env.VITE_TINY_MCE_API_KEY;

// @types/tinymce не обновлялись 2+ года
type TinyMCESettings = {
  height?: number;
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
  setup?: (editor: Editor) => void;
  init_instance_callback?: (editor: Editor) => void;
  noneditable_class?: string;
  content_style?: string;
};

type TinyMCEAdditionallyProps = {
  maxChars?: number;
  isCharactersCounterInitially?: boolean;
};

export type NewEditorElementProps = FormWrapperProps &
  FormItemEditorElementProps & {
    customSettings?: TinyMCESettings;
    additionallyProps?: TinyMCEAdditionallyProps;
  };

const model = defineModel<string | null>();
const props = defineProps<NewEditorElementProps>();

const defaultSettings: TinyMCESettings = {
  height: 300,
  plugins:
    'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code insertdatetime media table code wordcount',
  toolbar:
    'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table | code',
  menubar: 'file edit view insert format tools help',
  block_formats: 'Абзац=p; Заголовок 1=h1; Заголовок 2=h2; Заголовок 3=h3',
  content_css: '/libs/tinymce-v7/skins/content/default/content.css',
  skin_url: '/libs/tinymce-v7/skins/ui/oxide',
  branding: false,
  promotion: false,
  language_url: '/libs/tinymce-v7/ru.js',
  language: 'ru',
  setup: (editor: Editor) => {
    editor.on('input', () => {
      model.value = editor.getContent();
    });

    props.customSettings?.setup?.(editor);

    const MAX = props.additionallyProps?.maxChars;

    const getLength = () => editor.getContent({ format: 'text' }).length;

    editor.on('BeforeInput', (e: Editor) => {
      if (!e.data) return;
      if (MAX !== undefined && getLength() + e.data.length > MAX) {
        e.preventDefault();
      }
    });

    editor.on('PastePreProcess', (e: Editor) => {
      if (MAX !== undefined) {
        const allowed = MAX - getLength();
        if (allowed <= 0) {
          e.preventDefault();
        } else {
          e.content = e.content.substring(0, allowed);
        }
      }
    });
  },
  init_instance_callback(editor: Editor) {
    if (props.additionallyProps?.isCharactersCounterInitially) {
      // Меняем текст с подсчётом слов на подсчёт символов
      const wordcountEl = editor
        .getContainer()
        .querySelector('.tox-statusbar__wordcount') as HTMLButtonElement;
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
