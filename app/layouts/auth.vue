<template>
  <div class="auth-page">
    <div class="auth-page__container">
      <router-link to="/" class="auth-page__logo">
        <logo-full />
      </router-link>
      <div class="auth-page__card">
        <nuxt-page />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

import LogoFull from "@/assets/logos/logo-secretary.svg";
</script>

<style lang="scss">
@use "/assets/styles/base/offsets" as offsets;
@use "/assets/styles/mixins/text" as textMixins;

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: offsets.$offset-24;
  background-color: var(--color-background);

  .form-wrapper.with-label.row {
    grid-template-columns: 3fr 7fr;
  }

  &__container {
    width: 100%;
    max-width: 440px;
  }

  &__logo {
    display: flex;
    justify-content: center;
    margin-bottom: 32px;

    svg {
      height: 28px;
      width: auto;
    }
  }

  &__card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }

  &__header {
    margin-bottom: offsets.$offset-24;
    padding-bottom: offsets.$offset-16;
    border-bottom: 1px solid var(--color-border);
    text-align: center;
  }

  &__title {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-16;
  }

  &__submit {
    align-self: center;
    width: 100% !important;
    max-width: unset;
    margin-top: offsets.$offset-8;
  }

  &__footer {
    margin-top: offsets.$offset-24;
    padding-top: offsets.$offset-16;
    border-top: 1px solid var(--color-border);
    text-align: center;
    font-size: 14px;
    color: var(--color-text-secondary);
  }

  &__links {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  &__link {
    @include textMixins.text-14;

    color: var(--color-primary);
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: offsets.$offset-16;

    &__card {
      padding: offsets.$offset-24;
    }
  }
}
</style>
