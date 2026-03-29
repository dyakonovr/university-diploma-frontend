<template>
  <div class="hub-layout">
    <hub-top-bar />
    <main class="hub-layout__main">
      <div class="hub-layout__content">
        <slot v-if="$slots.default" />
        <nuxt-page v-else />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import HubTopBar from "~/components/layouts/hub/HubTopBar.vue";
</script>

<style lang="scss">
.hub-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;

  &__main {
    flex: 1;
    overflow-y: auto;
    background-color: var(--color-background);
  }

  &__content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 32px;
    width: 100%;

    @media screen and (max-width: 768px) {
      padding: 16px;
    }
  }
}
</style>
