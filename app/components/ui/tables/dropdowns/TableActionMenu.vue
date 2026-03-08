<template>
  <dropdown-element button-class="table-action-button">
    <table-action-menu-item
      v-if="canEdit"
      class="dropdown-action--edit"
      @click="handleEditClick"
    >
      <component
        :is="editLink ? 'RouterLink' : 'span'"
        :to="editLink">
        <pencil-icon /> Редактировать
      </component>
    </table-action-menu-item>

    <slot />

    <table-action-menu-item
      v-if="canDelete"
      class="dropdown-action dropdown-action--delete"
      @click="handleDeleteClick"
    >
      <trash-icon /> Удалить
    </table-action-menu-item>
  </dropdown-element>
</template>

<script setup lang="ts">
import PencilIcon from '@/assets/images/icons/pencil.svg';
import TrashIcon from '@/assets/images/icons/trash.svg';

import TableActionMenuItem from './TableActionMenuItem.vue';
import DropdownElement from './TableDropdownElement.vue';

const props = withDefaults(
  defineProps<{
    canEdit?: boolean;
    editLink?: string;
    canDelete?: boolean;
  }>(),
  {
    canEdit: true,
    editLink: '',
    canDelete: true,
  },
);

const emit = defineEmits<{
  (e: 'edit-click' | 'delete-click'): void;
}>();

function handleEditClick() {
  if (props.editLink) return;
  emit('edit-click');
}

function handleDeleteClick() {
  emit('delete-click');
}
</script>
