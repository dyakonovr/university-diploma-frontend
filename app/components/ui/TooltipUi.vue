<template>
  <client-only>
    <!-- Триггер -->
    <span
      ref="triggerRef"
      class="tooltip-trigger"
      @click="close"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @focus="onMouseEnter"
      @blur="onMouseLeave"
    >
      <slot />
    </span>

    <!-- Tooltip -->
    <teleport to="body">
      <div
        v-if="isVisible"
        ref="tooltipRef"
        class="tooltip"
        :class="[
          `tooltip-${placement}`,
          tooltipClass,
          { 'no-arrow': !hasArrow, 'tooltip--closing': isClosing },
          'text-14',
        ]"
        :style="style"
        role="tooltip"
      >
        <span
          v-if="rawContent"
          v-html="content" />
        <template v-else>{{ content }}</template>
      </div>
    </teleport>
  </client-only>
</template>

<script lang="ts" setup>
type Props = {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right-center' | 'right-top';
  offset?: number;
  disabled?: boolean;
  tooltipClass?: string;
  hasArrow?: boolean;
  rawContent?: boolean;
  showDelay?: number;
  hideDelay?: number;
};

const props = withDefaults(defineProps<Props>(), {
  offset: 8,
  placement: 'top',
  disabled: false,
  tooltipClass: '',
  hasArrow: true,
  rawContent: false,
  showDelay: 0,
  hideDelay: 0,
});

const CLOSE_ANIMATION_DURATION = 150;

const triggerRef = ref<HTMLSpanElement | null>(null);
const tooltipRef = ref<HTMLDivElement | null>(null);
const isOpen = ref(false);
const isClosing = ref(false);
const isVisible = computed(() => isOpen.value || isClosing.value);

let showTimer: ReturnType<typeof setTimeout> | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let closeAnimTimer: ReturnType<typeof setTimeout> | null = null;

const style = ref({
  top: '0px',
  left: '0px',
});

function clearTimers() {
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  if (closeAnimTimer) {
    clearTimeout(closeAnimTimer);
    closeAnimTimer = null;
  }
}

function open() {
  if (props.disabled) return;

  // Cancel any pending close
  isClosing.value = false;
  if (closeAnimTimer) {
    clearTimeout(closeAnimTimer);
    closeAnimTimer = null;
  }

  isOpen.value = true;

  nextTick(() => {
    if (!triggerRef.value || !tooltipRef.value) return;

    const triggerRect = triggerRef.value.getBoundingClientRect();
    const tooltipRect = tooltipRef.value.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (props.placement) {
      case 'bottom':
        top = triggerRect.bottom + props.offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;

      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - props.offset;
        break;

      case 'right-center':
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + props.offset;
        break;

      case 'right-top':
        top = triggerRect.top;
        left = triggerRect.right + props.offset;
        break;

      case 'top':
      default:
        top = triggerRect.top - tooltipRect.height - props.offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    }

    style.value = {
      top: `${top + window.scrollY}px`,
      left: `${left + window.scrollX}px`,
    };
  });
}

function close() {
  if (!isOpen.value) return;

  isOpen.value = false;
  isClosing.value = true;

  closeAnimTimer = setTimeout(() => {
    isClosing.value = false;
  }, CLOSE_ANIMATION_DURATION);
}

function onMouseEnter() {
  clearTimers();

  if (props.showDelay > 0) {
    showTimer = setTimeout(() => open(), props.showDelay);
  } else {
    open();
  }
}

function onMouseLeave() {
  clearTimers();

  if (props.hideDelay > 0) {
    hideTimer = setTimeout(() => close(), props.hideDelay);
  } else {
    close();
  }
}

onBeforeUnmount(() => {
  clearTimers();
  isOpen.value = false;
  isClosing.value = false;
});
</script>

<style lang="scss">
/* Tooltip container */
.tooltip {
  position: absolute;
  z-index: 9999;
  background: rgba(60, 60, 60, 0.95);
  color: white;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;

  max-width: 300px;
  white-space: normal;

  opacity: 0;
  transform: scale(0.95);
  animation: tooltip-in 0.15s ease forwards;

  &--closing {
    animation: tooltip-out 0.15s ease forwards;
  }

  &.no-arrow {
    &::after,
    &-top::after,
    &-bottom::after,
    &-left::after,
    &-right::after {
      display: none;
    }
  }

  &::after {
    content: '';
    position: absolute;
    border: 6px solid transparent;
  }

  &-top {
    &::after {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-top-color: rgba(60, 60, 60, 0.95);
    }
  }

  &-bottom {
    &::after {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-color: rgba(60, 60, 60, 0.95);
    }
  }

  &-left {
    &::after {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-left-color: rgba(60, 60, 60, 0.95);
    }
  }

  &-right {
    &::after {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-right-color: rgba(60, 60, 60, 0.95);
    }
  }
}

/* Анимации */
@keyframes tooltip-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes tooltip-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
