import {
  PROVIDER_COMPUTING_TYPES,
  PROVIDER_CONTENT_TYPES,
} from '~/domain/provider/constants/provider.const';
import type { SelectOption } from '~/shared/types/ui/select.types';
import {
  parseUrlParams,
  type URLParamsParsingConfig,
} from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  name: string | null;
  is_active: boolean | null;
  is_configured: boolean | null;
  computing_type: string | null;
  content_type: string | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'name', type: 'string' },
  { fieldName: 'is_active', type: 'boolean' },
  { fieldName: 'is_configured', type: 'boolean' },
  { fieldName: 'computing_type', type: 'string' },
  { fieldName: 'content_type', type: 'string' },
];

function useProvidersTableFilters() {
  const filters = ref<TableFilters>({
    name: null,
    is_active: null,
    is_configured: null,
    computing_type: null,
    content_type: null,
  });

  const IS_ACTIVE_SELECT_OPTIONS: SelectOption[] = [
    { label: 'Все', value: null },
    { label: 'Активные', value: true },
    { label: 'Неактивные', value: false },
  ];
  const IS_CONFIGURATED_SELECT_OPTIONS: SelectOption[] = [
    { label: 'Все провайдеры', value: null },
    { label: 'Провайдер сконфигурирован', value: true },
    { label: 'Провайдер не сконфигурирован', value: false },
  ];
  const COMPUTING_TYPE_SELECT_OPTIONS: SelectOption[] = [
    { label: 'Все', value: null },
    ...PROVIDER_COMPUTING_TYPES,
  ];
  const CONTENT_TYPE_SELECT_OPTIONS: SelectOption[] = [
    { label: 'Все', value: null },
    ...PROVIDER_CONTENT_TYPES,
  ];

  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      name: params.name ?? null,
      is_active: params.is_active ?? null,
      is_configured: params.is_configured ?? null,
      computing_type: params.computing_type ?? null,
      content_type: params.content_type ?? null,
    };
  };

  const resetFilters = () => {
    filters.value = {
      name: null,
      is_active: null,
      is_configured: null,
      computing_type: null,
      content_type: null,
    };
  };

  return {
    filters,
    IS_ACTIVE_SELECT_OPTIONS,
    IS_CONFIGURATED_SELECT_OPTIONS,
    COMPUTING_TYPE_SELECT_OPTIONS,
    CONTENT_TYPE_SELECT_OPTIONS,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useProvidersTableFilters;
