import type { ModelCapabilityInputParamType } from '~/domain/model/models/model.types';
import type { SelectOption } from '~/shared/types/ui/select.types';
export const PROVIDER_COMPUTING_TYPES: SelectOption[] = [
  { label: 'Cloud', value: 'Cloud' },
  { label: 'Local', value: 'Local' },
];

export const PROVIDER_CONTENT_TYPES: SelectOption<ModelCapabilityInputParamType>[] = [
  { label: 'Text', value: 'Text' },
  { label: 'Photo', value: 'Photo' },
  { label: 'Video', value: 'Video' },
  { label: 'Audio', value: 'Audio' },
];
