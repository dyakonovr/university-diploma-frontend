<template>
  <container class="form-template-container">
    <button
      type="button"
      class="text-14 weight-500 form-template__back-link"
      @click="$nuxt.$router.back()">
      <chevron-down-icon class="form-template__back-link-icon" />
      Вернуться назад
    </button>

    <h1 class="headline-5">{{ title }}</h1>
    <form
      class="form-template-form gray-rounded-block"
      @submit.prevent="onSubmit">
      <slot name="main" />

      <div class="form-template-form__buttons">
        <slot name="buttons" />
      </div>
    </form>
  </container>
</template>

<script lang="ts" setup>
import Container from '~/components/layout/Container.vue';
import ChevronDownIcon from '~/assets/images/icons/chevron-down.svg';

export type FormTemplateProps = {
  title: string;
  loading: boolean;
  isEdit: boolean;
  onSubmit: () => void;
};

defineProps<FormTemplateProps>();
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.form-template {
  &-container {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-24;
    min-width: 300px;
    max-width: 700px;
    margin: 0 auto;
  }

  &__back-link {
    display: flex;
    align-items: center;
    gap: offsets.$offset-8;
    color: colors.$primary-normal;

    &-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(90deg);
      stroke: colors.$primary-normal !important;
    }
  }

  &-form {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-16;

    &__buttons {
      display: flex;
      gap: offsets.$offset-8;
    }

    &__button {
      align-self: baseline;

      &-icon {
        stroke: colors.$white;
        transform: rotate(-90deg);
      }
    }
  }
}
</style>