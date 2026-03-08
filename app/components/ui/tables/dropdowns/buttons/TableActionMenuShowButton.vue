<template>
  <table-action-menu-item v-bind="$props">
    <eye-icon /> Просмотреть
  </table-action-menu-item>
</template>

<script lang="ts" setup>
import EyeIcon from '~/assets/images/icons/eye.svg';

import TableActionMenuItem, {
  type TableActionMenuItemProps,
} from '../TableActionMenuItem.vue';

type Props = TableActionMenuItemProps;
defineProps<Props>();
</script>
