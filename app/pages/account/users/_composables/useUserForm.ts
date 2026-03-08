import { getRoles } from '~/domain/role/api/roles.api';
import type { Role } from '~/domain/role/models/role.types';
import {
  assignRoleToUser,
  createUser,
  getUser,
  getUserRoles,
  removeRoleFromUser,
  updateUser,
} from '~/domain/user/api/users/users.admin-api';
import type { UserCreate } from '~/domain/user/models/user.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import {
  ERROR_MAX_LENGTH,
  ERROR_MIN_LENGTH,
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

function useUserForm() {
  const route = useRoute();
  const router = useRouter();

  const { toastSuccess, toastError } = useCustomToast();
  const { getBack } = useGetBack('/account/users');

  const loading = ref(false);
  const editId = ref<EntityId | null>(null);

  const userRoles = ref<Role[]>([]);
  const availableRoles = ref<Array<{ label: string; value: EntityId }>>([]);
  const selectedRoleId = ref<EntityId | null>(null);

  const formData = ref<FormFields<UserCreate>>({
    email: null,
    username: null,
    password: null,
    is_active: true,
    telegram_id: null,
  });
  const formErrors = reactive<FormErrors<UserCreate>>({
    email: '',
    password: '',
  });

  const formRules = ref<FormRules<UserCreate>>({
    email: () => {
      if (!formData.value.email) {
        formErrors.email = ERROR_REQUIRED_FIELD;
        return false;
      }

      if (formData.value.email.length > 255) {
        formErrors.email = ERROR_MAX_LENGTH(255);
        return false;
      }

      return true;
    },
    password: () => {
      if (editId) return true;

      if (!formData.value.password) {
        formErrors.password = ERROR_REQUIRED_FIELD;
        return false;
      }

      if (formData.value.password.length < 6) {
        formErrors.password = ERROR_MIN_LENGTH(6);
        return false;
      }

      if (formData.value.password.length > 255) {
        formErrors.password = ERROR_MAX_LENGTH(255);
        return false;
      }

      return true;
    },
  });

  const getData = async () => {
    try {
      if (route.params.id && route.params.id !== 'create') {
        editId.value = route.params.id as EntityId;
        const response = await getUser(editId.value);
        formData.value = {
          email: response.data.email,
          username: response.data.username,
          password: null,
          telegram_id: response.data.telegram_id,
          is_active: response.data.is_active,
        };

        await loadUserRoles();
      }
    } catch (e) {
      toastError('Ошибка при получении данных пользователя');
      showRequestError(e);
    }
  };

  const loadUserRoles = async () => {
    if (!editId.value) return;
    try {
      const response = await getUserRoles(editId.value);
      userRoles.value = response.data;
    } catch {
      toastError('Ошибка при получении ролей пользователя');
    }
  };

  const loadAvailableRoles = async () => {
    try {
      const response = await getRoles();
      availableRoles.value = response.data.map((role: Role) => ({
        label: role.name,
        value: role.id as EntityId,
      }));
    } catch {
      toastError('Ошибка при получении списка ролей');
    }
  };

  const onAssignRole = async () => {
    if (!editId.value || !selectedRoleId.value) return;

    try {
      loading.value = true;
      await assignRoleToUser(editId.value, selectedRoleId.value);
      toastSuccess('Роль назначена пользователю');
      selectedRoleId.value = null;
      await loadUserRoles();
    } catch {
      toastError('Ошибка назначения роли');
    } finally {
      loading.value = false;
    }
  };

  const onRemoveRole = async (roleId: EntityId) => {
    if (!editId.value) return;

    try {
      loading.value = true;
      await removeRoleFromUser(editId.value, roleId);
      toastSuccess('Роль удалена');
      await loadUserRoles();
    } catch {
      toastError('Ошибка удаления роли');
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
        if (!formData.value.password) formData.value.password = null;
        if (!formData.value.telegram_id) formData.value.telegram_id = null;

        await updateUser(editId.value, formData.value as UserCreate);
      } else {
        await createUser(formData.value as UserCreate);
      }

      toastSuccess(
        editId.value ? 'Пользователь обновлен!' : 'Пользователь создан!',
      );
      getBack();
    } catch (e) {
      if (!(e instanceof RequestError)) {
        console.error('Error in user create/update:', e);
        toastError('Ошибка создания или редактирования пользователя');
        return;
      }

      if (e.statusCode !== 422) {
        toastError(
          `Ошибка создания или редактирования пользователя: ${e.message}`,
        );
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

    userRoles,
    availableRoles,
    selectedRoleId,
    loadAvailableRoles,
    onAssignRole,
    onRemoveRole,

    getData,
    onSubmit,
    getBack,
  };
}

export default useUserForm;
