<template>
  <div
    class="loading-wrapper"
    :class="{ 'loading-wrapper--active': loading }"
  >
    <slot />
    <transition name="loading-wrapper-fade">
      <div
        v-if="loading"
        class="loading-wrapper__overlay">
        <spinner-ui
          :size="spinnerSize"
          :border="spinnerBorder" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import SpinnerUi from './SpinnerUi.vue';

type Props = {
  loading?: boolean;
  spinnerSize?: number;
  spinnerBorder?: number;
};

withDefaults(defineProps<Props>(), {
  loading: false,
  spinnerSize: 36,
  spinnerBorder: 3,
});
</script>

<style lang="scss" scoped>
.loading-wrapper {
  position: relative;

  &__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: inherit;
    z-index: 10;
  }
}

.loading-wrapper-fade-enter-active,
.loading-wrapper-fade-leave-active {
  transition: opacity 0.2s ease;
}

.loading-wrapper-fade-enter-from,
.loading-wrapper-fade-leave-to {
  opacity: 0;
}

[data-theme='dark'] .loading-wrapper__overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
