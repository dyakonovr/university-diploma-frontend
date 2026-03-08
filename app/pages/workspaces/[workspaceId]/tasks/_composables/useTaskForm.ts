import { createTask, updateTask } from '~/domain/task/api/task.api';
import type { Task, TaskCreate, TaskPriority, TaskStatus } from '~/domain/task/models/task.types';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { ERROR_REQUIRED_FIELD } from '~/shared/constants/core/validation-errors.const';
import { RequestError } from '~/shared/errors/request.errors';
import type { FormErrors, FormFields, FormRules } from '~/shared/types/core/form-validation.types';
import { clearFormValidation, setBackendErrors, validateForm } from '~/shared/utils/core/formValidation';
import { showRequestError } from '~/shared/utils/core/show-request-error';

type TaskForm = {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string | null;
};

function useTaskForm(workspaceId: string, onSuccess: () => void) {
  const { toastSuccess, toastError } = useCustomToast();

  const dialogVisible = ref(false);
  const loading = ref(false);
  const editingTask = ref<Task | null>(null);

  const formData = ref<FormFields<TaskForm>>({
    title: null,
    description: null,
    priority: 'medium',
    status: 'backlog',
    deadline: null,
  });

  const formErrors = reactive<FormErrors<TaskForm>>({
    title: '',
    description: '',
    priority: '',
    status: '',
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

  const openCreate = () => {
    editingTask.value = null;
    formData.value = {
      title: null,
      description: null,
      priority: 'medium',
      status: 'backlog',
      deadline: null,
    };
    clearFormValidation(formErrors);
    dialogVisible.value = true;
  };

  const openEdit = (task: Task) => {
    editingTask.value = task;
    formData.value = {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      deadline: task.deadline,
    };
    clearFormValidation(formErrors);
    dialogVisible.value = true;
  };

  const onSubmit = async () => {
    clearFormValidation(formErrors);
    const valid = validateForm(formRules.value as Record<string, () => boolean>);
    if (!valid) {
      toastError('Ошибка валидации');
      return;
    }

    loading.value = true;
    try {
      const data = formData.value as TaskCreate;

      if (editingTask.value) {
        await updateTask(editingTask.value.id, workspaceId, data);
        toastSuccess('Задача обновлена');
      } else {
        await createTask(workspaceId, { ...data, workspaceId, assigneeId: '' });
        toastSuccess('Задача создана');
      }

      dialogVisible.value = false;
      onSuccess();
    } catch (e) {
      if (e instanceof RequestError && e.statusCode === 422) {
        setBackendErrors(formErrors, e.errors);
        toastError('Ошибка валидации формы');
      } else {
        toastError('Ошибка при сохранении задачи');
        showRequestError(e);
      }
    } finally {
      loading.value = false;
    }
  };

  return {
    dialogVisible,
    loading,
    editingTask,
    formData,
    formErrors,
    openCreate,
    openEdit,
    onSubmit,
  };
}

export default useTaskForm;
