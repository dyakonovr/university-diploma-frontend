import { parseUrlParams, type URLParamsParsingConfig } from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  search: string | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'search', type: 'string' },
];

function useNewsHashtagsTableFilters() {
  const filters = ref<TableFilters>({
    search: null,
  });
  
  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      search: params.search ?? null,
    };
  };

  const resetFilters = () => {
    filters.value = {
      search: null,
    };
  };

  return {
    filters,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useNewsHashtagsTableFilters;
