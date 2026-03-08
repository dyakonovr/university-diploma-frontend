import type { SelectOption } from '~/shared/types/ui/select.types';
import { parseUrlParams, type URLParamsParsingConfig } from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  name: string | null;
  is_public: boolean | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'is_public', type: 'boolean' },
  { fieldName: 'name', type: 'string' },
];

function useFlowCategoriesTableFilters() {
  const filters = ref<TableFilters>({
    name: null,
    is_public: null,
  });

  const IS_PUBLIC_SELECT_OPTIONS: SelectOption[] = [
    { label: 'Публичная категория', value: true },
    { label: 'Непубличная категория', value: false },
  ];

  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      name: params.name ?? null,
      is_public: params.is_public ?? null
    };
  };

  const resetFilters = () => {
    filters.value = {
      name: null,
      is_public: null,
    };
  };

  return {
    filters,
    IS_PUBLIC_SELECT_OPTIONS,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useFlowCategoriesTableFilters;
