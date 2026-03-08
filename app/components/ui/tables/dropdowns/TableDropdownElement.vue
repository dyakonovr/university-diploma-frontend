<template>
  <div
    ref="dropdownRef"
    class="dropdown">
    <button
      type="button"
      class="button__action"
      :class="buttonClass"
      @click="toggle"
    >
      <dots-icon />
    </button>

    <teleport to="body">
      <transition name="fade">
        <div
          v-if="isOpen"
          ref="menuRef"
          class="dropdown-menu"
          :style="menuStyle"
          @click="close"
        >
          <slot />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  type CSSProperties,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';

import DotsIcon from '@/assets/images/icons/dots.svg';

defineProps<{
  buttonClass?: string;
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const menuPosition = ref({
  top: 0,
  left: 0,
});

const menuStyle = computed<CSSProperties>(() => ({
  position: 'absolute',
  top: `${menuPosition.value.top}px`,
  left: `${menuPosition.value.left}px`,
  zIndex: 1000,
}));

async function toggle() {
  isOpen.value = !isOpen.value;

  if (isOpen.value) {
    await nextTick();
    updatePosition();
  }
}

function close() {
  isOpen.value = false;
}

function updatePosition() {
  if (!dropdownRef.value || !menuRef.value) return;

  const buttonRect = dropdownRef.value.getBoundingClientRect();
  const menuRect = menuRef.value.getBoundingClientRect();

  const viewportHeight = window.innerHeight;

  const spaceBelow = viewportHeight - buttonRect.bottom;
  const spaceAbove = buttonRect.top;

  const openUpwards = spaceBelow < menuRect.height && spaceAbove > spaceBelow;

  const top = openUpwards
    ? buttonRect.top - menuRect.height - 6
    : buttonRect.bottom + 6;

  menuPosition.value = {
    top: top + window.scrollY,
    left: buttonRect.right - menuRect.width + window.scrollX,
  };
}

function handleClickOutside(event: MouseEvent) {
  if (
    dropdownRef.value &&
    menuRef.value &&
    !dropdownRef.value.contains(event.target as Node) &&
    !menuRef.value.contains(event.target as Node)
  ) {
    close();
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close();
  }
}

function handleScroll() {
  close();
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', updatePosition);
  window.addEventListener('scroll', handleScroll, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', handleScroll, true);
});
</script>

<style scoped lang="scss">
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  min-width: 180px;
  padding: 12px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 4px 4px 0px #00000040;
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
