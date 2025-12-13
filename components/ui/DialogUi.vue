<template>
  <transition name="fade">
    <div
      v-if="isOpened"
      class="dialog-ui-wrapper">
      <div
        ref="dialogRef"
        class="dialog-ui">
        <button
          class="dialog-ui__close-btn"
          @click="closeDialog">
          <x-icon />
        </button>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import XIcon from '~/assets/images/icons/x-02.svg';

const dialogRef = ref<HTMLDivElement>();

const isOpened = defineModel<boolean>('isOpened', {
  required: true
});

const closeDialog = () => {
  isOpened.value = false;
};

onClickOutside(dialogRef, () => {
  console.log('@outsideClick');
  closeDialog();
  console.log('@isOpened:', isOpened.value);
});
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.dialog-ui-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.dialog-ui {
  position: relative;
  background-color: colors.$white;
  border-radius: 12px;
  padding: offsets.$offset-32;
  min-width: 450px;

  &__close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: colors.$gray-500;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: colors.$gray-900;
    }

    svg {
      width: 15px;
      height: 15px;
    }
  }
}
</style>