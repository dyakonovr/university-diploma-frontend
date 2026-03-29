<template>
  <div
    class="hub-user-menu"
    @click="isOpen = !isOpen"
    @keydown.enter="isOpen = !isOpen"
  >
    <div class="hub-user-menu__trigger">
      <div class="hub-user-menu__avatar">
        {{ initials }}
      </div>
      <chevron-down-icon class="hub-user-menu__chevron" />
    </div>

    <teleport to="body">
      <div
        v-if="isOpen"
        class="hub-user-menu__backdrop"
        @click="isOpen = false"
      />
      <transition name="menu-fade">
        <div
          v-if="isOpen"
          class="hub-user-menu__dropdown"
          :style="dropdownStyle"
        >
          <div class="hub-user-menu__user-info">
            <p class="hub-user-menu__user-name">
              {{ userStore.user?.name || "User" }}
            </p>
            <p class="hub-user-menu__user-email">{{ userStore.user?.email }}</p>
          </div>

          <div class="hub-user-menu__divider" />

          <router-link
            class="hub-user-menu__item"
            to="/profile"
            @click="isOpen = false"
          >
            <user-icon />
            Профиль
          </router-link>
          <router-link
            class="hub-user-menu__item"
            to="/settings"
            @click="isOpen = false"
          >
            <settings-icon />
            Настройки
          </router-link>

          <div class="hub-user-menu__divider" />

          <button class="hub-user-menu__item" @click="cycleTheme">
            <component :is="themeIcon" />
            {{ themeLabel }}
          </button>

          <div class="hub-user-menu__divider" />

          <button
            class="hub-user-menu__item hub-user-menu__item--danger"
            @click="logout"
          >
            <logout-icon />
            Выйти
          </button>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";

import ChevronDownIcon from "@/assets/images/icons/chevron-down.svg";
import LogoutIcon from "@/assets/images/icons/logout.svg";
import MoonIcon from "@/assets/images/icons/moon.svg";
import SettingsIcon from "@/assets/images/icons/settings.svg";
import SunIcon from "@/assets/images/icons/sun.svg";
import UserIcon from "@/assets/images/icons/user.svg";
import useUserStore from "~/domain/user/stores/user";
import { useThemeStore } from "~/shared/stores/theme";

const router = useRouter();
const userStore = useUserStore();
const themeStore = useThemeStore();

const isOpen = ref(false);
const dropdownStyle = ref<Record<string, string>>({});

const initials = computed(() => {
  const name = userStore.user?.name || userStore.user?.email || "";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});

const themeLabel = computed(() => {
  const labels: Record<string, string> = {
    light: "Тема: Классика",
    professional: "Тема: Бизнес",
    dark: "Тема: Тёмная",
  };
  return labels[themeStore.theme] || "Тема";
});

const themeIcon = computed(() => {
  return themeStore.theme === "dark" ? MoonIcon : SunIcon;
});

const cycleTheme = () => {
  themeStore.toggleTheme();
};

const logout = () => {
  userStore.changeUserData(null);
  isOpen.value = false;
  router.push("/auth/login");
};
</script>

<style lang="scss">
.hub-user-menu {
  position: relative;
  cursor: pointer;

  &__trigger {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    border-radius: 6px;
    transition: background-color 0.15s;

    &:hover {
      background-color: var(--topbar-hover-bg);
    }
  }

  &__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--color-primary);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }

  &__chevron {
    width: 14px;
    height: 14px;
    color: var(--topbar-text-secondary);
  }

  &__backdrop {
    position: fixed;
    inset: 0;
    z-index: 1999;
  }

  &__dropdown {
    position: fixed;
    top: 52px;
    right: 16px;
    z-index: 2000;
    width: 220px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  &__user-info {
    padding: 8px 10px;
  }

  &__user-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
  }

  &__user-email {
    font-size: 12px;
    color: var(--color-text-secondary);
    margin-top: 2px;
  }

  &__divider {
    height: 1px;
    background: var(--color-border);
    margin: 4px 0;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text);
    cursor: pointer;
    transition: background-color 0.15s;
    text-decoration: none;

    svg {
      width: 16px;
      height: 16px;
      color: var(--color-text-secondary);
    }

    &:hover {
      background-color: var(--topbar-hover-bg);
    }

    &--danger {
      color: var(--color-danger);

      svg {
        color: var(--color-danger);
      }

      &:hover {
        background-color: #fef2f2;
      }
    }
  }
}

.menu-fade-enter-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.menu-fade-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.1s ease;
}

.menu-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
