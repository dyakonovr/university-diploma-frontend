<template>
  <div class="dzen-wrapper">
    <div class="dzen-wrapper__header">
      <dzen-full-logo class="dzen-wrapper__logo" />

      <div class="dzen-wrapper__input">
        <search-icon class="dzen-wrapper__input-icon" />
        <p class="dzen-wrapper__input-placeholder">Найти в Дзене</p>
      </div>
    </div>

    <slot />
  </div>
</template>

<script lang="ts" setup>
import SearchIcon from '~/assets/images/icons/search.svg';
import DzenFullLogo from '~/assets/images/socials/yandex-dzen/yandex-dzen-full.svg';
</script>

<style lang="scss">
.dzen-wrapper {
  --zenColorBgSecondary: #eff0f2;

  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid gray;
  border-radius: 16px;
  padding: 16px;

  &__header {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  &__logo {
    width: 100px;
    height: 30px;
  }

  &__input {
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 12px 24px;
    background-color: var(--zenColorBgSecondary);
    border-radius: 16px;
    height: 48px;

    &-icon {
      width: 24px;
      height: 24px;
    }

    &-placeholder {
      font-weight: 600;
      list-style: 20px;
    }
  }
}
</style>
