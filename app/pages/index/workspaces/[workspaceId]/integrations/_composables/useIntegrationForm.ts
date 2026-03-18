import {
  createIntegration,
  getAvailableIntegrations,
  getIntegration,
  regenerateIntegrationToken,
  syncIntegration,
  testIntegration,
} from "~/domain/integration/api/integration.api";
import type {
  AvailableIntegration,
  IntegrationCreate,
} from "~/domain/integration/models/integration.types";
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

  const testing = ref(false);
  const testResult = ref<"ok" | "error" | null>(null);
  const testError = ref<string | null>(null);

  const syncing = ref(false);
  const syncResult = ref<{
    created: number;
    updated: number;
    errors?: string[];
  } | null>(null);

  const availableIntegrations = ref<AvailableIntegration[]>([]);
  const configValues = ref<Record<string, string>>({});

  const formData = ref<FormFields<IntegrationForm>>({
    name: null,
    type: "task_tracker",
  });

  const formErrors = reactive<FormErrors<IntegrationForm>>({
    name: "",
    type: "",
  });

  const configErrors = ref<Record<string, string>>({});

  const formRules = ref<FormRules<IntegrationForm>>({
    name: () => {
      if (!formData.value.name) {
        formErrors.name = ERROR_REQUIRED_FIELD;
        return false;
      }
      return true;
    },
  });

  const currentConfigFields = computed(() => {
    if (availableIntegrations.value.length === 0) return [];
    // For now there's one provider — show its fields
    return availableIntegrations.value[0]?.config_fields ?? [];
  });

  const loadAvailableIntegrations = async () => {
    try {
      const response = await getAvailableIntegrations();
      availableIntegrations.value = response.data;
    } catch (e) {
      showRequestError(e);
    }
  };

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

        // Populate config values from saved integration
        if (integration.config) {
          const cfg: Record<string, string> = {};
          for (const [key, val] of Object.entries(integration.config)) {
            cfg[key] = String(val ?? "");
          }
          configValues.value = cfg;
        }
      } catch (e) {
        toastError("Ошибка при получении интеграции");
        showRequestError(e);
      } finally {
        loading.value = false;
      }
    }
  };

  const validateConfig = (): boolean => {
    const errors: Record<string, string> = {};
    let valid = true;
    for (const field of currentConfigFields.value) {
      if (field.required && !configValues.value[field.key]?.trim()) {
        errors[field.key] = ERROR_REQUIRED_FIELD;
        valid = false;
      }
    }
    configErrors.value = errors;
    return valid;
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    configErrors.value = {};

    const formValid = validateForm(
      formRules.value as Record<string, () => boolean>,
    );
    const configValid = validateConfig();
    if (!formValid || !configValid) return;

    saving.value = true;
    try {
      await createIntegration(workspaceId, {
        workspace_id: workspaceId,
        name: formData.value.name as string,
        type: formData.value.type as string,
        config: { ...configValues.value },
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

  const onTest = async () => {
    if (!editId.value) return;
    testing.value = true;
    testResult.value = null;
    testError.value = null;
    try {
      await testIntegration(editId.value, workspaceId);
      testResult.value = "ok";
      toastSuccess("Подключение успешно");
    } catch (e) {
      testResult.value = "error";
      if (e instanceof RequestError) {
        testError.value = e.message || "Ошибка подключения";
      } else {
        testError.value = "Ошибка подключения";
      }
      toastError("Ошибка подключения к интеграции");
    } finally {
      testing.value = false;
    }
  };

  const onSync = async () => {
    if (!editId.value) return;
    syncing.value = true;
    syncResult.value = null;
    try {
      const response = await syncIntegration(editId.value, workspaceId);
      syncResult.value = response.data;
      const { created, updated } = response.data;
      toastSuccess(
        `Синхронизировано: создано ${created}, обновлено ${updated}`,
      );
    } catch (e) {
      toastError("Ошибка синхронизации");
      showRequestError(e);
    } finally {
      syncing.value = false;
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
    testing,
    testResult,
    testError,
    syncing,
    syncResult,
    availableIntegrations,
    configValues,
    configErrors,
    currentConfigFields,
    loadAvailableIntegrations,
    getData,
    onSubmit,
    onRegenerate,
    onTest,
    onSync,
    getBack,
  };
}

export default useIntegrationForm;
