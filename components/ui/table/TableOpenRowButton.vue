<template>
  <td
    class="table-row-button"
    title="Подробнее">
    <chevron-down-icon class="table-row-button__icon" />
  </td>
</template>

<script lang="ts" setup>
import ChevronDownIcon from '~/assets/images/icons/chevron-down.svg';
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.table-row-button {
  cursor: pointer;
  min-width: 40px;
  max-width: 40px;

  &:hover {
    .table-row-button__icon {
      color: colors.$primary-normal;
    }
  }

  &__icon {
    transform: rotate(-90deg) translateY(50%) translateX(40%);
    transition: color 0.2s ease-in-out;
  }
}
</style>