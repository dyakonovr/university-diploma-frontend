import { getPermissions } from '~/domain/permission/api/permissions.api';
import type { Permission } from '~/domain/permission/models/permission.types';
import {
  assignPermissionToRole,
  createRole,
  getRole,
  getRolePermissions,
  removePermissionFromRole,
  updateRole,
} from '~/domain/role/api/roles.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import {
  ERROR_MAX_LENGTH,
  ERROR_REQUIRED_FIELD,
} from '~/shared/constants/core/validation-errors.const';
import { RequestError } from '~/shared/errors/request.errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  FormErrors,
  FormFields,
  FormRules,
} from '~/shared/types/core/form-validation.types';
import {
  clearFormValidation,
  setBackendErrors,
  validateForm,
} from '~/shared/utils/core/formValidation';
import { showRequestError } from '~/shared/utils/core/show-request-error';

interface RoleForm {
  name: string | null;
}

function useRoleForm() {
  const route = useRoute();
  const router = useRouter();

  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/roles');

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);

  const formData = ref<FormFields<RoleForm>>({
    name: null,
  });

  const rolePermissions = ref<Permission[]>([]);
  const availablePermissions = ref<Array<{ label: string; value: EntityId }>>(
    [],
  );
  const selectedPermissionId = ref<EntityId | null>(null);
  const formErrors = reactive<FormErrors<RoleForm>>({
    name: '',
  });
  const formRules = ref<FormRules<RoleForm>>({
    name: () => {
      if (!formData.value.name) {
        formErrors.name = ERROR_REQUIRED_FIELD;
        return false;
      }

      if (formData.value.name.length > 255) {
        formErrors.name = ERROR_MAX_LENGTH(255);
        return false;
      }

      return true;
    },
  });

  const getData = async () => {
    try {
      if (route.params.id && route.params.id !== 'create') {
        editId.value = route.params.id as EntityId;
        const response = await getRole(editId.value);
        formData.value = {
          name: response.data.name,
        };

        await loadRolePermissions();
      }
    } catch (e) {
      toastError('Ошибка при получении данных роли');
      showRequestError(e);
    }
  };

  const loadRolePermissions = async () => {
    if (!editId.value) return;
    try {
      const response = await getRolePermissions(editId.value);
      rolePermissions.value = response.data || [];
    } catch {
      toastError('Ошибка при получении permissions роли');
    }
  };

  const loadAvailablePermissions = async () => {
    try {
      const response = await getPermissions();
      const permissions = response.data || [];
      availablePermissions.value = permissions.map(
        (permission: Permission) => ({
          label: permission.code,
          value: permission.id as EntityId,
        }),
      );
    } catch {
      toastError('Ошибка при получении списка permissions');
    }
  };

  const onAssignPermission = async () => {
    if (!editId.value || !selectedPermissionId.value) return;

    try {
      loading.value = true;
      await assignPermissionToRole({
        role_id: editId.value,
        permission_id: selectedPermissionId.value,
      });
      toastSuccess('Permission назначен роли');
      selectedPermissionId.value = null;
      await loadRolePermissions();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in assign permission:', e);
        toastError('Ошибка назначения permission');
        return;
      }

      toastError(`Ошибка назначения permission: ${e.message}`);
    } finally {
      loading.value = false;
    }
  };

  const onRemovePermission = async (permissionId: EntityId) => {
    if (!editId.value) return;

    try {
      loading.value = true;
      await removePermissionFromRole({
        role_id: editId.value,
        permission_id: permissionId,
      });
      toastSuccess('Permission удален');
      await loadRolePermissions();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in remove permission:', e);
        toastError('Ошибка удаления permission');
        return;
      }

      toastError(`Ошибка удаления permission: ${e.message}`);
    } finally {
      loading.value = false;
    }
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value);
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    try {
      loading.value = true;
      if (editId.value) {
        await updateRole(editId.value, formData.value as { name: string });
      } else {
        await createRole(formData.value as { name: string });
      }

      toastSuccess(editId.value ? 'Роль обновлена!' : 'Роль создана!');
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in role create/update:', e);
        toastError('Ошибка создания или редактирования роли');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(`Ошибка создания или редактирования роли: ${e.message}`);
        return;
      }

      setBackendErrors(formErrors, e.errors);
      toastError('Ошибка валидации формы');
    } finally {
      loading.value = false;
    }
  };

  return {
    formData,
    formRules,
    formErrors,
    route,
    router,
    loading,
    editId,

    rolePermissions,
    availablePermissions,
    selectedPermissionId,
    loadAvailablePermissions,
    onAssignPermission,
    onRemovePermission,

    getData,
    onSubmit,
    getBack,
  };
}

export default useRoleForm;
