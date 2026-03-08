<template>
  <div :class="['error-content', `error-content--${variant}`]">
    <div class="error-content__code">
      {{ error.statusCode }}
    </div>

    <h1 class="error-content__title">
      {{ title }}
    </h1>

    <p class="error-content__description">
      {{ description }}
    </p>

    <div class="error-content__actions">
      <button-ui
        :to="homeLink"
        color="primary"
        variant="filled">
        Вернуться домой
      </button-ui>
    </div>

    <p
      v-if="requestId"
      class="error-content__request-id">
      Request ID: {{ requestId }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { NuxtError } from '#app';
import ButtonUi from '~/components/ui/ButtonUi.vue';

type Props = {
  error: NuxtError;
  variant: 'account' | 'landing';
};

const props = defineProps<Props>();

const requestId = computed(
  () => props.error.data?.requestId as string | undefined,
);

const homeLink = computed(() =>
  props.variant === 'account' ? '/account' : '/',
);

const title = computed(() => {
  const code = props.error.statusCode;

  if (code === 404) return 'Страница не найдена';
  if (code === 403) return 'Доступ запрещён';
  if (code && code >= 500) return 'Внутренняя ошибка';

  return t('errors.unknown.title');
});

const description = computed(() => {
  const code = props.error.statusCode;

  if (code === 404) return 'Страница не найдена';
  if (code === 403) return 'Доступ запрещён';
  if (code && code >= 500) return 'Внутренняя ошибка';

  return t('errors.unknown.description');
});

</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  animation: errorFadeIn 0.5s ease-out;

  &__code {
    font-size: 120px;
    font-weight: 800;
    line-height: 1;
    color: colors.$primary;
    opacity: 0.65;
    animation: errorCodeBounce 0.6s ease-out;
    user-select: none;
  }

  &__title {
    margin-top: -10px;
    font-size: 28px;
    font-weight: 700;
    color: colors.$text;
  }

  &__description {
    margin-top: offsets.$offset-8;
    font-size: 16px;
    color: colors.$text-light;
    max-width: 400px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    margin-top: offsets.$offset-24;
  }

  &__request-id {
    margin-top: offsets.$offset-24;
    font-size: 12px;
    color: colors.$text-light;
    opacity: 0.7;
    font-family: monospace;
  }

  // Account variant
  &--account {
    flex: 1;
    padding: offsets.$offset-40;
  }

  // Landing variant
  &--landing {
    padding: 80px offsets.$offset-16;
    min-height: 50vh;
  }
}

@keyframes errorFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes errorCodeBounce {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  60% {
    opacity: 0.18;
    transform: scale(1.05);
  }

  100% {
    opacity: 0.15;
    transform: scale(1);
  }
}
</style>
