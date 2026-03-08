<template>
  <div class="menu">
    <transition name="overlay-fade">
      <div
        v-show="isShowed"
        class="menu__overlay" />
    </transition>

    <transition name="menu-slide">
      <div
        v-show="isShowed"
        ref="contentRef"
        class="menu__content">
        <div class="menu__header">
          <img
            src="/assets/logos/logo-artweb-white.svg?url"
            alt="Artweb Logo"
            class="menu__logo"
          >

          <button
            class="menu__close-button"
            type="button"
            aria-label="Close"
            @click="close"
          >
            <span class="menu__close-button-line menu__close-button-line--1" />
            <span class="menu__close-button-line menu__close-button-line--2" />
          </button>
        </div>

        <ul class="menu__links list-reset">
          <li
            v-for="link in HEADER_LINKS"
            :key="link.key"
            class="menu__item text-14"
          >
            <nuxt-link
              v-if="link.anchor.startsWith('/')"
              :to="link.anchor"
              @click="close"
            >
              {{ $t(`landing.${link.key}`) }}
            </nuxt-link>
            <a
              v-else
              :href="link.anchor"
              @click="close">
              {{ $t(`landing.${link.key}`) }}
            </a>
          </li>
        </ul>

        <div class="menu__footer">
          <language-switcher size="large" />
          <theme-switcher size="large" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

import {
  DEFAULT_HEADER_LINKS,
  INDEX_HEADER_LINKS,
} from './landing-header-links';
import LanguageSwitcher from './LanguageSwitcher.vue';
import ThemeSwitcher from './ThemeSwitcher.vue';

const route = useRoute();
const isShowed = defineModel<boolean>();
const contentRef = ref<HTMLDivElement | null>(null);
const { $viewport } = useNuxtApp();

const close = () => {
  isShowed.value = false;
};

const HEADER_LINKS = computed(() =>
  route.name === 'index' ? INDEX_HEADER_LINKS : DEFAULT_HEADER_LINKS,
);

onClickOutside(contentRef, close);

watch($viewport.breakpoint, () => {
  if ($viewport.isGreaterThan('xl')) {
    close();
  }
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.menu {
  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(2px);
    overflow: hidden;
  }

  &__content {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    min-width: 300px;
    height: 100vh;
    padding: 20px;
    background: linear-gradient(336.4deg, #667eea 19.8%, #764ba2 80.2%);
    z-index: 11;

    @media screen and (max-width: 576px) {
      min-width: unset;
      left: 0;
      bottom: 0;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 44px;
  }

  &__logo {
    height: 24px;
  }

  &__close-button {
    position: relative;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;

    &-line {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 2px;
      background-color: colors.$white;
      border-radius: 1px;
      transform-origin: center;

      &--1 {
        transform: translate(-50%, -50%) rotate(45deg);
      }

      &--2 {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
    margin-top: offsets.$offset-40;
  }

  &__item {
    border-top: 1px solid #f8f9fa40;
    padding: 13px 0;
    color: colors.$white;

    &:last-of-type {
      border-bottom: 1px solid #f8f9fa40;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: auto;
    margin-left: auto;
  }
}

/* overlay animation */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.menu-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.menu-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
