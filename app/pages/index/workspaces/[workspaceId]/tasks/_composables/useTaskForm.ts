import { createTask, getTask, updateTask } from '~/domain/task/api/task.api';
import type {
  TaskPriority,
  TaskStatus,
} from '~/domain/task/models/task.types';
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

type TaskForm = {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: Date | null;
};

function useTaskForm(workspaceId: string) {
  const { toastSuccess, toastError } = useCustomToast();
  const route = useRoute();
  const { getBack } = useGetBack(`/workspaces/${workspaceId}/tasks`);

  const loading = ref(false);
  const saving = ref(false);
  const editId = ref<EntityId | null>(null);
  const isEditMode = computed(() => editId.value !== null);

  const formData = ref<FormFields<TaskForm>>({
    title: null,
    description: null,
    priority: "medium",
    status: "backlog",
    deadline: null,
  });

  const formErrors = reactive<FormErrors<TaskForm>>({
    title: "",
    description: "",
    priority: "",
    status: "",
    deadline: "",
  });

  const formRules = ref<FormRules<TaskForm>>({
    title: () => {
      if (!formData.value.title) {
        formErrors.title = ERROR_REQUIRED_FIELD;
        return false;
      }
      return true;
    },
  });

  const getData = async () => {
    if (route.params.taskId && route.params.taskId !== "create") {
      editId.value = route.params.taskId as EntityId;
      loading.value = true;
      try {
        const response = await getTask(editId.value, workspaceId);
        const task = response.data;
        formData.value = {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          deadline: task.deadline ? new Date(task.deadline) : null,
        };
      } catch (e) {
        toastError("Ошибка при получении задачи");
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
    if (!valid) {
      toastError("Ошибка валидации");
      return;
    }

    saving.value = true;
    try {
      const deadline = formData.value.deadline
        ? formData.value.deadline instanceof Date
          ? formData.value.deadline.toISOString()
          : formData.value.deadline
        : null;

      if (editId.value) {
        await updateTask(editId.value, workspaceId, {
          title: formData.value.title ?? undefined,
          description: formData.value.description,
          priority: formData.value.priority ?? undefined,
          status: formData.value.status ?? undefined,
          deadline,
        });
        toastSuccess('Задача обновлена');
      } else {
        await createTask(workspaceId, {
          title: formData.value.title ?? '',
          priority: formData.value.priority ?? 'medium',
          description: formData.value.description,
          deadline,
        });
        toastSuccess('Задача создана');
      }
      getBack();
    } catch (e) {
      if (e instanceof RequestError && e.statusCode === 422) {
        setBackendErrors(formErrors, e.errors);
        toastError("Ошибка валидации формы");
      } else {
        toastError("Ошибка при сохранении задачи");
        showRequestError(e);
      }
    } finally {
      saving.value = false;
    }
  };

  return {
    loading,
    saving,
    editId,
    isEditMode,
    formData,
    formErrors,
    getData,
    onSubmit,
    getBack,
  };
}

export default useTaskForm;
