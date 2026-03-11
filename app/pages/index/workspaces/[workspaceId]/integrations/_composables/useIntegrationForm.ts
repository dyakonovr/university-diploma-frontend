import {
  createIntegration,
  getIntegration,
  regenerateIntegrationToken,
} from "~/domain/integration/api/integration.api";
import type { IntegrationCreate } from "~/domain/integration/models/integration.types";
import { useCustomToast } from "~/shared/composables/useCustomToast";
import useGetBack from "~/shared/composables/useGetBack";
import { ERROR_REQUIRED_FIELD } from "~/shared/constants/core/validation-errors.const";
import { RequestError } from "~/shared/errors/request.errors";
import type { EntityId } from "~/shared/types/core/base-entity.types";
import type {
  FormErrors,
  FormFields,
  FormRules,
} from "~/shared/types/core/form-validation.types";
import {
  clearFormValidation,
  setBackendErrors,
  validateForm,
} from "~/shared/utils/core/formValidation";
import { showRequestError } from "~/shared/utils/core/show-request-error";

type IntegrationForm = {
  name: string;
  type: string;
};

function useIntegrationForm(workspaceId: string) {
  const { toastSuccess, toastError } = useCustomToast();
  const route = useRoute();
  const { getBack } = useGetBack(`/workspaces/${workspaceId}/integrations`);

  const loading = ref(false);
  const saving = ref(false);
  const editId = ref<EntityId | null>(null);

  const apiToken = ref<string | null>(null);
  const tokenVisible = ref(false);
  const regenerating = ref(false);

  const formData = ref<FormFields<IntegrationForm>>({
    name: null,
    type: "task_tracker",
  });

  const formErrors = reactive<FormErrors<IntegrationForm>>({
    name: "",
    type: "",
  });

  const formRules = ref<FormRules<IntegrationForm>>({
    name: () => {
      if (!formData.value.name) {
        formErrors.name = ERROR_REQUIRED_FIELD;
        return false;
      }
      return true;
    },
  });

  const getData = async () => {
    const paramId = route.params.integrationId;
    if (paramId && paramId !== "create") {
      editId.value = paramId as EntityId;
      loading.value = true;
      try {
        const response = await getIntegration(editId.value, workspaceId);
        const integration = response.data;
        formData.value = {
          name: integration.name,
          type: integration.type,
        };
        apiToken.value = integration.api_token || null;
      } catch (e) {
        toastError("Ошибка при получении интеграции");
        showRequestError(e);
      } finally {
        loading.value = false;
      }
    }
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(
      formRules.value as Record<string, () => boolean>,
    );
    if (!valid) return;

    saving.value = true;
    try {
      await createIntegration(workspaceId, {
        workspace_id: workspaceId,
        name: formData.value.name as string,
        type: formData.value.type as string,
        config: {},
        is_active: true,
        api_token: "",
      } as IntegrationCreate);
      toastSuccess("Интеграция добавлена");
      getBack();
    } catch (e) {
      if (e instanceof RequestError && e.statusCode === 422) {
        setBackendErrors(formErrors, e.errors);
        toastError("Ошибка валидации");
      } else {
        toastError("Ошибка при создании интеграции");
        showRequestError(e);
      }
    } finally {
      saving.value = false;
    }
  };

  const onRegenerate = async () => {
    if (!editId.value) return;
    regenerating.value = true;
    try {
      const response = await regenerateIntegrationToken(
        editId.value,
        workspaceId,
        formData.value as IntegrationCreate,
      );
      apiToken.value = response.data.api_token;
      tokenVisible.value = true;
      toastSuccess("Токен обновлён");
    } catch {
      toastError("Ошибка при обновлении токена");
    } finally {
      regenerating.value = false;
    }
  };

  return {
    loading,
    saving,
    editId,
    formData,
    formErrors,
    apiToken,
    tokenVisible,
    regenerating,
    getData,
    onSubmit,
    onRegenerate,
    getBack,
  };
}

export default useIntegrationForm;
