<template>
  <button
    type="button"
    class="dropdown-action">
    <component
      :is="isLink ? 'RouterLink' : 'span'"
      :to="linkTo">
      <slot />
    </component>
  </button>
</template>

<script lang="ts" setup>
export type TableActionMenuItemProps = {
  isLink?: boolean;
  linkTo?: string;
};
defineProps<TableActionMenuItemProps>();
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;
@use '/assets/styles/mixins/text' as textMixins;

.dropdown-action {
  @include textMixins.text-12;

  padding: 6px 12px;
  margin: 0 12px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  width: calc(100% - 12px * 2);
  color: colors.$text;

  &:hover {
    background-color: colors.$border;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  &--edit {
    color: colors.$accent;
  }

  &--delete {
    color: colors.$danger;
  }

  &,
  a,
  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

.table-action-button {
  width: 36px;
  height: 32px;
  padding: 4px 6px;
  background-color: transparent;
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
}
</style>
