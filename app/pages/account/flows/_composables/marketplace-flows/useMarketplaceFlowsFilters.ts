import { getPublicFlowCategories, getPublicFlowCategory } from '~/domain/flow-category/api/flow-categories.api';
import type { PublicFlowCategory } from '~/domain/flow-category/models/flow-category.types';
import { getModels } from '~/domain/model/api/models.api';
import type { Model } from '~/domain/model/models/model.types';
import type { SocialAccountProvider, SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';
import { getSocialAccountProviders } from '~/domain/social-account/usecases/social-account-provider.usecases';
import { getPublicUser, getPublicUsers } from '~/domain/user/api/users/users.public-api';
import type { PublicUser } from '~/domain/user/models/user.types';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import { parseUrlParams, type URLParamsParsingConfig } from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  name: string | null;
  social_network: SocialAccountProviderName | null;
  category_id: EntityId | null;
  user_id: EntityId | null;
  models: EntityId[];
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'name', type: 'string' },
  { fieldName: 'social_network', type: 'string' },
  { fieldName: 'category_id', type: 'string' },
  { fieldName: 'user_id', type: 'string' },
  { fieldName: 'models', type: 'string', isArray: true },
];

function useMarketplaceFlowsFilters() {
  const filters = ref<TableFilters>({
    name: null,
    category_id: null,
    user_id: null,
    social_network: null,
    models: [],
  });
  
  const users = useSelectInfiniteScroll<PublicUser>({
    mapFunc: (item) => ({ label: item.username, value: item.id }),
    requestFunc: getPublicUsers,
    errorMessage: 'Ошибка при получении авторов',
    requestParams: (meta, searchValue) => ({
      username: searchValue,
    }),
    getOneRequestFunc: getPublicUser,
    currentModelValue: () => filters.value.user_id,
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
      user_id: params.user_id ?? null,
      social_network: params.social_network ?? null,
      models: params.models ?? [],
    };
  };

  const resetFilters = () => {
    filters.value = {
      name: null,
      category_id: null,
      user_id: null,
      social_network: null,
      models: [],
    };
  };

  return {
    filters,
    users,
    categories,
    socialNetworks,
    models,
    
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useMarketplaceFlowsFilters;
