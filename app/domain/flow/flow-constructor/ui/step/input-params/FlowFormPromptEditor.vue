<template>
  <editor-element-ui
    id="prompt-text-editor"
    v-model="content"
    v-bind="$props"
    :custom-settings="customSettings"
    :error="error"
  />

  <dialog-ui
    v-model="dialogVariablesVisible"
    title="Выберите переменную"
    dialog-class="prompt-editor__dialog"
  >
    <select-ui
      v-model="selectVariable"
      :options="variables"
      :searchable="false"
    />
    <template #footer>
      <div class="prompt-editor__footer">
        <button-ui
          variant="outlined"
          @click="dialogVariablesVisible = false"
        >Отмена</button-ui
        >
        <button-ui @click="insertVariable(selectVariable)">Добавить</button-ui>
      </div>
    </template>
  </dialog-ui>

  <dialog-ui
    v-model="dialogArtifactsVisible"
    title="Выберите артефакт"
    dialog-class="prompt-editor__dialog"
  >
    <select-ui
      v-model="selectArtifact"
      v-model:search-query="artifactsSearchValue"
      :options="artifactOptions || []"
      :select-props="{ disabled: artifactsLoading }"
      @reach-end="$emit('reachEnd')"
      @update:search-query="$emit('updateSearchQuery')"
    />
    <template #footer>
      <div class="prompt-editor__footer">
        <button-ui
          variant="outlined"
          @click="dialogArtifactsVisible = false"
        >Отмена</button-ui
        >
        <button-ui @click="insertArtifact(selectArtifact)">Добавить</button-ui>
      </div>
    </template>
  </dialog-ui>
</template>

<script lang="ts" setup>
import type { Editor } from 'public/libs/tinymce-v7/tinymce';

import ButtonUi from '~/components/ui/ButtonUi.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import EditorElementUi, {
  type NewEditorElementProps,
} from '~/components/ui/form/EditorElementUi.vue';
import type { FormWrapperProps } from '~/components/ui/form/FormWrapperUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import { getArtifact } from '~/domain/artifact/api/artifacts.api';
import type { Artifact } from '~/domain/artifact/models/artifact.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';

import { PROMPT_VARIABLE_RULES } from '../../../services/step-variables/const';
import type { PromptVariable } from '../../../services/step-variables/types';

export type FlowFormPromptEditorProps = FormWrapperProps &
  NewEditorElementProps & {
    variables: PromptVariable[];
  };

const VARIABLE_CLASS = 'flow-variable';
const ARTIFACT_CLASS = 'flow-artifact';

/** Матчит все переменные: previous_step, stage_output и artifact */
const ALL_VARIABLES_REGEX = /\$\{[^}]+\}/g;

const artifactsSearchValue = defineModel<string | null>('searchModel');

const props = defineProps<
  FlowFormPromptEditorProps & {
    artifactsLoading: boolean;
    artifactOptions: SelectOption[];
  }
>();

defineEmits<{
  (e: 'reachEnd' | 'updateSearchQuery'): void;
}>();

const editor = ref<Editor | null>(null);
const content = defineModel<string | null>();

const dialogVariablesVisible = ref(false);
const selectVariable = ref<string | null>(null);

const dialogArtifactsVisible = ref(false);
const selectArtifact = ref<EntityId | null>(null);

/**
 * Находит label переменной по её raw value (e.g. `${previous_step_text_1}`).
 * Если не найдено — возвращает сам value как fallback.
 */
function findVariableLabel(rawValue: string): string {
  const variable = props.variables.find((v) => v.value === rawValue);
  return variable?.label ?? rawValue;
}

/** Кэш загруженных артефактов для label'ов не из текущей страницы пагинации */
const artifactLabelCache = new Map<string, string>();

