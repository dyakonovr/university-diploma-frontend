<template>
  <header class="layout-header">
    <logo />
    <ul class="layout-header__nav list-reset">
      <li
        v-for="item in HEADER_ROUTES"
        :key="item.path">
        <nuxt-link
          v-if="userStore.user && item.roles.includes(userStore.user.roleId)"
          :to="item.path"
          class="text-14 weight-500 layout-header__link"
          :class="{ 'layout-header__link--active': route.path === item.path }">
          {{ item.name }}
        </nuxt-link>
      </li>
    </ul>
    <div class="layout-header__right">
      <layout-header-desktop-right />
    </div>
  </header>
</template>

<script lang="ts" setup>
import Logo from '../Logo.vue';
import LayoutHeaderDesktopRight from './LayoutHeaderDesktopRight.vue';
import { HEADER_ROUTES } from '../routes';
import { useUserStore } from '~/stores/user';

const route = useRoute();

const userStore = useUserStore();
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.layout-header {
  display: flex;
  align-items: center;
  padding: offsets.$offset-8 offsets.$offset-24;
  background-color: colors.$white;
  border-bottom: 1px solid colors.$gray-200;

  &__nav {
    margin: 0 0 0 offsets.$offset-24;
    display: flex;
    align-items: center;
    gap: offsets.$offset-24;
  }

  &__link {
    color: colors.$gray-600;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: colors.$gray-700;
    }

    &--active {
      color: colors.$gray-900;
    }
  }

  &__right {
    display: flex;
    align-items: center;
    margin: 0 0 0 auto;
  }

  &__login-button {
    color: colors.$primary-normal;
  }
}
</style>