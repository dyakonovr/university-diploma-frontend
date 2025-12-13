<template>
  <nuxt-link
    class="text-14 weight-500 link-ui"
    :class="{ 'disabled': disabled }"
    :prefetch="false"
    tabindex="0">
    <slot />
  </nuxt-link>
</template>

<script lang="ts" setup>
type Props = {
  disabled?: boolean;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.link-ui {
  color: colors.$primary-normal;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: colors.$primary-active;
  }

  &:active {
    color: colors.$primary-click;
  }

  &:focus-visible {
    outline: 1px solid colors.$primary-normal !important; 
    outline-offset: 2px;
    border-radius: 2px;
  }

  &.disabled {
    color: colors.$gray-400;
    pointer-events: none;
  }
}
</style>