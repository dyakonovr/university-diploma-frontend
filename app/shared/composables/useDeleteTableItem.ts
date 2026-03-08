import { computed, ref, type UnwrapRef } from 'vue';

import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';

import { useCustomToast } from './useCustomToast';

function useDeleteTableItem<T extends { id: number | string }>(options: {
  callbackBeforeConfirm?: () => void | Promise<void>;
  callbackAfterConfirm?: () => void | Promise<void>;
  deleteFunc: (id: EntityId) => Promise<Response<T>>;
  mapFunc?: (el: T) => string;
  successMessage: string;
  errorMessage: string;
  getTableData: (...args: unknown[]) => void | Promise<void>;
}) {
  const { toastSuccess, toastError } = useCustomToast();

  const deleteDialogVisible = ref(false);
  const itemToDelete = ref<T | null>(null);

  const deleteItemDialogContent = computed(() => {
    if (itemToDelete.value) {
      return {
        title: 'Подтвердите удаление',
        message: `Вы точно хотите удалить ${options.mapFunc ? `<b>${options.mapFunc(itemToDelete.value as T)}</b>` : 'этот элемент'}?`,
      };
    }

    return {
      title: 'Подтвердите удаление',
      message: 'Вы точно хотите удалить',
    };
  });

  const handleDelete = (scopeRow: T) => {
    itemToDelete.value = scopeRow as UnwrapRef<T>;
    deleteDialogVisible.value = true;
  };

  const confirmDelete = async () => {
    if (!itemToDelete.value) return;

    try {
      await options.callbackBeforeConfirm?.();
      await options.deleteFunc(itemToDelete.value.id);
      await options.callbackAfterConfirm?.();

      toastSuccess(options.successMessage);
      await options.getTableData();
    } catch {
      toastError(options.errorMessage);
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

export default useDeleteTableItem;
