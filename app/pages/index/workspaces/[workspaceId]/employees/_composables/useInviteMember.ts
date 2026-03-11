import { inviteMemberToWorkspace } from '~/domain/workspace/api/workspace-member.api';
import type { WorkspaceMemberRole } from '~/domain/workspace/models/workspace-member.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import { RequestError } from '~/shared/errors/request.errors';
import type { FormErrors, FormFields, FormRules } from '~/shared/types/core/form-validation.types';
import { clearFormValidation, setBackendErrors, validateForm } from '~/shared/utils/core/formValidation';
import { showRequestError } from '~/shared/utils/core/show-request-error';

type InviteForm = {
  user_id: string;
  role: WorkspaceMemberRole;
};

/**
 * Composable for inviting a new member to a workspace via a dialog form.
 *
 * @param workspaceId - The ID of the workspace to invite the member into.
 * @param onSuccess - Callback called after a successful invite (e.g. refresh the members list).
 *
 * @returns
 * - `dialogVisible` — controls invite dialog visibility
 * - `loading` — true while the invite request is in progress
 * - `formData` — reactive form fields: `user_id` and `role`
 * - `formErrors` — per-field validation error messages
 * - `openDialog` — opens the dialog and resets form state
 * - `onSubmit` — validates and submits the invite request
 *
 * @example
 * const invite = reactive(useInviteMember(workspaceId, () => getData()));
 * // template: v-model="invite.dialogVisible", @click="invite.openDialog"
 */
function useInviteMember(workspaceId: string, onSuccess: () => void) {
  const { toastSuccess, toastError } = useCustomToast();

  const dialogVisible = ref(false);
  const loading = ref(false);

  const formData = ref<FormFields<InviteForm>>({
    user_id: null,
    role: 'employee',
  });

  const formErrors = reactive<FormErrors<InviteForm>>({
    user_id: '',
    role: '',
  });

  const formRules = ref<FormRules<InviteForm>>({
    user_id: () => {
      if (!formData.value.user_id) {
        formErrors.user_id = ERROR_REQUIRED_FIELD;
        return false;
      }
      return true;
    },
  });

  const openDialog = () => {
    formData.value = { user_id: null, role: 'employee' };
    clearFormValidation(formErrors);
    dialogVisible.value = true;
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value as Record<string, () => boolean>);
    if (!valid) return;

    loading.value = true;
    try {
      await inviteMemberToWorkspace(workspaceId, {
        user_id: formData.value.user_id as string,
        role: formData.value.role as WorkspaceMemberRole,
      });
      toastSuccess('Участник приглашён');
      dialogVisible.value = false;
      onSuccess();
    } catch (e) {
      if (e instanceof RequestError && e.statusCode === 422) {
        setBackendErrors(formErrors, e.errors);
        toastError('Ошибка валидации');
      } else {
        toastError('Ошибка при приглашении участника');
        showRequestError(e);
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    dialogVisible,
    loading,
    formData,
    formErrors,
    openDialog,
    onSubmit,
  };
}

export default useInviteMember;
