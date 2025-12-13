<template>
  <div
    v-show="model"
    class="header-mobile-menu">
    <ul class="header-mobile-menu__nav list-reset">
      <template
        v-for="item in HEADER_ROUTES"
        :key="item.path"
      >
        <li
          v-if="userStore.user && item.roles.includes(userStore.user.roleId)"
          class="header-mobile-menu__item">
          <button
            type="button"
            class="text-16 weight-500 header-mobile-menu__link"
            :class="{ 'header-mobile-menu__link--active': item.path === route.path }"
            @click="handleLinkClick(item.path)">
            {{ item.name }}
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { HEADER_ROUTES } from '../routes';
import { useUserStore } from '~/stores/user';

const route = useRoute();
const router = useRouter();

const model = defineModel<boolean>();

const userStore = useUserStore();

const handleLinkClick = (path: string) => {
  router.push(path);
  model.value = false;
};
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.header-mobile-menu {
  position: absolute;
  left: 0;
  top: calc(100% + 1px);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 49px);
  background-color: colors.$white;
  z-index: 1;

  &__nav {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  &__item {
    padding: 22.5px offsets.$offset-32;
    border-bottom: 1px solid #F1F1F4;
  }

  &__link {
    color: colors.$gray-600;
    transition: color 0.3s ease-in-out;

    &--active {
      color: colors.$gray-900;
    }
  }
}
</style>