<template>
  <div class="account-layout">
    <div class="account-layout__wrapper">
      <aside
        class="account-layout__aside"
        :style="{ width: sidebarMenuStore.isCollapsed ? 'auto' : '250px' }"
      >
        <client-only>
          <sidebar-menu />
        </client-only>
      </aside>
      <div class="account-layout__main-wrapper">
        <header class="account-layout__header">
          <button
            class="account-layout__burger"
            type="button"
            aria-label="Menu"
            @click="sidebarMenuStore.openMobile()"
          >
            <span class="account-layout__burger-line" />
            <span class="account-layout__burger-line" />
            <span class="account-layout__burger-line" />
          </button>

          <router-link
            to="/account"
            class="account-layout__mobile-logo"
          >
            <logo-full class="account-layout__mobile-logo-svg" />
          </router-link>
        </header>
        <main
          id="main-element"
          class="account-layout__main">
          <slot v-if="$slots.default" />
          <nuxt-page v-else />
        </main>
        <div id="afterMain" />
      </div>
    </div>

    <account-mobile-sidebar />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

import LogoFull from '@/assets/logos/logo-artweb.svg';
import AccountMobileSidebar from '~/components/layouts/account/AccountMobileSidebar.vue';
import SidebarMenu from '~/components/layouts/account/sidebar/AccountSidebarMenu.vue';
import BalanceUi from '~/components/ui/BalanceUi.vue';
import useUserStore from '~/domain/user/stores/user';
import useSidebarMenuStore from '~/shared/stores/sidebar-menu';

const sidebarMenuStore = useSidebarMenuStore();
const userStore = useUserStore();

onBeforeUnmount(() => {
  sidebarMenuStore.closeMobile();
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/components/sidebar' as sidebar;

.account-layout {
  width: 100%;
  height: 100vh;

  &__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
  }

  &__aside {
    @media screen and (max-width: 768px) {
      display: none;
    }
  }

  &__main-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: colors.$white;
    width: 100%;
    min-width: 0;
    height: 100%;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
    height: 49px;
    flex-shrink: 0;
    border-bottom: 1px solid colors.$border;
  }

  &__burger {
    display: none;
    width: 24px;
    height: 18px;
    padding: 0;
    border: none;
    background: transparent;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    margin-right: 12px;

    @media screen and (max-width: 768px) {
      display: flex;
    }

    &-line {
      width: 100%;
      height: 2px;
      background-color: colors.$text;
      border-radius: 1px;
    }
  }

  &__mobile-logo {
    display: none;
    margin-right: auto;

    @media screen and (max-width: 768px) {
      display: flex;
      align-items: center;
    }

    &-svg {
      --width: #{sidebar.$sidebar-menu-uncollapsed-logo-width};

      min-width: var(--width);
      max-width: var(--width);
      height: sidebar.$sidebar-menu-logo-height;
    }
  }

  &__main {
    position: relative;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, colors.$background 0%, #eef2ff 100%);
    height: 100%;
    min-height: 0;
    padding: 20px;
    overflow-y: auto;
  }
}
</style>
