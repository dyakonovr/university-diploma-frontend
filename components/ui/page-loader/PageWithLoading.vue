<template>
  <page-loader v-if="model" />
  <template v-else>
    <slot />
  </template>
</template>

<script lang="ts" setup>
import PageLoader from './PageLoader.vue';

const model = defineModel<boolean>();
</script>