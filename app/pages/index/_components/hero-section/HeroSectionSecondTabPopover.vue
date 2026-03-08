<template>
  <teleport to="body">
    <div
      v-if="open"
      ref="popoverRef"
      class="day-popover"
      :style="style"
      @click.stop
    >
      <slot />
    </div>
  </teleport>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';

type Props = {
  open: boolean
  anchorEl: HTMLElement | null
  offset?: number
}

const props = withDefaults(defineProps<Props>(), {
  offset: 8
});

const emit = defineEmits<{
  (e: 'close'): void
}>();

const popoverRef = ref<HTMLElement | null>(null);

const style = ref<CSSProperties>({
  top: '0px',
  left: '0px',
  position: 'absolute'
});

function updatePosition() {
  if (!props.anchorEl || !popoverRef.value) return;

  const anchor = props.anchorEl.getBoundingClientRect();
  const popover = popoverRef.value.getBoundingClientRect();
  const padding = 8;

  // Mobile / too wide fallback
  const availableWidth = window.innerWidth - padding * 2;
  if (window.innerWidth <= 480 || popover.width > availableWidth) {
    const width = Math.min(popover.width, availableWidth);
    style.value = {
      position: 'fixed',
      top: `${padding}px`,
      left: `${Math.round((window.innerWidth - width) / 2)}px`,
      width: `${width}px`
    };
    return;
  }

  // default: позиционируем под анкором
  let top = anchor.bottom + props.offset;
  let left = anchor.left;

  // если снизу не влезает — сверху
  if (top + popover.height > window.innerHeight) {
    top = anchor.top - popover.height - props.offset;
  }

  if (left + popover.width > window.innerWidth) {
    left = Math.max(padding, window.innerWidth - popover.width - padding);
  }

  if (left < padding) left = padding;

  style.value = {
    position: 'absolute',
    top: `${Math.round(top + window.scrollY)}px`,
    left: `${Math.round(left + window.scrollX)}px`
  };
}

function onClickOutside(e: MouseEvent) {
  if (
    popoverRef.value &&
    !popoverRef.value.contains(e.target as Node) &&
    !props.anchorEl?.contains(e.target as Node)
  ) {
    emit('close');
  }
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

function onResize() {
  // требование: скрывать popover при ресайзе
  emit('close');
}

watch(
  () => props.open,
  async (val) => {
    if (!val) return;
    await nextTick();
    updatePosition();
    document.addEventListener('click', onClickOutside);
    document.addEventListener('keydown', onEsc);
    window.addEventListener('resize', onResize);
  }
);

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
  document.removeEventListener('keydown', onEsc);
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped lang="scss">
@use '/assets/styles/base/colors' as colors;

.day-popover {
  position: absolute;
  z-index: 1000;
  background: colors.$white;
  border: 1px solid colors.$border;
  border-radius: 8px;
  padding: 12px;
  min-width: 220px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}
</style>
