<template>
  <button
    class="burger-button"
    @click="model = !model">
    <span :class="{ open: model }" />
    <span :class="{ open: model }" />
    <span :class="{ open: model }" />
  </button>
</template>

<script lang="ts" setup>
const model = defineModel<boolean>();
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.burger-button {
  width: 20px;
  height: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
}

.burger-button span {
  display: block;
  width: 100%;
  height: 1px;
  background-color: colors.$primary-normal;
  border-radius: 2px;
  transition: 0.3s;
}

.burger-button span:nth-child(3) {
  width: 9px;
}

.burger-button span.open:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.burger-button span.open:nth-child(2) {
  opacity: 0;
}

.burger-button span.open:nth-child(3) {
  transform: translateY(-5px) rotate(-45deg);
  width: 100%;
}
</style>
