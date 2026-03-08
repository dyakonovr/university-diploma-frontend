<template>
  <nuxt-layout name="landing">
    <nuxt-page />
  </nuxt-layout>
</template>

<script setup lang="ts">
import { useThemeStore } from '~/shared/stores/theme';

const themeStore = useThemeStore();

onBeforeMount(() => {
  themeStore.setInitialTheme();
});
</script>
