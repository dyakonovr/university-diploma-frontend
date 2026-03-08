<template>
  <div>
    <form-container class="divided">
      <template #header>
        <p class="form-container__title">Входные параметры</p>
      </template>

      <div class="form-container-padding">
        <p
          v-if="!inputParams || Object.keys(inputParams).length === 0"
          class="input-params-editor__empty"
        >
          Входные параметры не определены
        </p>

        <div
          v-else
          class="input-params-editor__list">
          <param-card
            v-for="(param, key) in inputParams"
            :key="key"
            :title="String(key)"
          >
            <template #badge>
              <p class="input-params-editor__badge">
                Лимиты: {{ param.limit_down }} – {{ param.limit_up }}
              </p>
            </template>

            <template v-if="paramConfigs[key]">
              <input-ui
                v-model="paramConfigs[key].name"
                label="Название"
                :input-props="{ placeholder: 'Введите название параметра' }"
              />
              <input-ui
                v-model="paramConfigs[key].description"
                label="Описание"
                :input-props="{ placeholder: 'Введите описание параметра' }"
              />
              <select-ui
                v-model="paramConfigs[key].type"
                label="Тип"
                :options="MODEL_INPUT_PARAM_TYPES"
                :searchable="false"
                :select-props="{ placeholder: 'Выберите тип' }"
              />
              <select-ui
                v-if="paramConfigs[key].type === 'Setting'"
                v-model="paramConfigs[key].variable_type"
                label="Тип переменной"
                :options="MODEL_VARIABLE_TYPES"
                :searchable="false"
                :select-props="{ placeholder: 'Выберите тип переменной' }"
                @update:model-value="onVariableTypeChange(paramConfigs[key])"
              />
              <switch-ui
                v-model="paramConfigs[key].is_optional"
                label="Опциональный?"
                with-label
                enabled-label="Да"
                disabled-label="Нет"
              />

              <!-- Message default value -->
              <template v-if="paramConfigs[key].type === 'Message'">
                <form-wrapper-ui label="Значение по умолчанию">
                  <button-ui
                    variant="outlined"
                    @click="openMessageDialog(String(key))"
                  >
                    Настроить
                  </button-ui>
                </form-wrapper-ui>
              </template>

              <!-- Setting default value -->
              <template v-else-if="paramConfigs[key].variable_type !== null">
                <input-ui
                  v-if="paramConfigs[key].variable_type !== 'bool'"
                  v-model="paramConfigs[key].default as string | number | null"
                  label="Значение по умолчанию"
                  :input-props="{ placeholder: 'Введите значение' }"
                />
                <switch-ui
                  v-else
                  v-model="paramConfigs[key].default as boolean | null"
                  label="Значение по умолчанию"
                  with-label
                  enabled-label="Да"
                  disabled-label="Нет"
                />
              </template>

              <button-ui
                class="input-params-editor__save-button"
                :disabled="savingParam === key"
                @click="saveParam(key)"
              >
                Сохранить
              </button-ui>
            </template>
          </param-card>
        </div>
      </div>
    </form-container>

    <!-- Message default value dialog -->
    <dialog-ui
      v-model="isMessageDialogOpen"
      title="Значение по умолчанию (Message)"
      dialog-class="input-params-editor__message-dialog"
      confirm-button-text="Сохранить"
      @confirm="confirmMessageDefault"
    >
      <model-message-input-param-editor v-model="editingMessageValue">
        <template #text-editor="{ modelValue, onUpdate }">
          <input-ui
            :model-value="modelValue"
            :input-props="{
              isTextarea: true,
              placeholder: 'Введите текст',
              rows: 3,
            }"
            @update:model-value="onUpdate($event as string | null | undefined)"
          />
        </template>
      </model-message-input-param-editor>
    </dialog-ui>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import { updateInputParam } from '~/domain/model/api/models.api';
import {
  MODEL_INPUT_PARAM_TYPES,
  MODEL_VARIABLE_TYPES,
} from '~/domain/model/constants/model.const';
import type {
  MessageDefaultValueItem,
  Model,
  ModelCapabilitiesInputParams,
  ModelCapabilityInputParamType,
} from '~/domain/model/models/model.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { MessageInputValue } from '~/shared/types/message-input.types';
import ModelMessageInputParamEditor from '~/shared/ui/ModelMessageInputParamEditor.vue';
import { generateUuid } from '~/shared/utils/generateUuid';

import ParamCard from './ParamCard.vue';

type ModelInputParams = Model['capabilities']['input_params'][number];

type InputParam = {
  type: ModelCapabilityInputParamType | null;
  variable_type: ModelInputParams['variable_type'] | null;
  is_optional: boolean;
  default: ModelInputParams['default'] | null;
  name?: ModelInputParams['name'] | null;
  description?: ModelInputParams['description'] | null;
};

const props = defineProps<{
  modelId: EntityId;
  inputParams: ModelCapabilitiesInputParams | null;
}>();

const { toastSuccess, toastError } = useCustomToast();

const savingParam = ref<string | null>(null);

/**
 * Конфиги параметров по ключу
 */
const paramConfigs = ref<Record<string, InputParam>>({});

/* ---------------- MESSAGE DIALOG ---------------- */

const isMessageDialogOpen = ref(false);
const editingMessageKey = ref<string | null>(null);
const editingMessageValue = ref<MessageInputValue | null>(null);

