<template>
  <teleport to="body">
    <transition name="dropdown-fade">
      <ul
        v-if="visible"
        ref="dropdownEl"
        class="select-ui__list list-reset"
        :class="`${elClass} ${$slots.dropdownFooter && 'select-ui__list--with-footer'}`"
        :style="styles"
        tabindex="-1"
        @keydown="emit('keydown', $event)"
        @focusout="onFocusOut"
      >
        <p
          v-if="loading"
          class="select-ui__loading">Загрузка...</p>
        <p
          v-else-if="!loading && options.length === 0"
          class="select-ui__loading"
        >
          Нет данных
        </p>
        <template v-else>
          <custom-scrollbar
            ref="scrollRef"
            v-bind="scrollbarProps"
            @reach-end="onReachEnd"
          >
            <button
              v-for="(item, idx) in options"
              :key="String(item[valueField])"
              type="button"
              :class="{
                'select-ui__list-item': true,
                picked: isPicked(item),
                active: activeIndex === idx,
              }"
              tabindex="0"
              @click.prevent="onSelect(item)"
              @focus="activeIndex = idx"
            >
              <slot
                name="option"
                :option="item">
                {{ item[labelField] }}
              </slot>
            </button>
          </custom-scrollbar>
          <div
            v-if="$slots.dropdownFooter"
            class="select-ui__dropdown-footer">
            <slot name="dropdownFooter" />
          </div>
        </template>
      </ul>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { type CSSProperties, nextTick, ref, watch } from 'vue';

import CustomScrollbar, { type CustomScrollProps } from '../ScrollbarUi.vue';

type OptionsRecord = Record<string, unknown>;

type Props = {
  options: OptionsRecord[];
  valueField?: string;
  labelField?: string;
  loading?: boolean;
  isMultiple?: boolean;
  model?: unknown;
  visible?: boolean;
  styles?: CSSProperties | undefined;
  scrollbarProps?: CustomScrollProps;
  elClass?: string;
};

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'select', item: OptionsRecord): void;
  (e: 'reach-end'): void;
  (e: 'focusout', ev: FocusEvent): void;
  (e: 'keydown', ev: KeyboardEvent): void;
}>();

const dropdownEl = ref<HTMLElement | null>(null);
const scrollRef = ref<InstanceType<typeof CustomScrollbar> | null>(null);
const activeIndex = ref<number | null>(null);

const valueField = props.valueField ?? 'value';
const labelField = props.labelField ?? 'label';

const isPicked = (item: OptionsRecord) => {
  if (!props.isMultiple) return item[valueField] === props.model;
  if (Array.isArray(props.model)) return props.model.includes(item[valueField]);
  return false;
};

const onSelect = (item: OptionsRecord) => {
  emit('select', item);
};

const onReachEnd = () => {
  emit('reach-end');
};

const onFocusOut = (event: FocusEvent) => {
  emit('focusout', event);
};

/**
 * Измеряет высоту dropdown элемента (включая скроллбар).
 * Временно делает элемент видимым для корректного измерения.
 * @returns {number} высота в px
 */
const measureHeight = () => {
  if (!dropdownEl.value) return 0;

  const originalStyles = {
    display: dropdownEl.value.style.display,
    visibility: dropdownEl.value.style.visibility,
    position: dropdownEl.value.style.position,
  };

  // Сделаем элемент видимым для корректного измерения, но невидимым пользователю
  dropdownEl.value.style.display = 'block';
  dropdownEl.value.style.visibility = 'hidden';
  dropdownEl.value.style.position = 'absolute';

  // Сначала попросим скроллбар пересчитать, затем дождёмся рендера
  scrollRef.value?.shouldSetHeightCalc?.();
  scrollRef.value?.update?.();

  const height = dropdownEl.value.offsetHeight;

  // Восстанавливаем старые стили
  Object.assign(dropdownEl.value.style, originalStyles);

  return height;
};

const contains = (node: Node | null) => {
  return !!(dropdownEl.value && node && dropdownEl.value.contains(node));
};

/**
 * Навигация стрелками по опциям dropdown.
 * Устанавливает `activeIndex`, переводит фокус и прокручивает опцию в видимую область.
 * @param {'up' | 'down'} type — направление навигации
 */
const handleArrow = async (type: 'up' | 'down') => {
  await nextTick();
  if (!props.visible || props.loading || props.options.length === 0) return;

  if (activeIndex.value === null) {
    activeIndex.value = type === 'down' ? 0 : props.options.length - 1;
  } else {
    activeIndex.value =
      type === 'down'
        ? Math.min(activeIndex.value + 1, props.options.length - 1)
        : Math.max(activeIndex.value - 1, 0);
  }

  await nextTick();

  const wrapEl = scrollRef.value?.wrap;
  if (!wrapEl) return;

  const buttons = wrapEl.querySelectorAll('button');
  const btn = buttons?.[activeIndex.value ?? -1] as HTMLElement | undefined;
  if (!btn) return;

  btn.focus();

  // Прокручиваем кнопку в видимую область внутри custom scrollbar
  const scrollContainer = scrollRef.value?.resize;
  if (scrollContainer) {
    const containerRect = scrollContainer.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    if (btnRect.bottom > containerRect.bottom) {
      scrollContainer.scrollTop += btnRect.bottom - containerRect.bottom;
    } else if (btnRect.top < containerRect.top) {
      scrollContainer.scrollTop -= containerRect.top - btnRect.top;
    }
  }
};

/** Выбирает текущий активный элемент (по `activeIndex`) и вызывает emit('select'). */
const handleEnter = () => {
  if (activeIndex.value !== null && props.options[activeIndex.value]) {
    onSelect(props.options[activeIndex.value]);
  }
};

defineExpose({
  dropdownEl,
  measureHeight,
  contains,
  handleArrow,
  handleEnter,
});

watch(
  () => props.visible,
  (v) => {
    if (v) {
      nextTick(() => {
        scrollRef.value?.shouldSetHeightCalc();
      });
    } else activeIndex.value = null;
  },
);
</script>
