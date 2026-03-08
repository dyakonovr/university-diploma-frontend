import { getPermissions } from '~/domain/permission/api/permissions.api';
import type { Permission } from '~/domain/permission/models/permission.types';
import {
  bindProviderPermission,
  unbindProviderPermission,
} from '~/domain/provider/api/providers.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { EntityId } from '~/shared/types/core/base-entity.types';

function useProviderFormPermissions(
  editId: Ref<EntityId | null>,
  reload: () => Promise<void>,
) {
  const { toastSuccess, toastError } = useCustomToast();

  const loading = ref(false);

  const permissions = useSelectInfiniteScroll<Permission>({
    errorMessage: 'Ошибка при получении доступов',
    mapFunc: (item) => ({ label: item.code, value: item.id }),
    requestFunc: getPermissions,
    requestParams: (meta, searchValue) => ({
      code: searchValue,
    }),
  });

  const onBindPermission = async (permissionId: EntityId) => {
    if (!editId.value) return;

    try {
      loading.value = true;
      await bindProviderPermission(editId.value, permissionId);
      toastSuccess('Доступ привязан к провайдеру');
      await reload();
    } catch {
      toastError('Ошибка привязки доступа');
    } finally {
      loading.value = false;
    }
  };

  const onUnbindPermission = async (permissionId: EntityId) => {
    if (!editId.value) return;

    try {
      loading.value = true;
      await unbindProviderPermission(editId.value, permissionId);
      toastSuccess('Доступ отвязан от провайдера');
      await reload();
    } catch {
      toastError('Ошибка отвязки доступа');
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    permissions,
    onBindPermission,
    onUnbindPermission,
  };
}

export default useProviderFormPermissions;
