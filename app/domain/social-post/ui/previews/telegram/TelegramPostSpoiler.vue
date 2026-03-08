<template>
  <span
    class="tg-spoiler"
    :class="{ 'tg-spoiler--revealed': revealed }"
    @click="reveal"
  >
    <span class="tg-spoiler__text">
      <slot />
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const revealed = ref(false);

function reveal() {
  revealed.value = true;
}
</script>

<style scoped lang="scss">
.tg-spoiler {
  position: relative;
  cursor: pointer;
  user-select: none;

  &__text {
    filter: blur(6px);
    transition: filter 0.25s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(200, 200, 200, 0.4);
    border-radius: 4px;
    transition: opacity 0.25s ease;
  }

  &--revealed {
    cursor: default;

    .tg-spoiler__text {
      filter: none;
    }

    &::after {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
