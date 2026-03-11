import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '~/domain/task/constants/task.constants';

type TaskFilters = {
  status: string | null;
  priority: string | null;
};

function useTasksTableFilters() {
  const filters = ref<TaskFilters>({
    status: null,
    priority: null,
  });

  const resetFilters = () => {
    filters.value = { status: null, priority: null };
  };

  return {
    filters,
    STATUS_OPTIONS,
    PRIORITY_OPTIONS,
    resetFilters,
  };
}

export default useTasksTableFilters;
