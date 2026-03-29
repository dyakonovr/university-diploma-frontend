<template>
  <nuxt-layout :name="layoutName">
    <nuxt-page />
  </nuxt-layout>
</template>

<script lang="ts" setup>
const route = useRoute();

const HUB_PATHS = ['/workspaces/create'];

const layoutName = computed(() => {
  const path = route.path;
  // Explicit hub pages
  if (HUB_PATHS.includes(path)) return 'hub';
  // Workspace pages (/workspaces/:id/...) use sidebar layout
  if (/^\/workspaces\/[^/]+/.test(path)) return 'default';
  // Everything else uses hub layout (top bar, no sidebar)
  return 'hub';
});

definePageMeta({
  middleware: ["auth"],
});
</script>
