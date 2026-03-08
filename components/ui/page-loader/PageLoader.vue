<template>
  <client-only>
    <spinner-gap class="page-loader" />
  </client-only>
</template>

<script lang="ts" setup>
import SpinnerGap from '~/assets/images/icons/spinner-gap.svg';
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.page-loader {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
  stroke: colors.$gray-900;
  animation: spin 1.5s linear infinite;
}
</style>