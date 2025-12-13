<template>
  <div class="table-wrapper">
    <table class="table-ui text-12">
      <thead>
        <tr>
          <slot name="head" />
        </tr>
      </thead>
      <tbody>
        <slot
          v-if="!isEmpty"
          name="body" />
        <template v-if="isEmpty">
          <td class="table-ui__empty-row" />
          <div class="table-ui__empty-text"><inbox-icon class="table-ui__empty-icon" /> Нет данных</div>  
        </template>
      </tbody>
    </table>
    <transition name="fade">
      <div
        v-show="loading"
        class="table-ui__loader-wrapper">
        <loading-icon />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import InboxIcon from '~/assets/images/icons/inbox-02.svg';
import LoadingIcon from '../LoadingIcon.vue';

type Props = {
  loading?: boolean;
  isEmpty?: boolean;
};

defineProps<Props>();
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/mixins/text' as textMixins;

.table-wrapper {
  position: relative;
  overflow-x: auto;
}

.table-ui {
  border: 1px solid colors.$gray-300;
  border-radius: 12px;
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
    border-right: 0 !important;
  }

  &__empty-icon {
    color: colors.$gray-400;
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
    gap: offsets.$offset-32;
    width: 100%;
    height: 100%;
    padding: offsets.$offset-24;
    background-color: colors.$gray-100;
  }

  & th,
  & td {
    border-right: 1px solid colors.$gray-300;
    padding: offsets.$offset-12;
    text-align: start;
    vertical-align: baseline;
    
    @include textMixins.text-14;
  }

  & thead tr {
    color: colors.$gray-700;
    background-color: colors.$gray-200;
  }

  & tr {
    transition: background-color 0.2s ease-in-out;

    // Убираем лишнюю границу у последней колонки
    & td:last-child,
    & th:last-child {
      border-right: 0;
    }

    &:nth-child(2n) {
      background-color: colors.$gray-100;
    }
  }

  & tbody {
    position: relative;

    tr:hover {
      background-color: colors.$primary-light;

      & .table-row-button {
        color: colors.$primary-active;
      }
    }
  }
}
</style>