/**
 * Конвертация MessageDefaultValueItem[] → MessageInputValue (формат редактора)
 */
function messageDefaultToEditorValue(
  items: MessageDefaultValueItem[],
): MessageInputValue {
  const result: MessageInputValue = {
    systemPrompt: undefined,
    pairs: [],
  };

  let i = 0;

  if (items[0]?.role === 'system') {
    result.systemPrompt = items[0].content;
    i += 1;
  }

  while (i < items.length) {
    const item = items[i];
    const pair = {
      userContent: item?.role === 'user' ? item.content : null,
      uuid: generateUuid(),
    } as MessageInputValue['pairs'][number];

    if (i + 1 < items.length && items[i + 1]?.role === 'assistant') {
      i += 1;
      pair.assistantContent = items[i]!.content;
    }

    result.pairs.push(pair);
    i += 1;
  }

  if (result.pairs.length === 0) {
    result.pairs.push({ userContent: null, uuid: generateUuid() });
  }

  return result;
}

/**
 * Конвертация MessageInputValue → MessageDefaultValueItem[] (API формат)
 */
function editorValueToMessageDefault(
  value: MessageInputValue,
): MessageDefaultValueItem[] {
  const result: MessageDefaultValueItem[] = [];

  if (value.systemPrompt !== undefined && value.systemPrompt !== null) {
    result.push({ role: 'system', content: value.systemPrompt });
  }

  for (const pair of value.pairs) {
    result.push({ role: 'user', content: pair.userContent || '' });

    if (pair.assistantContent !== undefined) {
      result.push({ role: 'assistant', content: pair.assistantContent || '' });
    }
  }

  return result;
}

function openMessageDialog(key: string) {
  editingMessageKey.value = key;
  const config = paramConfigs.value[key];

  if (config?.default && Array.isArray(config.default)) {
    editingMessageValue.value = messageDefaultToEditorValue(
      config.default as MessageDefaultValueItem[],
    );
  } else {
    editingMessageValue.value = {
      systemPrompt: undefined,
      pairs: [{ userContent: null, uuid: generateUuid() }],
    };
  }

  isMessageDialogOpen.value = true;
}

function confirmMessageDefault() {
  if (!editingMessageKey.value || !editingMessageValue.value) return;

  const config = paramConfigs.value[editingMessageKey.value];
  if (!config) return;

  config.default = editorValueToMessageDefault(editingMessageValue.value);
}

/* ------------------------------------------------ */

/**
 * Нормализация входного параметра
 */
const mapToConfig = (param: ModelInputParams): InputParam => ({
  type: param.type ?? null,
  variable_type: param.variable_type ?? null,
  is_optional: param.is_optional ?? false,
  default: param.default ?? null,
  name: param.name ?? null,
  description: param.description ?? null,
});

/**
 * Синхронизация пропсов в локальное состояние
 */
watch(
  () => props.inputParams,
  (newParams) => {
    if (!newParams) {
      paramConfigs.value = {};
      return;
    }

    paramConfigs.value = Object.fromEntries(
      Object.entries(newParams).map(([key, param]) => [
        key,
        mapToConfig(param),
      ]),
    );
  },
  { immediate: true },
);

/**
 * Формирование body для API
 */
const buildRequestBody = (config: InputParam) => {
  const body: Partial<ModelInputParams> = {};

  if (config.type) {
    body.type = config.type;
  }

  if (config.variable_type) {
    body.variable_type =
      config.type === 'Setting' ? config.variable_type : 'string';
  }

  body.is_optional = config.is_optional;

  const hasMessageDefault =
    config.type === 'Message' &&
    Array.isArray(config.default) &&
    config.default.length > 0;

  if (hasMessageDefault || (config.is_optional && config.default !== null)) {
    body.default = config.default;
  }

  if (config.name) {
    body.name = config.name;
  }

  if (config.description) {
    body.description = config.description;
  }

  return body;
};

/**
 * Сохранение параметра
 */
const saveParam = async (paramKey: string) => {
  const config = paramConfigs.value[paramKey];
  if (!config) return;

  savingParam.value = paramKey;

  try {
    const body = buildRequestBody(config);

    await updateInputParam(props.modelId, paramKey, body);

    toastSuccess('Параметр успешно обновлён');
  } catch {
    toastError('Ошибка при обновлении параметра');
  } finally {
    savingParam.value = null;
  }
};

const onVariableTypeChange = (param: InputParam) => {
  param.default = null;
};
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.input-params-editor {
  &__empty {
    padding: 20px;
    border-radius: 16px;
    border: 1px solid colors.$border;
    background: linear-gradient(
      135deg,
      colors.$white 0%,
      rgba(colors.$background, 0.6) 100%
    );
    text-align: center;
    color: colors.$text-light;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: offsets.$offset-24;

    @media screen and (max-width: 1400px) {
      grid-template-columns: 1fr;
    }
  }

  &__badge {
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 500;

    background: rgba(colors.$primary, 0.08);
    color: colors.$primary;
    border-radius: 999px;
  }

  &__save-button {
    margin-top: auto;
  }
}
</style>

<style lang="scss">
.input-params-editor__message-dialog {
  width: 700px;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  .dialog__body {
    overflow-y: auto;
    flex: 1;
    min-height: 0;
  }
}
</style>
