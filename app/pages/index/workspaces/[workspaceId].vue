<template>
  <nuxt-page />
</template>

<script setup lang="ts">
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

const route = useRoute();

provide(WORKSPACE_ID_KEY, route.params.workspaceId as string);
</script>
