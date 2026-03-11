import type { SelectOption } from '~/shared/types/ui/select.types';

export const TYPE_LABELS: Record<string, string> = {
  task_tracker: 'Трекер задач',
  crm: 'CRM',
  messenger: 'Мессенджер',
  custom: 'Кастомная',
};

export const TYPE_OPTIONS: SelectOption[] = [
  { label: 'Трекер задач', value: 'task_tracker' },
  { label: 'CRM', value: 'crm' },
  { label: 'Мессенджер', value: 'messenger' },
  { label: 'Кастомная', value: 'custom' },
];