/** Строит label артефакта по его данным */
function buildArtifactLabelFromData(item: Artifact): string {
  if (item.name) return item.name;
  if (item.type === 'binary') {
    return item.content_type
      ? `Файл (${item.content_type})`
      : 'Файл без названия';
  }
  if (item.data) {
    const preview = item.data.replace(/<[^>]*>/g, '').slice(0, 50);
    return preview + (item.data.length > 50 ? '...' : '');
  }
  return 'Артефакт без названия';
}

/**
 * Находит label артефакта по его raw value (e.g. `${artifact_<id>}`).
 * Ищет среди загруженных artifactOptions, затем в кэше.
 * Если не найдено — возвращает null.
 */
function findArtifactLabel(rawValue: string): string | null {
  const option = props.artifactOptions.find((o) => o.value === rawValue);
  if (option) return option.label;
  return artifactLabelCache.get(rawValue) ?? null;
}

/**
 * Загружает label'ы артефактов, которых нет в artifactOptions/кэше,
 * и обновляет соответствующие теги в редакторе.
 */
async function hydrateUnknownArtifacts(ed: Editor) {
  const body = ed.getBody();
  if (!body) return;

  const artifactTags = body.querySelectorAll(`a.${ARTIFACT_CLASS}`);
  const toFetch: { id: string; rawValue: string; el: Element }[] = [];

  artifactTags.forEach((el: Element) => {
    const rawValue = decodeURIComponent(el.getAttribute('data-variable') ?? '');
    if (!rawValue) return;
    const label = findArtifactLabel(rawValue);
    if (label) return; // уже есть label

    const id = extractArtifactId(rawValue);
    if (id) toFetch.push({ id, rawValue, el });
  });

  if (!toFetch.length) return;

  const fetches = toFetch.map(async ({ id, rawValue, el }) => {
    try {
      const response = await getArtifact(id);
      const artifactLabel = buildArtifactLabelFromData(response.data);
      artifactLabelCache.set(rawValue, artifactLabel);
      el.textContent = artifactLabel;
    } catch {
      // Артефакт не найден — оставляем raw значение
    }
  });

  await Promise.all(fetches);
}

/**
 * Извлекает ID артефакта из raw значения `${artifact_<id>}`.
 * @example extractArtifactId('${artifact_abc-123}') // 'abc-123'
 */
function extractArtifactId(rawValue: string): string | null {
  const regex = new RegExp(PROMPT_VARIABLE_RULES.GLOBAL_ARTIFACT.source);
  const match = rawValue.match(regex);
  return match?.[1] ?? null;
}

/** Проверяет, является ли значение переменной артефактом */
function isArtifactVariable(rawValue: string): boolean {
  const regex = new RegExp(PROMPT_VARIABLE_RULES.GLOBAL_ARTIFACT.source);
  return regex.test(rawValue);
}

/** Создаёт HTML-строку для non-editable тега переменной */
function createVariableSpan(rawValue: string, label: string): string {
  return `<span class="${VARIABLE_CLASS}" contenteditable="false" data-variable="${encodeURIComponent(rawValue)}">${label}</span>`;
}

/** Создаёт HTML-строку для non-editable тега артефакта со ссылкой */
function createArtifactSpan(rawValue: string, label: string): string {
  const artifactId = extractArtifactId(rawValue);
  const href = artifactId ? `/account/artifacts/${artifactId}` : '#';
  return `<a class="${ARTIFACT_CLASS}" contenteditable="false" data-variable="${encodeURIComponent(rawValue)}" href="${href}" target="_blank" rel="noopener">Артефакт: ${label}</a>`;
}

/**
 * Преобразует raw `${...}` строки в HTML-спаны с тегами переменных.
 * Используется при загрузке контента в редактор.
 */
function rawToSpans(html: string): string {
  return html.replace(ALL_VARIABLES_REGEX, (match) => {
    if (isArtifactVariable(match)) {
      const label = findArtifactLabel(match) ?? match;
      return createArtifactSpan(match, label);
    }
    const label = findVariableLabel(match);
    return createVariableSpan(match, label);
  });
}

