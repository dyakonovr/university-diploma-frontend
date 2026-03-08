<template>
  <div
    ref="dayRef"
    class="day"
    :class="{ today: day.isToday, open: isOpen }"
    @click.stop="toggle"
  >
    <div class="number">{{ day.number }}</div>

    <div class="dots">
      <span
        v-for="post in day.posts"
        :key="post.id"
        class="dot"
        :class="post.status"
      />
    </div>

    <teleport to="body">
      <div
        v-if="isOpen"
        ref="popoverRef"
        class="popover"
        :style="style"
        @click.stop
      >
        <!-- HEADER -->
        <div class="title">{{ dayTitle }}</div>

        <!-- POSTS -->
        <div
          v-if="day.posts.length"
          class="posts">
          <div
            v-for="post in sortedPosts"
            :key="post.id"
            class="post-tile"
          >
            <div class="post-time">{{ post.time }}</div>

            <div class="post-content">
              <div class="post-title">{{ post.title }}</div>
            </div>

            <div
              class="post-status"
              :class="post.status" />
          </div>
        </div>

        <div
          v-else
          class="empty">
          Нет постов
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import type { CalendarDayData } from './HeroSectionSecondTab.vue';

const props = defineProps<{
  day: CalendarDayData;
  openedDay: string | null;
}>();

const emit = defineEmits<{
  (e: 'open', date: string): void;
  (e: 'close'): void;
}>();

const dayRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);

const isOpen = computed(() => props.openedDay === props.day.date);

const style = ref<Record<string, string>>({ top: '0px', left: '0px', position: 'absolute' });

/* ===== SORT POSTS ===== */
const sortedPosts = computed(() =>
  [...props.day.posts].sort((a, b) => a.time.localeCompare(b.time))
);

/* ===== TITLE ===== */
const dayTitle = computed(() => {
  // props.day.date уже в формате YYYY-MM-DD (локальная)
  const [y, m, d] = props.day.date.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
});

/* ===== OPEN / CLOSE ===== */
function toggle() {
  isOpen.value ? emit('close') : emit('open', props.day.date);
}

/* ===== POSITION ===== */
function positionPopover() {
  if (!dayRef.value || !popoverRef.value) return;

  const trigger = dayRef.value.getBoundingClientRect();
  const pop = popoverRef.value.getBoundingClientRect();
  const padding = 8;

  // Mobile / too wide fallback: fixed, centered, с отступами по краям
  const availableWidth = window.innerWidth - padding * 2;
  if (window.innerWidth <= 480 || pop.width > availableWidth) {
    const width = Math.min(pop.width, availableWidth);
    style.value = {
      position: 'fixed',
      top: `${padding}px`,
      left: `${Math.round((window.innerWidth - width) / 2)}px`,
      width: `${width}px`
    };
    return;
  }

  // default: позиционируем относительно триггера (абсолютно в body)
  let top = trigger.bottom + padding;
  let left = trigger.left;

  // снизу не влезает → вверх
  if (top + pop.height > window.innerHeight) {
    top = trigger.top - pop.height - padding;
  }

  // справа не влезает → сдвигаем
  if (left + pop.width > window.innerWidth) {
    left = Math.max(padding, window.innerWidth - pop.width - padding);
  }

  if (left < padding) {
    left = padding;
  }

  style.value = {
    position: 'absolute',
    top: `${Math.round(top + window.scrollY)}px`,
    left: `${Math.round(left + window.scrollX)}px`
  };
}

/* ===== OUTSIDE & ESC & RESIZE ===== */
function onClickOutside(e: MouseEvent) {
  if (
    !popoverRef.value?.contains(e.target as Node) &&
    !dayRef.value?.contains(e.target as Node)
  ) emit('close');
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}

function onResize() {
  // требование 2: скрывать popover при ресайзе
  emit('close');
}

/* ===== WATCH ===== */
watch(isOpen, async (val) => {
  if (!val) {
    document.removeEventListener('click', onClickOutside);
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', onResize);
    return;
  }

  await nextTick();
  positionPopover();

  document.addEventListener('click', onClickOutside);
  document.addEventListener('keydown', onKeydown);
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
  document.removeEventListener('keydown', onKeydown);
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped lang="scss">
.day {
  height: 100%;
  border: 1px solid #ddd;
  padding: 6px;
  cursor: pointer;

  &.today {
    border-color: #409eff;
  }

  &.open {
    border-color: #2b6cb0;
  }
}

.number {
  font-size: 13px;
  font-weight: 600;
}

.dots {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;

  &.published { background: #4caf50 }
  &.pending { background: #ff9800 }
  &.error { background: #f44336 }
}

/* ===== POPOVER ===== */

.popover {
  position: absolute;
  z-index: 1000;
  width: 260px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.title {
  font-weight: 600;
  margin-bottom: 10px;
  text-transform: capitalize;
}

/* ===== POSTS (TILES) ===== */

.posts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.post-tile {
  display: grid;
  grid-template-columns: 42px 1fr 8px;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  background: #f7f8fa;
  align-items: center;
}

.post-time {
  font-size: 12px;
  color: #666;
}

.post-title {
  font-size: 13px;
}

.post-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.published { background: #4caf50 }
  &.pending { background: #ff9800 }
  &.error { background: #f44336 }
}

.empty {
  font-size: 12px;
  color: #777;
}
</style>
