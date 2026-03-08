<template>
  <header class="header landing-container">
    <nav class="header__container">
      <nuxt-link
        to="/"
        class="header__logo">
        <img
          src="/assets/logos/logo-artweb-white.svg?url"
          alt="Artweb Logo" >
      </nuxt-link>

      <ul class="header__links header__desktop-only list-reset">
        <li
          v-for="link in HEADER_LINKS"
          :key="link.key"
          class="header__link text-14"
        >
          <nuxt-link
            v-if="link.anchor.startsWith('/')"
            :to="link.anchor">
            {{ $t(`landing.${link.key}`) }}
          </nuxt-link>
          <a
            v-else
            :href="link.anchor">
            {{ $t(`landing.${link.key}`) }}
          </a>
        </li>
      </ul>

      <div class="header__right-side header__desktop-only">
        <div class="header__lang-theme">
          <language-switcher />
          <theme-switcher />
        </div>
        <nuxt-link
          to="/"
          class="header__button text-14">
          {{ $t('landing.header.start_free') }}
        </nuxt-link>
      </div>

      <button
        class="header__burger"
        type="button"
        aria-label="Menu"
        @click="isMenuShowed = true"
      >
        <span class="header__burger-line" />
        <span class="header__burger-line" />
        <span class="header__burger-line" />
      </button>
    </nav>
  </header>

  <landing-burger-menu v-model="isMenuShowed" />
</template>

<script setup lang="ts">
import {
  DEFAULT_HEADER_LINKS,
  INDEX_HEADER_LINKS,
} from './landing-header-links';
import LandingBurgerMenu from './LandingBurgerMenu.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';

const route = useRoute();
const isMenuShowed = ref(false);

const HEADER_LINKS = computed(() =>
  route.name === 'index' ? INDEX_HEADER_LINKS : DEFAULT_HEADER_LINKS,
);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

$border-radius: 26px;

.header {
  margin-top: 10px !important;

  &__container {
    --border-color: #{colors.$border};

    display: flex;
    align-items: center;
    gap: offsets.$offset-8;
    min-height: 52px;
    border: 1px solid var(--border-color);
    border-radius: $border-radius;
    background: linear-gradient(
      87.62deg,
      #667eea 21.62%,
      rgba(118, 75, 162, 0.729412) 93.1%
    );
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 20px;
    height: 100%;

    img {
      height: 12px;
    }
  }

  &__links {
    display: flex;
    align-items: center;
    color: colors.$white;
    gap: offsets.$offset-24;
  }

  &__right-side {
    display: flex;
    align-items: center;
    gap: 25px;
    margin-left: auto;
  }

  &__lang-theme {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__button {
    border: 1px solid var(--border-color);
    border-radius: $border-radius;
    padding: 17px 20px;
    margin-right: -1px;
    height: 100%;
    color: colors.$white;
    background-color: colors.$primary;
    transition: background-color 0.15s ease-in-out;

    &:hover {
      background-color: colors.$primary-dark;
    }
  }

  &__burger {
    display: none;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    margin-right: 20px;

    @media screen and (max-width: 1200px) {
      display: flex;
    }

    &-line {
      width: 100%;
      height: 2px;
      background-color: colors.$white;
      border-radius: 1px;
    }
  }

  &__desktop-only {
    @media screen and (max-width: 1200px) {
      display: none;
    }
  }
}

[data-theme='dark'] .header {
  &__container {
    --border-color: #{colors.$primary-dark};
  }
}
</style>