/**
 * Преобразует HTML-спаны переменных обратно в raw `${...}` строки.
 * Используется при получении контента из редактора для API.
 */
function spansToRaw(html: string): string {
  const container = document.createElement('div');
  container.innerHTML = html;

  const tags = container.querySelectorAll(
    `span.${VARIABLE_CLASS}, a.${ARTIFACT_CLASS}`,
  );
  tags.forEach((el) => {
    const rawValue = decodeURIComponent(el.getAttribute('data-variable') ?? '');
    if (rawValue) {
      el.replaceWith(rawValue);
    }
  });

  return container.innerHTML;
}

const customSettings = {
  menubar: false,
  toolbar: [
    'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table | code',
    'add-variable | add-artifact',
  ],
  noneditable_class: VARIABLE_CLASS,
  content_style: `
    .${VARIABLE_CLASS} {
      display: inline-block;
      background: #e0e7ff;
      border: 1px solid #a5b4fc;
      border-radius: 4px;
      padding: 1px 6px;
      font-size: 14px;
      color: #3730a3;
      cursor: default;
      user-select: all;
    }
    .${ARTIFACT_CLASS} {
      display: inline-block;
      background: #d1fae5;
      border: 1px solid #6ee7b7;
      border-radius: 4px;
      padding: 1px 6px;
      font-size: 14px;
      color: #065f46;
      cursor: pointer;
      user-select: all;
      text-decoration: none;
    }
    .${ARTIFACT_CLASS}:hover {
      background: #a7f3d0;
    }
  `,
  setup(ed: Editor) {
    editor.value = ed;

    ed.ui.registry.addButton('add-variable', {
      text: 'Добавить переменную',
      onAction: () => {
        dialogVariablesVisible.value = true;
      },
    });

    ed.ui.registry.addButton('add-artifact', {
      text: 'Добавить артефакт',
      onAction: () => {
        dialogArtifactsVisible.value = true;
      },
    });

    // Сериализация: при получении контента заменяем спаны на raw переменные
    ed.on('GetContent', (e: { content: string; format: string }) => {
      if (e.format === 'html' && e.content) {
        e.content = spansToRaw(e.content);
      }
    });

    // Десериализация при вставке: raw переменные в буфере → спаны
    ed.on('PastePostProcess', (e: { node: HTMLElement }) => {
      const html = e.node.innerHTML;
      if (ALL_VARIABLES_REGEX.test(html)) {
        e.node.innerHTML = rawToSpans(html);
        // Догружаем label'ы артефактов, которых нет в текущей странице пагинации
        hydrateUnknownArtifacts(ed);
      }
    });
  },
  init_instance_callback(ed: Editor) {
    // Десериализация: при загрузке контента заменяем raw переменные на спаны
    const rawContent = ed.getContent();
    if (rawContent && ALL_VARIABLES_REGEX.test(rawContent)) {
      ed.setContent(rawToSpans(rawContent));
      // Догружаем label'ы артефактов, которых нет в текущей странице пагинации
      hydrateUnknownArtifacts(ed);
    }
  },
};

/** Вставляет переменную как non-editable тег */
const insertVariable = (value: string | null) => {
  if (editor.value && value) {
    const label = findVariableLabel(value);
    const span = createVariableSpan(value, label) + '&nbsp;';
    editor.value.insertContent(span);
    dialogVariablesVisible.value = false;
  }
};

/** Вставляет артефакт как non-editable тег со ссылкой */
const insertArtifact = (value: string | null) => {
  if (editor.value && value) {
    const label = findArtifactLabel(value) ?? value;
    const span = createArtifactSpan(value, label) + '&nbsp;';
    editor.value.insertContent(span);
    dialogArtifactsVisible.value = false;
  }
};
</script>

<style lang="scss">
.prompt-editor {
  &__dialog {
    max-width: 600px;
    width: 100%;
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}
</style>
