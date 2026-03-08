<template>
  <div
    ref="wrap"
    class="custom-scrollbar"
    tabindex="-1">
    <div
      ref="resize"
      class="custom-scrollbar__wrap custom-scrollbar__wrap--hidden-default"
      @scroll="handleScroll"
      @wheel="handleWheel"
    >
      <div
        ref="view"
        class="custom-scrollbar__view"
        :style="{ paddingRight: showTrack ? `calc(4px + ${offset}px)` : 0 }"
      >
        <slot />
      </div>
    </div>

    <div
      v-show="showTrack"
      class="custom-scrollbar__bar is-vertical"
      :class="{ 'custom-scrollbar__bar--active': isDragging }"
    >
      <div
        ref="thumb"
        class="custom-scrollbar__thumb"
        :style="thumbStyle"
        @mousedown="handleThumbMouseDown"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, type Ref, ref, watch } from 'vue';
// Свой аналог ElScrollbar из element-plus

export type CustomScrollProps = {
  height?: number;
  offset?: number;
};

export type CustomScrollbarExposed = {
  wrap: Ref<HTMLElement | null>;
  resize: Ref<HTMLElement | null>;
  view: Ref<HTMLElement | null>;
  thumb: Ref<HTMLElement | null>;
  update: () => void;
  shouldSetHeightCalc: () => void;
};

const props = withDefaults(defineProps<CustomScrollProps>(), {
  height: 200,
  offset: 4,
});

const wrap = ref<HTMLElement | null>(null);
const resize = ref<HTMLElement | null>(null);
const view = ref<HTMLElement | null>(null);
const thumb = ref<HTMLElement | null>(null);

const isDragging = ref<boolean>(false);
const scrollTop = ref<number>(0);
const thumbHeight = ref<number>(0);
const thumbTop = ref<number>(0);
const showTrack = ref<boolean>(false);
const shouldSetHeight = ref(false);
// const shouldSetHeight = computed(() => {
//   if (!view.value) return false;
//   return view.value.scrollHeight > props.height;
// });
const shouldSetHeightCalc = () => {
  if (!view.value) shouldSetHeight.value = false;
  else shouldSetHeight.value = view.value.scrollHeight > props.height;
};

const height = computed(() => {
  return shouldSetHeight.value ? `${props.height}px` : 'auto';
});

// Стили ползунка
const thumbStyle = computed(() => ({
  height: `${thumbHeight.value}px`,
  transform: `translateY(${thumbTop.value}px)`,
}));

const emit = defineEmits(['reach-end']);

const update = () => {
  if (!wrap.value || !view.value) return;

  const wrapHeight = wrap.value.clientHeight;
  const viewHeight = view.value.scrollHeight;

  // Корректируем высоту ползунка
  thumbHeight.value = Math.min(
    Math.max((wrapHeight * wrapHeight) / viewHeight, 20),
    wrapHeight,
  );

  // Корректируем максимальную позицию
  const maxScroll = Math.max(1, viewHeight - wrapHeight);
  const scrollRatio = scrollTop.value / maxScroll;

  // Ограничиваем позицию ползунка
  thumbTop.value = Math.min(
    scrollRatio * (wrapHeight - thumbHeight.value),
    wrapHeight - thumbHeight.value - 1,
  );

  showTrack.value = viewHeight > wrapHeight;
};

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const maxScroll = view.value!.scrollHeight - wrap.value!.clientHeight;
  scrollTop.value = Math.min(target.scrollTop, maxScroll);
  update();

  // Проверяем, достигли ли мы конца списка
  const threshold = 50; // Запас в 50px до конца
  if (
    target.scrollTop + target.clientHeight >=
    target.scrollHeight - threshold
  ) {
    emit('reach-end');
  }
};

// Перетаскивание ползунка
const handleThumbMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  isDragging.value = true;

  const startY = e.clientY;
  const startTop = thumbTop.value;
  const containerHeight = resize.value!.clientHeight;
  const contentHeight = view.value!.scrollHeight;

  const mouseMove = (ev: MouseEvent) => {
    if (!isDragging.value) return;

    const deltaY = ev.clientY - startY;
    let newTop = startTop + deltaY;

    // Ограничиваем движение ползунка
    newTop = Math.max(0, Math.min(newTop, containerHeight - thumbHeight.value));

    // Синхронизируем с прокруткой контента
    const scrollSpace = contentHeight - containerHeight;
    resize.value!.scrollTop =
      (newTop / (containerHeight - thumbHeight.value)) * scrollSpace;
  };

  const mouseUp = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
  };

  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseUp);
};

// Реакция на колесо мыши
const handleWheel = (e: WheelEvent) => {
  const delta = e.deltaY * 0.5;
  view.value!.scrollTop += delta;
};

watch(view, () => {
  shouldSetHeightCalc();
});

watch(
  () => props.height,
  () => {
    shouldSetHeightCalc();
  },
);

// Ресайз обзервер
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  resizeObserver = new ResizeObserver(() => {
    shouldSetHeightCalc();
    update();
  });
  if (resize.value) resizeObserver.observe(resize.value);
  if (view.value) resizeObserver.observe(view.value);
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
});

defineExpose<CustomScrollbarExposed>({
  wrap,
  resize,
  thumb,
  view,
  update,
  shouldSetHeightCalc,
});
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.custom-scrollbar {
  position: relative;
  height: v-bind(height);
  overflow: hidden;

  &__wrap {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  &__wrap--hidden-default {
    scrollbar-width: none;
  }
  &__wrap--hidden-default::-webkit-scrollbar {
    display: none;
  }

  &__view {
    position: relative;
    min-height: 100%;
  }

  &__bar {
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 1;
    border-radius: 2px;
    opacity: 0;
    transition: opacity 120ms ease-out;
  }

  &__bar.is-vertical {
    width: 4px !important;
    top: 0px !important;
  }

  &__thumb {
    position: relative;
    width: 100%;
    height: 0;
    background-color: colors.$text-light;
    border-radius: inherit;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  &:hover .custom-scrollbar__bar,
  &__bar--active {
    opacity: 1;
  }

  &__thumb:hover,
  &__bar--active &__thumb {
    background-color: #bdc2c5b2;
  }
}
</style>
