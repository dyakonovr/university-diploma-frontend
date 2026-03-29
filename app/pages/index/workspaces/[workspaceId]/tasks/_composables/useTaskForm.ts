import { createTask, getTask, updateTask } from '~/domain/task/api/task.api';
import type {
  TaskPriority,
  TaskStatus,
} from '~/domain/task/models/task.types';
import { getWorkspaceMembers } from '~/domain/workspace/api/workspace-member.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useGetBack from '~/shared/composables/useGetBack';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import { RequestError } from '~/shared/errors/request.errors';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  FormErrors,
  FormFields,
  FormRules,
} from '~/shared/types/core/form-validation.types';
import type { SelectOption } from '~/shared/types/ui/select.types';
import {
  clearFormValidation,
  setBackendErrors,
  validateForm,
} from '~/shared/utils/core/formValidation';
import { showRequestError } from '~/shared/utils/core/show-request-error';

type TaskForm = {
  title: string;
  description: string;
  assignee_id: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
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

  const externalLink = ref<string | null>(null);
  const externalId = ref<string | null>(null);
  const externalSource = ref<string | null>(null);

  const memberOptions = ref<SelectOption[]>([]);

  const formData = ref<FormFields<TaskForm>>({
    title: null,
    description: null,
    assignee_id: null,
    priority: 'medium',
    status: 'backlog',
    progress: 0,
    deadline: null,
  });

  const formErrors = reactive<FormErrors<TaskForm>>({
    title: '',
    description: '',
    assignee_id: '',
    priority: '',
    status: '',
    progress: '',
    deadline: '',
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

  const loadMembers = async () => {
    try {
      const response = await getWorkspaceMembers(workspaceId);
      memberOptions.value = response.data.map((m) => ({
        label: m.name,
        value: m.id,
      }));
    } catch {
      // non-critical
    }
  };

  const getData = async () => {
    try {
      await loadMembers();

      if (route.params.taskId && route.params.taskId !== 'create') {
        const taskId = route.params.taskId as EntityId;

        editId.value = taskId;
        loading.value = true;
        
        const response = await getTask(taskId, workspaceId);
        const task = response.data;
        formData.value = {
          title: task.title,
          description: task.description,
          assignee_id: task.assignee_id,
          priority: task.priority,
          status: task.status,
          progress: task.progress,
          deadline: task.deadline ? new Date(task.deadline) : null,
        };
        externalLink.value = task.external_link ?? null;
        externalId.value = task.external_id ?? null;
        externalSource.value = task.external_source ?? null;
      }
    } catch (e) {
      toastError('Ошибка при получении задачи');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(
      formRules.value as Record<string, () => boolean>,
    );
    if (!valid) {
      toastError('Ошибка валидации');
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
          assignee_id: formData.value.assignee_id ?? undefined,
          clear_assignee: formData.value.assignee_id === null,
          priority: formData.value.priority ?? undefined,
          status: formData.value.status ?? undefined,
          progress: formData.value.progress ?? undefined,
          deadline,
        });
        toastSuccess('Задача обновлена');
      } else {
        await createTask(workspaceId, {
          title: formData.value.title ?? '',
          priority: formData.value.priority ?? 'medium',
          description: formData.value.description,
          assignee_id: formData.value.assignee_id,
          deadline,
        });
        toastSuccess('Задача создана');
      }
      getBack();
    } catch (e) {
      if (e instanceof RequestError && e.statusCode === 422) {
        setBackendErrors(formErrors, e.errors);
        toastError('Ошибка валидации формы');
      } else {
        toastError('Ошибка при сохранении задачи');
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
    memberOptions,
    externalLink,
    externalId,
    externalSource,
    getData,
    onSubmit,
    getBack,
  };
}

export default useTaskForm;
