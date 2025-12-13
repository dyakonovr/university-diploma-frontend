<template>
  <div class="main-wrapper">
    <layout-header />
    <main class="main">
      <slot />
    </main>
    <layout-footer />
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from '~/components/layout/header/LayoutHeader.vue';
import LayoutFooter from '~/components/layout/footer/LayoutFooter.vue';
</script>