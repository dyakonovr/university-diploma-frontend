import { PROVIDER_CONTENT_TYPES } from '~/domain/provider/constants/provider.const';
import type { SelectOption } from '~/shared/types/ui/select.types';

import type { ModelCapabilityInputParam, ModelCapabilityInputParamType } from '../models/model.types';

export const MODEL_INPUT_PARAM_TYPES: SelectOption<ModelCapabilityInputParamType>[] = [
  { label: 'Setting', value: 'Setting' },
  { label: 'Message', value: 'Message' },
  ...PROVIDER_CONTENT_TYPES,
];

export const MODEL_VARIABLE_TYPES: SelectOption<ModelCapabilityInputParam['variable_type']>[] = [
  { label: 'int', value: 'int' },
  { label: 'string', value: 'string' },
  { label: 'float', value: 'float' },
  { label: 'bool', value: 'bool' },
];
