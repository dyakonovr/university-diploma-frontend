import type { SelectOption } from '~/shared/types/ui/select.types';

export const SETTING_MESSAGE_INPUT_PARAM_ROLES: SelectOption[] = [
  { label: 'Роль: Системный промпт', value: 'system' },
  { label: 'Роль: Пользователь', value: 'user' },
  { label: 'Роль: Ассистент', value: 'assistant' },
];