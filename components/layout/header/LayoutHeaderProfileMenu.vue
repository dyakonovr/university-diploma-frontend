<template>
  <div
    class="layout-header-profile-menu"
    @mouseenter="openMenu"
    @mouseleave="closeMenu">
    <button>
      <img
        src="/assets/images/icons/person.svg?url"
        class="layout-header-profile-menu__icon">
    </button>

    <ul
      :class="{ 'layout-header-profile-menu__list list-reset': true, 'layout-header-profile-menu__list--visible': isOpen }">
      <li class="text-14 layout-header-profile-menu__item">
        <router-link
          to="/patient/lk"
          class="layout-header-profile-menu__link">ЛК</router-link>
      </li>
      <li class="text-14 layout-header-profile-menu__item">
        <button
          type="button"
          class="layout-header-profile-menu__link exit"
          @click="logout">Выйти</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '~/stores/user';
import { useGetBackStore } from '~/stores/get-back';

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();
const getBackStore = useGetBackStore();

const isOpen = ref(false);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const openMenu = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  isOpen.value = true;
};

const closeMenu = () => {
  timeoutId = setTimeout(() => {
    isOpen.value = false;
  }, 200);
};

const logout = () => {
  userStore.clearAll();
  getBackStore.fromLink = route.path;
  router.push('/login');
};
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.layout-header-profile-menu {
  position: relative;

  &__icon {
    width: 20px;
    height: 20px;
    margin: 0 0 0 offsets.$offset-12;
  }

  &__list {
    position: absolute;
    top: 25px;
    right: -5px;
    padding: offsets.$offset-8;
    background-color: colors.$white;
    border: 1px solid colors.$gray-200;
    border-radius: 12px;
    opacity: 0;
    transform: translateY(-5px);
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 2;

    &--visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }
  }

  &__item {
    border-radius: inherit;
    padding: offsets.$offset-8 offsets.$offset-16;
    color: colors.$gray-700;
    transition: background-color 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: colors.$gray-100;

      .layout-header-profile-menu__link:not(.exit) {
        color: colors.$gray-900;
      }
    }
  }

  &__link {
    display: block;
    width: 100%;
    transition: color 0.3s ease-in-out;
    text-align: start;

    &.exit {
      color: colors.$danger-normal;
    }
  }
}
</style>
