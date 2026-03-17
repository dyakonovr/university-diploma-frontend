<template>
  <div
    ref="scrollContainer"
    class="table-wrapper"
    :class="{ 'fixed-header': isFixedHeader }"
    @scroll="handleScroll"
  >
    <table class="table-ui text-14">
      <thead>
        <tr>
          <slot
            name="head"
            v-bind="{ hasRightScroll }" />
        </tr>
      </thead>
      <tbody>
        <slot
          v-if="!isEmpty"
          name="body"
          v-bind="{ hasRightScroll }" />
        <template v-if="isEmpty">
          <td class="table-ui__empty-row" />
          <div class="table-ui__empty-text text-14">
            <!-- <inbox-icon class="table-ui__empty-icon" /> -->
            Нет данных
          </div>
        </template>
      </tbody>
    </table>
    <transition name="fade">
      <div
        v-show="loading"
        class="table-ui__loader-wrapper">
        <!-- <loading-icon /> -->
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

export type TableElementProps = {
  loading?: boolean;
  isEmpty?: boolean;
  isFixedHeader?: boolean;
};

const emit = defineEmits<{
  (e: 'scrollEnd'): void;
}>();

const scrollContainer = ref<HTMLDivElement | null>(null);
const hasRightScroll = ref(false);

const checkScrollState = () => {
  const container = scrollContainer.value;
  if (!container) return;

  const scrollRight =
    container.scrollWidth - (container.scrollLeft + container.clientWidth);
  hasRightScroll.value = scrollRight > 2;
};

const handleScroll = () => {
  checkScrollState();

  const container = scrollContainer.value;
  if (!container) return;

  if (
    container.scrollTop + container.clientHeight >=
    container.scrollHeight - 10
  ) {
    emit('scrollEnd');
  }
};

defineProps<TableElementProps>();

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  const container = scrollContainer.value;
  if (!container) return;

  checkScrollState();

  resizeObserver = new ResizeObserver(() => checkScrollState());
  resizeObserver.observe(container);

  window.addEventListener('resize', checkScrollState);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', checkScrollState);
});
</script>

<style lang="scss">
@use '/assets/styles/mixins/text' as textMixins;
@use '/assets/styles/base/colors' as colors;

.table-wrapper {
  position: relative;
  overflow-x: auto;
  border: 1px solid colors.$border;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);

  &.fixed-header {
    overflow-y: auto;

    .table-ui {
      overflow: auto;
      border-collapse: separate;
      border-top: 0;

      th,
      td {
        border-bottom: 1px solid colors.$border;
      }

      th {
        position: sticky;
        top: 0;
        background-color: colors.$white;
        z-index: 5;
      }
    }
  }
}

.table-ui {
  border-spacing: 0;
  background-color: colors.$white;
  overflow: hidden;
  width: 100%;

  &__loader-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: colors.$black;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 12px;
  }

  &__empty-row {
    height: 400px;
    border-bottom: 0 !important;
  }

  &__empty-icon {
    color: grey;
    width: 48px;
    height: 48px;
  }

  &__empty-text {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 32px;
    width: 100%;
    height: 100%;
    padding: 24px;
    background-color: grey;
  }

  & th,
  & td {
    padding: 16px;
    text-align: start;
    vertical-align: middle;
  }

  th.table-ui__cell--fixed-right,
  td.table-ui__cell--fixed-right {
    position: sticky !important;
    right: 0;
    z-index: 6;
    background-color: colors.$white;
    transition: background-color 0.2s ease-in-out;
  }

  .table-ui__cell--fixed-right.is-shadow {
    box-shadow: -4px 0 6px -2px rgba(0, 0, 0, 0.1);
  }

  th.table-ui__cell--fixed-right {
    z-index: 7;
  }

  & thead tr {
    @include textMixins.text-14;

    color: colors.$text-light;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-size: 12px;

    th {
      background-color: #f9fafb;
    }
  }

  & tr {
    transition: background-color 0.15s ease-in-out;
    border-bottom: 1px solid colors.$border;

    &.active,
    &:hover,
    &:hover td.table-ui__cell--fixed-right {
      background-color: #f9fafb;
    }

    &:last-child td {
      border-bottom: 0 !important;
    }
  }

  & tbody {
    position: relative;

    tr td {
      @include textMixins.text-14;
    }
  }
}

.cell-aligment-right {
  text-align: end !important;
}
</style>
