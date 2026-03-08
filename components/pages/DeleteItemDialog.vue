<template>
  <dialog-ui
    :is-opened="isOpened"
    class="delete-item-dialog"
    @update:is-opened="(value) => isOpened = value">
    <h4>{{ title }}</h4>
    <p class="text-16">{{ description }}</p>
    <div class="delete-item-dialog__buttons">
      <button-ui
        variant="outlined"
        size="medium"
        @click="cancel">Отмена</button-ui>
      <button-ui
        variant="error"
        size="medium"
        @click="submit">Удалить</button-ui>
    </div>
  </dialog-ui>
</template>

<script lang="ts" setup>
import DialogUi from '../ui/DialogUi.vue';
import ButtonUi from '../ui/form/ButtonUi.vue';

type Props = {
  title?: string;
  description?: string;
  onCancelClick?: () => void;
  onSubmitClick: () => void;
};

const props = withDefaults(defineProps<Props>(), {
  title: 'Удаление записи',
  description: 'Вы точно хотите удалить эту запись?',
  onCancelClick: () => {}
});

const isOpened = defineModel<boolean>('isOpened', {
  required: true
});

const cancel = () => {
  props.onCancelClick?.();
  isOpened.value = false;
};

const submit = () => {
  props.onSubmitClick();
  isOpened.value = false;
};

const handleGlobalKeyDown = (e: KeyboardEvent) => {
  if (!isOpened.value) return;
  
  if (e.key === 'Enter') {
    e.preventDefault();
    e.stopImmediatePropagation();
    submit();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    cancel();
  }
};

onMounted(() => {
  // Вешаем обработчик в фазе CAPTURE (перехватываем первым)
  window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
});
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.delete-item-dialog {
  .dialog-ui {
    display: flex;
    flex-direction: column;
    gap: offsets.$offset-8;
  }

  &__buttons {
    display: flex;
    margin: offsets.$offset-12 0 0 auto;
    gap: offsets.$offset-8;
  }
}
</style>