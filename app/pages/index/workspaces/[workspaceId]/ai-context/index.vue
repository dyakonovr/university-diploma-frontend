<template>
  <form-container
    class="ai-context-page divided"
    :loading="loading"
  >
    <template #header>
      <p class="form-container__title">AI Контекст</p>
      <p class="form-container__description">
        Опишите вашу компанию: сотрудников, правила, приоритеты.
        AI будет использовать этот текст как базу знаний при обработке команд.
      </p>
    </template>

    <div class="form-container-padding">
      <p
        v-if="context"
        class="ai-context-page__meta"
      >
        Версия: {{ context.version }} · Обновлён: {{ new Date(context.updated_at).toLocaleString('ru-RU') }}
      </p>

      <editor-element-ui
        v-model="content"
        label="Контекст бизнеса"
        :disabled="saving"
      />

      <form-wrapper-ui :reserve-label-space="true">
        <button-ui
          :loading="saving"
          @click="saveContext"
        >
          Сохранить
        </button-ui>
      </form-wrapper-ui>
    </div>
  </form-container>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import EditorElementUi from '~/components/ui/form/EditorElementUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

import useAiContextForm from './_composables/useAiContextForm';

const workspaceId = inject(WORKSPACE_ID_KEY)!;

const { context, content, loading, saving, fetchContext, saveContext } = useAiContextForm(workspaceId);

onBeforeMount(async () => {
  await fetchContext();
});

// --- SEO ---
const PAGE_TITLE = 'AI Контекст';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.ai-context-page {
  &__meta {
    font-size: 12px;
    color: colors.$text-light;
    margin-bottom: 12px;
  }
}
</style>
