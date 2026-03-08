<template>
  <div
    v-show="totalPages > 1"
    class="table-pagination">
    <pagination-button-ui
      :disabled="currentPage <= 1 || disabled"
      class="table-pagination__button--action table-pagination__button--action-left"
      @click="currentPage -= 1"
    >
      <chevron-left-icon />
    </pagination-button-ui>

    <template v-if="totalPages <= 5">
      <pagination-button-ui
        v-for="n in totalPages"
        :key="n"
        :class="{ active: currentPage === n }"
        :disabled="disabled"
        @click="currentPage = n"
      >
        {{ n }}
      </pagination-button-ui>
    </template>

    <template v-else-if="totalPages - currentPage > 3">
      <pagination-button-ui
        :class="{ active: currentPage === 1 }"
        :disabled="disabled"
        @click="currentPage = 1"
      >
        1
      </pagination-button-ui>

      <template v-if="currentPage === 1">
        <pagination-button-ui
          v-for="n in 2"
          :key="n"
          :class="{ active: currentPage === currentPage + n }"
          :disabled="disabled"
          @click="currentPage = currentPage + n"
        >
          {{ currentPage + n }}
        </pagination-button-ui>
      </template>

      <template v-else>
        <pagination-button-ui
          v-if="currentPage !== 2"
          :disabled="disabled"
          @click="currentPage = currentPage - 1"
        >
          {{ currentPage - 1 }}
        </pagination-button-ui>
        <pagination-button-ui
          class="active"
          :disabled="disabled">
          {{ currentPage }}
        </pagination-button-ui>
        <pagination-button-ui
          :disabled="disabled"
          @click="currentPage = currentPage + 1"
        >
          {{ currentPage + 1 }}
        </pagination-button-ui>
      </template>

      <pagination-button-ui class="table-pagination__button--points"
      >...</pagination-button-ui
      >

      <pagination-button-ui
        :disabled="disabled"
        @click="currentPage = totalPages - 1"
      >{{ totalPages - 1 }}</pagination-button-ui
      >

      <pagination-button-ui
        :disabled="disabled"
        @click="currentPage = totalPages"
      >{{ totalPages }}</pagination-button-ui
      >
    </template>

    <template v-else>
      <pagination-button-ui
        :disabled="disabled"
        @click="currentPage = 1">
        1
      </pagination-button-ui>

      <pagination-button-ui class="table-pagination__button--points"
      >...</pagination-button-ui
      >

      <pagination-button-ui
        v-for="n in [4, 3, 2, 1, 0]"
        :key="n"
        :class="{ active: currentPage === totalPages - n }"
        :disabled="disabled"
        @click="currentPage = totalPages - n"
      >
        {{ totalPages - n }}
      </pagination-button-ui>
    </template>

    <pagination-button-ui
      :disabled="currentPage >= totalPages || disabled"
      class="table-pagination__button--action table-pagination__button--action-right"
      @click="currentPage += 1"
    >
      <chevron-right-icon />
    </pagination-button-ui>
  </div>
</template>

<script lang="ts" setup>
import ChevronLeftIcon from '@/assets/images/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/images/icons/chevron-right.svg';

import PaginationButtonUi from './PaginationButtonUi.vue';

const currentPage = defineModel<number>('currentPage', { required: true });

type Props = {
  totalPages: number;
  disabled?: boolean;
};

defineProps<Props>();
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as mixins;

$button-width: 30px;
$button-height: 38px;

.table-pagination {
  display: flex;
  align-items: center;

  &__button {
    @include mixins.text-14;

    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid colors.$border;
    border-right: none;
    padding: 8px;
    min-width: $button-width;
    height: $button-height;
    color: colors.$text;
    background-color: colors.$white;

    transition:
      background-color 0.15s ease-in-out,
      color 0.15s ease-in-out,
      border-color 0.15s ease-in-out;

    &.active,
    &:not(:disabled):hover {
      border-color: colors.$primary-light !important;
      color: colors.$white !important;
      background-color: colors.$primary-light !important;
    }

    &--points {
      cursor: default;

      &:hover {
        background-color: transparent !important;
      }
    }

    &--action {
      svg {
        width: 8px;
        height: 8px;
      }

      &-left {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }

      &-right {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-right: 1px solid colors.$border;
      }
    }

    &.active {
      cursor: not-allowed;
      color: colors.$white;
    }

    &:disabled,
    &:disabled:hover {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
</style>
