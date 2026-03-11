<template>
  <nuxt-layout name="default">
    <nuxt-page />
  </nuxt-layout>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
});
</script>
