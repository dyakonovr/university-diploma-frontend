<template>
  <nuxt-layout name="account">
    <nuxt-page />
  </nuxt-layout>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
});
</script>
