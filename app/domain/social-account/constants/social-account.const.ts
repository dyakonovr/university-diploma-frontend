import type { SelectOption } from '~/shared/types/ui/select.types';

export const SOCIAL_ACCOUNT_TG_POST_MODE_OPTIONS: SelectOption[] = [
  { label: 'Только пост', value: 'post' },
  { label: 'Только статья (Telegraph)', value: 'article' },
  { label: 'И пост, и статья', value: 'both' },
];