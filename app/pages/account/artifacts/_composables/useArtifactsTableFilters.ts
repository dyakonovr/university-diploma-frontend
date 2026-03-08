import {
  parseUrlParams,
  type URLParamsParsingConfig,
} from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  type: string | null;
  name: string | null;
  content_type: string | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'type', type: 'string' },
  { fieldName: 'name', type: 'string' },
  { fieldName: 'content_type', type: 'string' },
];

function useArtifactsTableFilters() {
  const filters = ref<TableFilters>({
    type: null,
    name: null,
    content_type: null,
  });

  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      name: params.name ?? null,
      type: params.type ?? null,
      content_type:
        params.type === 'binary' ? (params.content_type ?? null) : null,
    };
  };

  const resetFilters = () => {
    filters.value = {
      type: null,
      name: null,
      content_type: null,
    };
  };

  return {
    filters,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useArtifactsTableFilters;
