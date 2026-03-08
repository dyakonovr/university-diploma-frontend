<template>
  <dialog-ui
    v-model="model"
    dialog-class="delete-confirmation-dialog"
    :title="title"
    :message="message"
    :confirm-button-props="{ color: 'danger' }"
    cancel-button-text="Отмена"
    confirm-button-text="Удалить"
    @confirm="emit('confirm')"
  />
</template>

<script lang="ts" setup>
import DialogUi from '../ui/DialogUi.vue';

type Props = {
  title?: string;
  message?: string;
};

const model = defineModel<boolean>();

withDefaults(defineProps<Props>(), {
  title: 'Подтвердите удаление',
  message: 'Вы уверены, что хотите удалить этот элемент?',
});

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();
</script>

<style lang="scss">
.delete-confirmation-dialog {
  width: 600px;
}
</style>
