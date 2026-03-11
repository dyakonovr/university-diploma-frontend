import type { SelectOption } from '~/shared/types/ui/select.types';

import type { WorkspaceMemberRole } from '../models/workspace-member.types';

export const ROLE_LABELS: Record<WorkspaceMemberRole, string> = {
  owner: 'Владелец',
  manager: 'Менеджер',
  employee: 'Сотрудник',
};

export const ROLE_TAG: Record<WorkspaceMemberRole, string> = {
  owner: 'success',
  manager: 'warning',
  employee: 'info',
};

export const ROLE_OPTIONS: SelectOption[] = [
  { label: 'Менеджер', value: 'manager' },
  { label: 'Сотрудник', value: 'employee' },
];
