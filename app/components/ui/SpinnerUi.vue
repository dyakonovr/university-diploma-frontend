<template>
  <div
    class="spinner-ui"
    :style="{ width: `${size}px`, height: `${size}px`, borderWidth: `${border}px` }"
  />
</template>

<script setup lang="ts">
type Props = {
  size?: number;
  border?: number;
};

withDefaults(defineProps<Props>(), {
  size: 36,
  border: 3,
});
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.spinner-ui {
  border-style: solid;
  border-color: colors.$border;
  border-top-color: colors.$primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  &.custom-color {
    border-top-color: currentColor;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
