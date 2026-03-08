<template>
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
});
</script>
