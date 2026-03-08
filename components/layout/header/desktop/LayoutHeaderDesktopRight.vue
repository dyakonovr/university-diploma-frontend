<template>
  <p class="text-12 layout-header-desktop-right__name">{{ userStore.user?.name }}<br>{{ userStore.user?.surname }}</p>
  <layout-header-profile-menu />
</template>

<script lang="ts" setup>
import LayoutHeaderProfileMenu from '../LayoutHeaderProfileMenu.vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.layout-header-desktop-right {
  &__name {
    margin: 0 0 0 offsets.$offset-12;
  }
}
</style>