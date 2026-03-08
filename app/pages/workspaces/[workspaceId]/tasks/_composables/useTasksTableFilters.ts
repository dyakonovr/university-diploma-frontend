import type { SelectOption } from '~/shared/types/ui/select.types';

type TaskFilters = {
  status: string | null;
  priority: string | null;
};

function useTasksTableFilters() {
  const filters = ref<TaskFilters>({
    status: null,
    priority: null,
  });

  const STATUS_OPTIONS: SelectOption[] = [
    { label: 'Бэклог', value: 'backlog' },
    { label: 'В работе', value: 'in_progress' },
    { label: 'На проверке', value: 'review' },
    { label: 'Выполнено', value: 'done' },
    { label: 'Отменено', value: 'cancelled' },
  ];

  const PRIORITY_OPTIONS: SelectOption[] = [
    { label: 'Низкий', value: 'low' },
    { label: 'Средний', value: 'medium' },
    { label: 'Высокий', value: 'high' },
    { label: 'Критический', value: 'critical' },
  ];

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
