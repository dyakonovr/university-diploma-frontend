import { parseUrlParams, type URLParamsParsingConfig } from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  name: string | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'name', type: 'string' },
];

function useMyPrivateFlowsFilters() {
  const filters = ref<TableFilters>({
    name: null,
  });

  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      name: params.name ?? null,
    };
  };

  const resetFilters = () => {
    filters.value = {
      name: null,
    };
  };

  return {
    filters,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useMyPrivateFlowsFilters;
