<template>
  <form-wrapper v-bind="props">
    <tiny-editor-component
      v-model="model"
      :init="mergedSettings"
      tinymce-script-src="/libs/tinymce-v7/tinymce.min.js"
      :disabled="disabled"
    />
  </form-wrapper>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';

import type { Editor, RawEditorOptions } from '~/shared/types/tinymce';
import type { FormItemEditorElementProps } from '~/shared/types/ui/form.components.types';

import FormWrapper, { type FormWrapperProps } from './FormWrapperUi.vue';

const TinyEditorComponent = defineAsyncComponent(
  () => import('@tinymce/tinymce-vue'),
);

type TinyMCESettings = RawEditorOptions;

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
  plugins: 'advlist lists link table wordcount code',
  toolbar:
    'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table',
  // menubar: 'file edit view insert format tools help',
  menubar: '',
  block_formats: 'Абзац=p; Заголовок 1=h1; Заголовок 2=h2; Заголовок 3=h3',
  content_css: '/libs/tinymce-v7/skins/content/default/content.css',
  skin_url: '/libs/tinymce-v7/skins/ui/oxide',
  branding: false,
  promotion: false,
  license_key: 'gpl',
  language_url: '/libs/tinymce-v7/ru.js',
  language: 'ru',
  setup: (editor: Editor) => {
    editor.on('input', () => {
      model.value = editor.getContent();
    });

    const MAX = props.additionallyProps?.maxChars;

    const getLength = () => editor.getContent({ format: 'text' }).length;

    editor.on(
      'BeforeInput',
      (e: { data?: string; preventDefault: () => void }) => {
        if (!e.data) return;
        if (MAX !== undefined && getLength() + e.data.length > MAX) {
          e.preventDefault();
        }
      },
    );

    editor.on(
      'PastePreProcess',
      (e: { content: string; preventDefault: () => void }) => {
        if (MAX !== undefined) {
          const allowed = MAX - getLength();
          if (allowed <= 0) {
            e.preventDefault();
          } else {
            e.content = e.content.substring(0, allowed);
          }
        }
      },
    );
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

const mergedSettings = computed(() => {
  const {
    setup: customSetup,
    init_instance_callback: customInitCb,
    ...restCustom
  } = props.customSettings ?? {};

  return {
    ...defaultSettings,
    ...restCustom,
    setup: (editor: Editor) => {
      defaultSettings.setup?.(editor);
      customSetup?.(editor);
    },
    init_instance_callback: (editor: Editor) => {
      defaultSettings.init_instance_callback?.(editor);
      customInitCb?.(editor);
    },
  };
});
</script>
