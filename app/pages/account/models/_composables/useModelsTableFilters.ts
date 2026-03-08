import { getProvider, getProviders } from '~/domain/provider/api/providers.api';
import type { Provider } from '~/domain/provider/models/provider.types';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { SelectOption } from '~/shared/types/ui/select.types';
import {
  parseUrlParams,
  type URLParamsParsingConfig,
} from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  name: string | null;
  is_active: boolean | null;
  is_configured: boolean | null;
  provider_id: string | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'name', type: 'string' },
  { fieldName: 'is_active', type: 'boolean' },
  { fieldName: 'is_configured', type: 'boolean' },
  { fieldName: 'provider_id', type: 'string' },
];

const IS_ACTIVE_SELECT_OPTIONS: SelectOption[] = [
  { label: 'Все', value: null },
  { label: 'Активные', value: true },
  { label: 'Неактивные', value: false },
];
const IS_CONFIGURATED_SELECT_OPTIONS: SelectOption[] = [
  { label: 'Все провайдеры', value: null },
  { label: 'Модель сконфигурирована', value: true },
  { label: 'Модель не сконфигурирована', value: false },
];

function useModelsTableFilters() {
  const filters = ref<TableFilters>({
    name: null,
    is_active: null,
    is_configured: null,
    provider_id: null,
  });

  const providers = useSelectInfiniteScroll<Provider>({
    mapFunc: (item) => ({
      label: item.display_name || item.name,
      value: item.id,
    }),
    requestFunc: getProviders,
    errorMessage: 'Ошибка при получении провайдеров',
    requestParams: (meta, searchValue) => ({
      // TODO: по какому полю будет поиск? name / display_name?
      name: searchValue,
    }),
    getOneRequestFunc: getProvider,
    currentModelValue: () => filters.value.provider_id,
  });

  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      name: params.name ?? null,
      is_active: params.is_active ?? null,
      is_configured: params.is_configured ?? null,
      provider_id: params.provider_id ?? null,
    };
  };

  const resetFilters = () => {
    filters.value = {
      name: null,
      is_active: null,
      is_configured: null,
      provider_id: null,
    };
  };

  return {
    filters,
    IS_ACTIVE_SELECT_OPTIONS,
    IS_CONFIGURATED_SELECT_OPTIONS,
    providers,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useModelsTableFilters;
