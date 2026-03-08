<template>
  <div
    v-if="messages"
    class="message-editor">
    <!-- MODE SWITCH -->
    <div class="message-editor__mode-row">
      <switch-ui
        v-model="isAdvanced"
        :switch-props="{ disabled: !canSwitchMode || disabled }"
        :description="modeDescription"
        with-label
        enabled-label="Advanced mode"
        disabled-label="Simple mode"
      />
    </div>

    <!-- SIMPLE MODE -->
    <div v-if="!isAdvanced && messages.pairs[0]">
      <slot
        name="text-editor"
        :model-value="messages.pairs[0].userContent"
        :on-update="
          (val: string | null | undefined) =>
            updatePairUserContent(0, val ?? null)
        "
        :error="errors?.pairs?.[0]?.userContent"
      />
    </div>

    <!-- ADVANCED MODE -->
    <div
      v-else
      class="message-editor__advanced">
      <!-- SYSTEM -->
      <div class="message-editor__role-block">
        <div class="message-editor__role-header">
          <span>System</span>

          <div>
            <button-ui
              v-if="messages.systemPrompt === undefined"
              size="small"
              color="success"
              :disabled="disabled"
              @click="createSystemPrompt"
            >
              Добавить
            </button-ui>

            <button-ui
              v-else
              size="small"
              color="danger"
              :disabled="disabled"
              @click="deleteSystemPrompt"
            >
              Удалить
            </button-ui>
          </div>
        </div>

        <template v-if="messages.systemPrompt !== undefined">
          <slot
            name="text-editor"
            :model-value="messages.systemPrompt"
            :on-update="updateSystemPrompt"
            :error="errors?.systemPrompt"
          />
        </template>
      </div>

      <!-- PAIRS -->
      <div
        v-for="(pair, index) in messages.pairs"
        :key="pair.uuid"
        class="message-editor__pair-wrapper"
      >
        <div class="message-editor__pair-header">
          <span>Сообщение #{{ index + 1 }}</span>

          <button-ui
            color="danger"
            size="small"
            :disabled="!canDeletePair || disabled"
            @click="deletePair(index)"
          >
            Удалить
          </button-ui>
        </div>

        <!-- USER -->
        <div class="message-editor__role-block">
          <div class="message-editor__role-header">
            <span>User</span>
          </div>

          <slot
            name="text-editor"
            :model-value="pair.userContent"
            :on-update="
              (val: string | null | undefined) =>
                updatePairUserContent(index, val ?? null)
            "
            :error="errors?.pairs?.[index]?.userContent"
          />
        </div>

        <!-- ASSISTANT -->
        <div class="message-editor__role-block">
          <div class="message-editor__role-header">
            <span>Assistant</span>

            <div>
              <button-ui
                v-if="pair.assistantContent === undefined"
                size="small"
                color="success"
                :disabled="disabled"
                @click="createAssistant(index)"
              >
                Добавить
              </button-ui>

              <button-ui
                v-else
                size="small"
                color="danger"
                :disabled="disabled"
                @click="deleteAssistant(index)"
              >
                Удалить
              </button-ui>
            </div>
          </div>

          <template v-if="pair.assistantContent !== undefined">
            <slot
              name="text-editor"
              :model-value="pair.assistantContent"
              :on-update="
                (val: string | null | undefined) =>
                  updatePairAssistantContent(index, val ?? null)
              "
              :error="errors?.pairs?.[index]?.assistantContent"
            />
          </template>
        </div>
      </div>

      <!-- ADD BUTTON -->
      <button-ui
        class="message-editor__add-btn"
        color="success"
        :disabled="!canAdd || disabled"
        @click="addPair"
      >
        + Добавить сообщение
      </button-ui>
    </div>

    <div
      v-if="isAdvanced"
      class="message-editor__bottom-note">
      Максимум сообщений — {{ MAX_MESSAGES }}.
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import { generateUuid } from '~/shared/utils/generateUuid';

