<template>
  <header class="layout-header">
    <burger-button v-model="isBurgerMenuOpened" />
    <logo />
    <layout-header-profile-menu />
    <layout-header-mobile-menu v-model="isBurgerMenuOpened" />
  </header>
</template>

<script lang="ts" setup>
import BurgerButton from './BurgerButton.vue';
import LayoutHeaderProfileMenu from '../LayoutHeaderProfileMenu.vue';
import LayoutHeaderMobileMenu from './LayoutHeaderMobileMenu.vue';
import Logo from '../Logo.vue';

const isBurgerMenuOpened = ref(false);
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;

.layout-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: offsets.$offset-12;
  padding: offsets.$offset-8 offsets.$offset-24;
  background-color: colors.$white;
  border-bottom: 1px solid colors.$gray-200;
}
</style>