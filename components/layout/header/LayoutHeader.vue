<template>
  <layout-header-mobile v-if="$viewport.isLessThan('xl')" />
  <layout-header-desktop v-else />
</template>

<script lang="ts" setup>
// import { useUserStore } from '~/stores/user';
import LayoutHeaderDesktop from './desktop/LayoutHeaderDesktop.vue';
import LayoutHeaderMobile from './mobile/LayoutHeaderMobile.vue';

const { $viewport } = useNuxtApp();
// const userStore = useUserStore();

// onMounted(() => {
//   userStore.getUser();
// });
</script>