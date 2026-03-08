<template>
  <div
    class="flow-nav"
    :class="{
      'flow-nav--collapsed': isCollapsed,
      'flow-nav--hovered': isHovered && isCollapsed,
    }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onRootClick"
  >
    <!-- Collapsed state -->
    <div
      v-if="isCollapsed"
      class="flow-nav__collapsed-trigger">
      <text-icon />
    </div>

    <!-- Expanded state -->
    <div
      v-else
      ref="contentRef"
      class="flow-nav__content"
      @click.stop>
      <div class="flow-nav__header">
        <p class="flow-nav__header-title">Содержание</p>
        <button
          class="flow-nav__collapse-btn"
          @click="close">✕</button>
      </div>

      <ol class="flow-nav__body">
        <li
          v-for="(stage, sIdx) in tree"
          :key="stage.ui.uuid"
          class="flow-nav__stage"
        >
          <button
            class="flow-nav__link"
            :title="getStageName(stage)"
            @click="scrollTo(`stage-${stage.ui.uuid}`)"
          >
            Этап —
            {{ getStageName(stage) }}
          </button>

          <ul
            v-for="(step, stepIdx) in stage.steps"
            :key="step.ui.uuid"
            class="flow-nav__step"
          >
            <li>
              <button
                class="flow-nav__sublink"
                @click="scrollTo(`step-${step.ui.uuid}`)"
              >
                Шаг {{ sIdx + 1 }}.{{ stepIdx + 1 }}
              </button>
            </li>
          </ul>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

import TextIcon from '~/assets/images/icons/text.svg';

import useFlowConstructorStore from '../stores/constructor-store';
import type { StageViewModel } from '../view-models/stage.view-model';

const store = useFlowConstructorStore();
const tree = computed(() => store.tree);

const contentRef = ref<HTMLElement | null>(null);

const isCollapsed = ref(true);
const isHovered = ref(false);

const getStageName = (stageVM: StageViewModel): string => {
  return stageVM.name || 'Не указано';
};

/* --------------------------
   OPEN / CLOSE
-------------------------- */

const open = () => {
  isCollapsed.value = false;
};

const close = () => {
  isCollapsed.value = true;
};

/* --------------------------
   CLICK HANDLING
-------------------------- */

// В collapsed состоянии клик по ЛЮБОЙ области открывает
const onRootClick = () => {
  if (isCollapsed.value) {
    open();
  }
};

const onMouseEnter = () => {
  if (isCollapsed.value) {
    isHovered.value = true;
  }
};

const onMouseLeave = () => {
  isHovered.value = false;
};

/* --------------------------
   SCROLL
-------------------------- */

const scrollTo = async (id: string) => {
  // Auto-expand collapsed stages/steps before scrolling
  const isStep = id.startsWith('step-');
  const targetUuid = id.replace(/^(stage|step)-/, '');

  for (const stage of tree.value) {
    if (!isStep && stage.ui.uuid === targetUuid) {
      if (stage.ui.is_collapsed) stage.ui.is_collapsed = false;
      break;
    }

    if (isStep) {
      const step = stage.steps.find((s) => s.ui.uuid === targetUuid);
      if (step) {
        if (stage.ui.is_collapsed) stage.ui.is_collapsed = false;
        if (step.ui.is_collapsed) step.ui.is_collapsed = false;
        break;
      }
    }
  }

  await nextTick();

  const el = document.getElementById(id);
  el?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
  close();
};

/* --------------------------
   ESCAPE CLOSE
-------------------------- */

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && !isCollapsed.value) {
    close();
  }
};

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});

/* --------------------------
   OUTSIDE CLICK
-------------------------- */

onClickOutside(contentRef, () => {
  if (!isCollapsed.value) {
    close();
  }
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.flow-nav {
  --background-color: #{colors.$border};

  position: fixed;
  top: 56px;
  right: 24px;
  z-index: 1000;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.25s ease;

  /* =========================
     COLLAPSED
  ========================= */

  &--collapsed {
    width: 56px;
    height: 56px;
    background: rgba(var(--background-color), 0.5);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &--hovered {
    background: rgba(var(--background-color), 0.85);
    transform: scale(1.05);
  }

  &__collapsed-trigger {
    pointer-events: none; // кликается весь контейнер
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  /* =========================
     EXPANDED
  ========================= */

  &__content {
    width: 300px;
    padding: 16px;
    background: white;
    border-radius: 16px;
    animation: fadeIn 0.2s ease;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    &-title {
      font-weight: 800;
    }
  }

  &__collapse-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }

  &__body {
    overflow-y: auto;
    max-height: 350px;
    padding-left: 40px; // чтобы маркеры не обрезались
  }

  &__stage {
    margin: 0;
  }

  &__link,
  &__sublink {
    background: transparent;
    border: none;
    padding: 4px 0;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    transition: color 0.2s ease;

    display: -webkit-box;
    -webkit-line-clamp: 2; // 2 строки
    -webkit-box-orient: vertical;
    overflow: hidden;

    word-break: break-word; // перенос длинных слов
    overflow-wrap: anywhere; // ещё более агрессивный перенос

    &:hover {
      color: #4f46e5;
    }
  }

  &__sublink {
    font-size: 13px;
    opacity: 0.8;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
