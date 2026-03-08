<template>
  <div
    class="lds-spinner"
    :style="spinnerStyle">
    <div/>
    <div/>
    <div/>
    <div/>
    <div/>
    <div/>
    <div/>
    <div/>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  size?: number;
}>(), {
  size: 20
});

const spinnerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  '--spinner-size': `${props.size}px`
}));
</script>

<style scoped>
/* https://loading.io/css/, 12-e icon  */

.lds-spinner {
  display: inline-block;
  position: relative;
}

.lds-spinner div {
  transform-origin: calc(var(--spinner-size) / 2) calc(var(--spinner-size) / 2);
  animation: lds-spinner .96s linear infinite;
}

.lds-spinner div:after {
  content: "";
  display: block;
  position: absolute;
  top: calc(var(--spinner-size) * 0.03);
  left: calc(var(--spinner-size) * 0.45);
  width: calc(var(--spinner-size) * 0.09);
  height: calc(var(--spinner-size) * 0.2);
  border-radius: calc(var(--spinner-size) * 0.02);
  background: currentColor;
}

.lds-spinner div:nth-child(1) { transform: rotate(45deg); animation-delay: -0.96s; }
.lds-spinner div:nth-child(2) { transform: rotate(90deg); animation-delay: -0.84s; }
.lds-spinner div:nth-child(3) { transform: rotate(135deg); animation-delay: -0.72s; }
.lds-spinner div:nth-child(4) { transform: rotate(180deg); animation-delay: -0.60s; }
.lds-spinner div:nth-child(5) { transform: rotate(225deg); animation-delay: -0.48s; }
.lds-spinner div:nth-child(6) { transform: rotate(270deg); animation-delay: -0.36s; }
.lds-spinner div:nth-child(7) { transform: rotate(315deg); animation-delay: -0.24s; }
.lds-spinner div:nth-child(8) { transform: rotate(360deg); animation-delay: -0.12s; }

@keyframes lds-spinner {
  0% { opacity: 1; }
  100% { opacity: 0.15; }
}
</style>