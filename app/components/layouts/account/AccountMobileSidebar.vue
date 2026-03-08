<template>
  <client-only>
    <teleport to="body">
      <transition name="sidebar-overlay-fade">
        <div
          v-show="sidebarMenuStore.isMobileOpen"
          class="account-mobile-sidebar__overlay"
          @click="sidebarMenuStore.closeMobile()"
        />
      </transition>

      <transition name="sidebar-slide">
        <div
          v-show="sidebarMenuStore.isMobileOpen"
          class="account-mobile-sidebar"
        >
          <div class="account-mobile-sidebar__header">
            <router-link
              to="/account"
              @click="sidebarMenuStore.closeMobile()"
            >
              <logo-full class="account-mobile-sidebar__logo" />
            </router-link>

            <button
              class="account-mobile-sidebar__close"
              type="button"
              aria-label="Close"
              @click="sidebarMenuStore.closeMobile()"
            >
              <span
                class="account-mobile-sidebar__close-line account-mobile-sidebar__close-line--1"
              />
              <span
                class="account-mobile-sidebar__close-line account-mobile-sidebar__close-line--2"
              />
            </button>
          </div>

          <div
            class="account-mobile-sidebar__body"
            @click="onBodyClick"
          >
            <sidebar-menu force-expanded />
          </div>
        </div>
      </transition>
    </teleport>
  </client-only>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

import LogoFull from '@/assets/logos/logo-artweb.svg';
import SidebarMenu from '~/components/layouts/account/sidebar/AccountSidebarMenu.vue';
import useSidebarMenuStore from '~/shared/stores/sidebar-menu';

const sidebarMenuStore = useSidebarMenuStore();

const onBodyClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.closest('a') || target.closest('button.is-action')) {
    sidebarMenuStore.closeMobile();
  }
};
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/components/sidebar' as sidebar;

.account-mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 101;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  background-color: sidebar.$sidebar-menu-background-color;
  color: sidebar.$sidebar-menu-color;

  @media screen and (max-width: 400px) {
    max-width: 100%;
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(2px);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    flex-shrink: 0;
    border-bottom: sidebar.$sidebar-menu-logo-wrapper-divider;
  }

  &__logo {
    --width: #{sidebar.$sidebar-menu-uncollapsed-logo-width};

    min-width: var(--width);
    max-width: var(--width);
    height: sidebar.$sidebar-menu-logo-height;
  }

  &__close {
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

  &__body {
    flex: 1;
    overflow-y: auto;
    min-height: 0;

    // Hide logo inside sidebar since we have our own header
    .sidebar-menu__logo-link {
      display: none;
    }

    .sidebar-menu {
      min-height: unset;
    }

    // Hide entire collapse button group in mobile menu
    .sidebar-menu-group:has(.collapse-button) {
      display: none;
    }
  }
}

// Overlay animation
.sidebar-overlay-fade-enter-active,
.sidebar-overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}

.sidebar-overlay-fade-enter-from,
.sidebar-overlay-fade-leave-to {
  opacity: 0;
}

// Sidebar slide animation
.sidebar-slide-enter-active,
.sidebar-slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.sidebar-slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.sidebar-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
