<template>
  <button
    type="button"
    class="fcb">
    <x-icon />
  </button>
</template>

<script lang="ts" setup>
import XIcon from '@/assets/images/icons/x.svg';
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.fcb {
  position: absolute !important;
  right: 8px;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px !important;
  height: 16px !important;
  transform: translateY(-50%);
  cursor: pointer;
  border: 1px solid colors.$text-light;
  border-radius: 100% !important;
  color: colors.$text-light;

  // &:not(:disabled):hover svg {
  //   color: colors.$primary;
  // }

  svg {
    width: 8px;
    height: 8px;
    transition: color 0.15s ease-in-out;
  }
}
</style>
