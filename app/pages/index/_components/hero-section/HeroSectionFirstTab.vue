<template>
  <div class="hero-ft">
    <form
      class="hero-ft__left"
      @submit.prevent>
      <input-ui
        v-model="formData.prompt"
        label="Идея поста"
        :error="formErrors.prompt"
        direction="column"
        :input-props="{ placeholder: 'Введите идею или тему', disabled: loading }" />
      <select-ui
        v-model="formData.platform"
        label="Выберите платформу"
        :options="FIRST_TAB_PLATFORMS"
        :error="formErrors.platform"
        direction="column"
        :select-props="{ disabled: loading }" />
      <button-ui @click="onSubmit">Отправить</button-ui>
    </form>

    <div class="hero-ft__right">
      <hero-section-first-tab-swiper />
    </div>
  </div>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import useLandingFirstTabForm, { FIRST_TAB_PLATFORMS } from '~/composables/pages/landing/useLandingFirstTabForm';

import HeroSectionFirstTabSwiper from './HeroSectionFirstTabSwiper.vue';

const {
  formData,
  formErrors,
  loading,
  onSubmit
} = useLandingFirstTabForm();

</script>

<style lang="scss">
.hero-ft {
  display: grid;
  grid-template-columns: 6fr 4fr;
  gap: 60px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__right {
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
}
</style>