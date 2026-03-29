import { blockUser, unblockUser } from "~/domain/admin/api/admin-users.api";
import type { AdminUser } from "~/domain/admin/models/admin.types";
import { useCustomToast } from "~/shared/composables/useCustomToast";
import { showRequestError } from "~/shared/utils/core/show-request-error";

function useBlockUser(onSuccess: () => void) {
  const { toastSuccess, toastError } = useCustomToast();

  const loading = ref(false);

  const toggleBlock = async (user: AdminUser) => {
    const isBlocked = !!user.blocked_at;
    const action = isBlocked ? unblockUser : blockUser;
    const successMessage = isBlocked
      ? "Пользователь разблокирован"
      : "Пользователь заблокирован";

    try {
      loading.value = true;
      await action(user.id);
      toastSuccess(successMessage);
      onSuccess();
    } catch (e) {
      toastError("Ошибка при изменении статуса пользователя");
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    toggleBlock,
  };
}

export default useBlockUser;
