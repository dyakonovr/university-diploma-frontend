import type { SelectOption } from '~/shared/types/ui/select.types';
import type { TagType } from '~/shared/types/ui/tag.types';

import type { CommandSessionStatus } from '../models/command.types';

export const SESSION_STATUS_LABELS: Record<CommandSessionStatus, string> = {
  pending: 'Ожидает',
  confirmed: 'Подтверждено',
  rejected: 'Отклонено',
};

export const SESSION_STATUS_TAG: Record<CommandSessionStatus, TagType> = {
  pending: 'warning',
  confirmed: 'success',
  rejected: 'error',
};

export const SESSION_STATUS_OPTIONS: SelectOption<CommandSessionStatus>[] = [
  { label: 'Ожидает', value: 'pending' },
  { label: 'Подтверждено', value: 'confirmed' },
  { label: 'Отклонено', value: 'rejected' },
];
