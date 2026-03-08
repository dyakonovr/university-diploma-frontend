<template>
  <td
    class="table-delete-row-button"
    title="Удалить запись">
    <trash-icon class="table-delete-row-button__icon" />
  </td>
</template>

<script lang="ts" setup>
import TrashIcon from '~/assets/images/icons/trash-02.svg';
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.table-delete-row-button {
  cursor: pointer;
  min-width: 40px;
  max-width: 40px;

  &:hover, &:active {
    .table-delete-row-button__icon {
      color: colors.$danger-normal;
    }
  }

  &__icon {
    transition: color 0.2s ease-in-out;
  }
}
</style>