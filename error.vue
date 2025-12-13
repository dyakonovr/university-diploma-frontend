<template>
  <nuxt-layout class="error-page">
    <container class="error-page__container">
      <h3>{{ error?.statusCode || 500 }}: {{ error?.statusCode in errorMessages ? errorMessages[error?.statusCode] :
        'Неизвестная ошибка' }}</h3>
      <link-ui
        to="/"
        class="error-page__link">Вернуться на главную страницу</link-ui>
    </container>
  </nuxt-layout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';
import Container from './components/layout/Container.vue';
import LinkUi from './components/ui/LinkUi.vue';

defineProps<{ error: NuxtError }>();

const errorMessages: Record<number, string> = {
  404: 'Страница не найдена'
};
</script>

<style lang="scss" scoped>
@use '/assets/styles/mixins/text' as textMixins;
@use '/assets/styles/base/offsets' as offsets;

.error-page {
  &__container {
    display: flex;
    flex-direction: column;
    align-items: baseline;
  }

  &__link {
    display: block;
    margin-top: offsets.$offset-4;

    @include textMixins.text-16;
  }
}
</style>