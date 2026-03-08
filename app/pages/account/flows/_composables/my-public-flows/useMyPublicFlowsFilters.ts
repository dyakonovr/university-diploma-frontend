import { getPublicFlowCategories, getPublicFlowCategory } from '~/domain/flow-category/api/flow-categories.api';
import type { PublicFlowCategory } from '~/domain/flow-category/models/flow-category.types';
import type { PublicFlowStatus } from '~/domain/flow/model/public-flow.types';
import { getModels } from '~/domain/model/api/models.api';
import type { Model } from '~/domain/model/models/model.types';
import type { SocialAccountProvider, SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';
import { getSocialAccountProviders } from '~/domain/social-account/usecases/social-account-provider.usecases';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';
import { parseUrlParams, type URLParamsParsingConfig } from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  name: string | null;
  social_network: SocialAccountProviderName | null;
  category_id: EntityId | null;
  status: PublicFlowStatus | null;
  models: EntityId[];
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'name', type: 'string' },
  { fieldName: 'social_network', type: 'string' },
  { fieldName: 'category_id', type: 'string' },
  { fieldName: 'status', type: 'string' },
  { fieldName: 'models', type: 'string', isArray: true },
];

const STATUS_SELECT_OPTIONS: SelectOption<PublicFlowStatus>[] = [
  { label: 'Опубликован', value: 'Approve' },
  { label: 'Отклонён', value: 'Decline' },
  { label: 'На расмотрении', value: 'Review' },
];

function useMyPublicFlowsFilters() {
  const filters = ref<TableFilters>({
    name: null,
    category_id: null,
    status: null,
    social_network: null,
    models: [],
  });
  
  const socialNetworks = useSelectInfiniteScroll<SocialAccountProvider>({
    mapFunc: (item) => ({ label: item.name, value: item.name }),
    requestFunc: getSocialAccountProviders,
    errorMessage: 'Ошибка при получении соц. сетей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
      per_page: 9999,
    }),
  });
  const categories = useSelectInfiniteScroll<PublicFlowCategory>({
    mapFunc: (item) => ({ label: item.name, value: item.id }),
    requestFunc: getPublicFlowCategories,
    errorMessage: 'Ошибка при получении категорий шаблонов',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
    getOneRequestFunc: getPublicFlowCategory,
    currentModelValue: () => filters.value.category_id,
  });
  const models = useSelectInfiniteScroll<Model>({
    mapFunc: (item) => ({ label: item.name, value: item.id }),
    requestFunc: getModels,
    errorMessage: 'Ошибка при получении моделей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
  });

  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      name: params.name ?? null,
      category_id: params.category_id ?? null,
      status: params.status ?? null,
      social_network: params.social_network ?? null,
      models: params.models ?? [],
    };
  };

  const resetFilters = () => {
    filters.value = {
      name: null,
      category_id: null,
      status: null,
      social_network: null,
      models: [],
    };
  };

  return {
    filters,
    STATUS_SELECT_OPTIONS,
    categories,
    socialNetworks,
    models,
    
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useMyPublicFlowsFilters;
