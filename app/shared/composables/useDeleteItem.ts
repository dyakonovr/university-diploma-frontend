import type { UnwrapRef } from 'vue';

import { useCustomToast } from './useCustomToast';

function useDeleteItem<T>(options: {
  dialogTitle?: string;
  dialogDescription?: (item: T) => string;
  successMessage?: string;
  errorMessage?: string;

  callbackBeforeConfirm?: () => void | Promise<void>;
  callbackAfterConfirm?: () => void | Promise<void>;
  deleteFunc: () => void;
}) {
  const { toastSuccess, toastError } = useCustomToast();

  const deleteDialogVisible = ref(false);
  const itemToDelete = ref<T | null>(null);

  const deleteItemDialogContent = computed(() => {
    if (itemToDelete.value) {
      return {
        title: options.dialogTitle ?? 'Подтвердите удаление',
        message: options.dialogTitle ?? 'Вы точно хотите удалить этот элемент?',
      };
    }
  });

  const handleDelete = (scopeRow: T) => {
    itemToDelete.value = scopeRow as UnwrapRef<T>;
    deleteDialogVisible.value = true;
  };

  const confirmDelete = async () => {
    if (itemToDelete.value === null) return;

    try {
      await options.callbackBeforeConfirm?.();
      await options.deleteFunc();
      await options.callbackAfterConfirm?.();

      if (options.successMessage) toastSuccess(options.successMessage);
    } catch {
      if (options.errorMessage) toastError(options.errorMessage);
    } finally {
      deleteDialogVisible.value = false;
      itemToDelete.value = null;
    }
  };

  return {
    deleteItemDialogContent,
    deleteDialogVisible,
    itemToDelete,
    handleDelete,
    confirmDelete,
  };
}

export default useDeleteItem;
