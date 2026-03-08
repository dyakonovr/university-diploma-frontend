import type { SelectOption } from '~/shared/types/ui/select.types';
import { parseUrlParams, type URLParamsParsingConfig } from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  search: string | null;
  is_visible: boolean | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'search', type: 'string' },
  { fieldName: 'is_visible', type: 'boolean' },
];

function useNewsCategoriesTableFilters() {
  const filters = ref<TableFilters>({
    search: null,
    is_visible: null,
  });

  const IS_VISIBLE_SELECT_OPTIONS: SelectOption[] = [
    { label: 'Видна на сайте', value: 'true' },
    { label: 'Скрыта на сайте', value: 'false' },
  ];
  
  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      search: params.search ?? null,
      is_visible: params.is_visible ?? null
    };
  };

  const resetFilters = () => {
    filters.value = {
      search: null,
      is_visible: null,
    };
  };

  return {
    filters,
    IS_VISIBLE_SELECT_OPTIONS,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useNewsCategoriesTableFilters;
