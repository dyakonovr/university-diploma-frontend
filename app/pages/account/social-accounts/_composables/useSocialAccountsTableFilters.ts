import { getSocialAccountProvidersApi } from '~/domain/social-account/api/social-account-provider.api';
import type { SocialAccountProvider } from '~/domain/social-account/models/social-account-provider';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { SelectOption } from '~/shared/types/ui/select.types';
import { parseUrlParams, type URLParamsParsingConfig } from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  name: string | null;
  provider: string | null;
  is_active: boolean | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'name', type: 'string' },
  { fieldName: 'provider', type: 'string' },
  { fieldName: 'is_active', type: 'boolean' },
];

function useSocialAccountsTableFilters() {
  const filters = ref<TableFilters>({
    is_active: null,
    name: null,
    provider: null,
  });

  const IS_ACTIVE_SELECT_OPTIONS: SelectOption[] = [
    { label: 'Активный аккаунт', value: true },
    { label: 'Неактивный аккаунт', value: false },
  ];

  const providers = useSelectInfiniteScroll<SocialAccountProvider>({
    mapFunc: (item) => ({ label: item.name, value: item.name }),
    requestFunc: getSocialAccountProvidersApi,
    errorMessage: 'Ошибка при получении соц. сетей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
  });
  
  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      name: params.name ?? null,
      provider: params.provider ?? null,
      is_active: params.is_active ?? null
    };
  };

  const resetFilters = () => {
    filters.value = {
      is_active: null,
      name: null,
      provider: null,
    };
  };

  return {
    filters,
    providers,
    IS_ACTIVE_SELECT_OPTIONS,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useSocialAccountsTableFilters;
