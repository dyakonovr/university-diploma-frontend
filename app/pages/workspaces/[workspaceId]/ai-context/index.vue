<template>
  <form-container
    class="ai-context-page divided"
    :loading="loading">
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
        class="ai-context-page__meta">
        Версия: {{ context.version }} · Обновлён: {{ new Date(context.updated_at).toLocaleString('ru-RU') }}
      </p>

      <input-ui
        v-model="content"
        label="Контекст бизнеса"
        :input-props="{
          placeholder: 'Опишите вашу компанию, сотрудников, правила...',
          disabled: saving,
        }"
      />

      <form-wrapper-ui :reserve-label-space="true">
        <button-ui
          :loading="saving"
          @click="saveContext">
          Сохранить
        </button-ui>
      </form-wrapper-ui>
    </div>
  </form-container>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';

import useAiContextForm from './_composables/useAiContextForm';

const route = useRoute();
const workspaceId = route.params.workspaceId as string;

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
