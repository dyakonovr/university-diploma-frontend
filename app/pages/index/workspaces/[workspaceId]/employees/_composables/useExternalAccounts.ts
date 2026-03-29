import { getExternalAccounts } from "~/domain/workspace/api/external-account.api";
import type { ExternalAccount } from "~/domain/workspace/models/external-account.types";
import type { WorkspaceMember } from "~/domain/workspace/models/workspace-member.types";
import { useCustomToast } from "~/shared/composables/useCustomToast";
import { showRequestError } from "~/shared/utils/core/show-request-error";

function useExternalAccounts(workspaceId: string) {
  const { toastError } = useCustomToast();

  const dialogVisible = ref(false);
  const loading = ref(false);
  const accounts = ref<ExternalAccount[]>([]);
  const selectedMember = ref<WorkspaceMember | null>(null);

  const openDialog = async (member: WorkspaceMember) => {
    selectedMember.value = member;
    dialogVisible.value = true;
    loading.value = true;

    try {
      const response = await getExternalAccounts(workspaceId, member.user_id);
      accounts.value = response.data;
    } catch (e) {
      toastError("Ошибка при загрузке внешних аккаунтов");
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  const closeDialog = () => {
    dialogVisible.value = false;
    accounts.value = [];
    selectedMember.value = null;
  };

  return {
    dialogVisible,
    loading,
    accounts,
    selectedMember,
    openDialog,
    closeDialog,
  };
}

export default useExternalAccounts;
