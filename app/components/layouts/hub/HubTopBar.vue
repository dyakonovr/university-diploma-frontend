<template>
  <header class="hub-topbar">
    <div class="hub-topbar__left">
      <!-- Mobile burger -->
      <button
        class="hub-topbar__burger"
        type="button"
        aria-label="Menu"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <span class="hub-topbar__burger-line" />
        <span class="hub-topbar__burger-line" />
        <span class="hub-topbar__burger-line" />
      </button>

      <router-link to="/workspaces" class="hub-topbar__logo">
        <logo-full class="hub-topbar__logo-svg" />
      </router-link>
    </div>

    <nav class="hub-topbar__nav">
      <router-link
        v-for="link in visibleLinks"
        :key="link.to"
        :to="link.to"
        class="hub-topbar__nav-link"
        :class="{ 'hub-topbar__nav-link--active': isLinkActive(link.to) }"
      >
        <component :is="link.icon" />
        {{ link.label }}
      </router-link>
    </nav>

    <div class="hub-topbar__right">
      <hub-user-menu />
    </div>

    <!-- Mobile nav -->
    <teleport to="body">
      <transition name="mobile-menu-fade">
        <div v-if="isMobileMenuOpen" class="hub-mobile-nav">
          <div
            class="hub-mobile-nav__backdrop"
            @click="isMobileMenuOpen = false"
          />
          <div class="hub-mobile-nav__panel">
            <div class="hub-mobile-nav__header">
              <logo-full class="hub-mobile-nav__logo" />
              <button
                class="hub-mobile-nav__close"
                @click="isMobileMenuOpen = false"
              >
                <x-icon />
              </button>
            </div>
            <nav class="hub-mobile-nav__links">
              <router-link
                v-for="link in visibleLinks"
                :key="link.to"
                :to="link.to"
                class="hub-mobile-nav__link"
                :class="{
                  'hub-mobile-nav__link--active': isLinkActive(link.to),
                }"
                @click="isMobileMenuOpen = false"
              >
                <component :is="link.icon" />
                {{ link.label }}
              </router-link>
            </nav>
          </div>
        </div>
      </transition>
    </teleport>
  </header>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { RouterLink, useRoute } from "vue-router";

import GridIcon from "@/assets/images/icons/grid.svg";
import ShieldIcon from "@/assets/images/icons/shield.svg";
import UsersIcon from "@/assets/images/icons/users.svg";
import XIcon from "@/assets/images/icons/x.svg";
import LogoFull from "@/assets/logos/logo-secretary.svg";
import useUserStore from "~/domain/user/stores/user";

import HubUserMenu from "./HubUserMenu.vue";

type NavLink = {
  to: string;
  label: string;
  icon: Component | string;
  adminOnly?: boolean;
};

const route = useRoute();
const userStore = useUserStore();

const isMobileMenuOpen = ref(false);

const allLinks: NavLink[] = [
  { to: "/workspaces", label: "Воркспейсы", icon: GridIcon },
  {
    to: "/admin/users",
    label: "Пользователи",
    icon: UsersIcon,
    adminOnly: true,
  },
  {
    to: "/admin/workspaces",
    label: "Воркспейсы (админ)",
    icon: ShieldIcon,
    adminOnly: true,
  },
];

const visibleLinks = computed(() =>
  allLinks.filter((l) => !l.adminOnly || userStore.isAdmin),
);

function isLinkActive(to: string) {
  return route.path === to || route.path.startsWith(to + "/");
}
</script>

<style lang="scss">
.hub-topbar {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 24px;
  background: var(--topbar-bg);
  border-bottom: 1px solid var(--topbar-border);
  flex-shrink: 0;
  gap: 8px;

  &__left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__burger {
    display: none;
    width: 20px;
    height: 16px;
    padding: 0;
    border: none;
    background: transparent;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;

    @media screen and (max-width: 768px) {
      display: flex;
    }

    &-line {
      width: 100%;
      height: 2px;
      background-color: var(--topbar-text);
      border-radius: 1px;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
  }

  &__logo-svg {
    height: 22px;
    width: auto;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-left: 32px;

    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  &__nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 500;
    color: var(--topbar-text-secondary);
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.15s;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      color: var(--topbar-text);
      background-color: var(--topbar-hover-bg);
    }

    &--active {
      color: var(--topbar-active-text);
      background-color: var(--topbar-active-bg);
    }
  }

  &__right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

// Mobile navigation
.hub-mobile-nav {
  position: fixed;
  inset: 0;
  z-index: 2000;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  &__panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 280px;
    height: 100%;
    background: var(--color-surface);
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid var(--color-border);
  }

  &__logo {
    height: 22px;
    width: auto;
  }

  &__close {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    cursor: pointer;
    color: var(--color-text-secondary);

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background-color: var(--topbar-hover-bg);
    }
  }

  &__links {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-secondary);
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.15s;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      background-color: var(--topbar-hover-bg);
    }

    &--active {
      color: var(--topbar-active-text);
      background-color: var(--topbar-active-bg);
    }
  }
}

.mobile-menu-fade-enter-active {
  transition: opacity 0.2s ease;

  .hub-mobile-nav__panel {
    transition: transform 0.2s ease;
  }
}

.mobile-menu-fade-leave-active {
  transition: opacity 0.15s ease;

  .hub-mobile-nav__panel {
    transition: transform 0.15s ease;
  }
}

.mobile-menu-fade-enter-from {
  opacity: 0;

  .hub-mobile-nav__panel {
    transform: translateX(-100%);
  }
}

.mobile-menu-fade-leave-to {
  opacity: 0;

  .hub-mobile-nav__panel {
    transform: translateX(-100%);
  }
}
</style>
