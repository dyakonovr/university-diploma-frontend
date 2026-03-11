import type { SelectOption } from '~/shared/types/ui/select.types';

import type { TaskPriority, TaskStatus } from '../models/task.types';
import type { TagType } from "~/shared/types/ui/tag.types";

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: 'Бэклог',
  in_progress: 'В работе',
  review: 'На проверке',
  done: 'Выполнено',
  cancelled: 'Отменено',
};

export const PRIORITY_TAG: Record<TaskPriority, TagType> = {
  low: 'info',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

export const STATUS_TAG: Record<TaskStatus, TagType> = {
  backlog: 'info',
  in_progress: 'warning',
  review: 'warning',
  done: 'success',
  cancelled: 'error',
};

export const PRIORITY_OPTIONS: SelectOption<TaskPriority>[] = [
  { label: 'Низкий', value: 'low' },
  { label: 'Средний', value: 'medium' },
  { label: 'Высокий', value: 'high' },
  { label: 'Критический', value: 'critical' },
];

export const STATUS_OPTIONS: SelectOption<TaskStatus>[] = [
  { label: 'Бэклог', value: 'backlog' },
  { label: 'В работе', value: 'in_progress' },
  { label: 'На проверке', value: 'review' },
  { label: 'Выполнено', value: 'done' },
  { label: 'Отменено', value: 'cancelled' },
];