import type {
  MessageInputErrors,
  MessageInputValue,
} from '../types/message-input.types';

type Props = {
  disabled?: boolean;
  errors?: MessageInputErrors | null;
};

defineProps<Props>();

defineSlots<{
  'text-editor': (props: {
    modelValue: string | null | undefined;
    onUpdate: (val: string | null | undefined) => void;
    error?: string | null;
  }) => unknown;
}>();

const messages = defineModel<MessageInputValue | null>({
  required: true,
});

const MAX_MESSAGES = 10;
const internalAdvanced = ref(false);

/* ---------------- COMPUTED ---------------- */

const hasAssistant = computed(
  () => !!messages.value?.pairs.some((p) => p.assistantContent !== undefined),
);

watch(
  messages,
  (val) => {
    if (!val) return;
    internalAdvanced.value =
      val.pairs.length > 1 ||
      val.systemPrompt !== undefined ||
      !!val.pairs.some((p) => p.assistantContent !== undefined);
  },
  { immediate: true },
);

const isAdvanced = computed({
  get: () => internalAdvanced.value,
  set: (value) => {
    if (canSwitchMode.value) {
      internalAdvanced.value = value;
    }
  },
});

const canAdd = computed(
  () => !!messages.value && messages.value.pairs.length < MAX_MESSAGES,
);

const canDeletePair = computed(
  () => !!messages.value && messages.value.pairs.length > 1,
);

const canSwitchMode = computed(
  () =>
    !!messages.value &&
    messages.value.pairs.length === 1 &&
    messages.value.systemPrompt === undefined &&
    !hasAssistant.value,
);

const modeDescription = computed(() =>
  canSwitchMode.value
    ? ''
    : `
      <p>Нельзя изменить режим, если:<p>
      <ul>
        <li>Не удалён System Prompt</li>
        <li>Больше одной пары User Prompt + Assistant Prompt</li>
        <li>Пара одна, но в ней есть Assistant Prompt</li>
      </ul>
    `,
);

/* ---------------- ACTIONS ---------------- */

function addPair() {
  if (!messages.value || !canAdd.value) return;

  messages.value.pairs.push({
    userContent: null,
    uuid: generateUuid(),
  });
}

function createSystemPrompt() {
  if (!messages.value) return;

  messages.value.systemPrompt = null;
}

function deleteSystemPrompt() {
  if (!messages.value) return;

  messages.value.systemPrompt = undefined;
}

function deletePair(index: number) {
  if (!messages.value || !canDeletePair.value) return;

  messages.value.pairs.splice(index, 1);
}

function createAssistant(index: number) {
  const pair = messages.value?.pairs[index];
  if (!pair) return;

  pair.assistantContent = null;
}

function deleteAssistant(index: number) {
  const pair = messages.value?.pairs[index];
  if (!pair) return;

  pair.assistantContent = undefined;
}

function updatePairUserContent(index: number, val: string | null) {
  const pair = messages.value?.pairs[index];
  if (!pair) return;

  pair.userContent = val;
}

function updatePairAssistantContent(index: number, val: string | null) {
  const pair = messages.value?.pairs[index];
  if (!pair) return;

  pair.assistantContent = val;
}

function updateSystemPrompt(val: string | null | undefined) {
  if (!messages.value) return;

  messages.value.systemPrompt = val ?? null;
}
</script>

<style lang="scss">
.message-editor {
  &__mode-row {
    margin-bottom: 36px;
  }

  &__advanced {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__pair-wrapper {
    border: 1px solid #ececec;
    border-radius: 10px;
    padding: 16px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__pair-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  &__role-block {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  &__role-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
  }

  &__add-btn {
    align-self: flex-start;
  }

  &__bottom-note {
    margin-top: 16px;
    font-size: 12px;
    color: #666;
  }
}
</style>
