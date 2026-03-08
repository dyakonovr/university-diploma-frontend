import {
  getNewsCategories,
  getNewsCategory,
} from '~/domain/news-category/api/news-categories.api';
import type { NewsCategory } from '~/domain/news-category/models/news-category.types';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';
import {
  parseUrlParams,
  type URLParamsParsingConfig,
} from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  search: string | null;
  category_id: EntityId | null;
  is_visible: boolean | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'search', type: 'string' },
  { fieldName: 'category_id', type: 'string' },
  { fieldName: 'is_visible', type: 'boolean' },
];

function useNewsSubcategoriesTableFilters() {
  const filters = ref<TableFilters>({
    search: null,
    category_id: null,
    is_visible: null,
  });

  const IS_VISIBLE_SELECT_OPTIONS: SelectOption[] = [
    { label: 'Видна на сайте', value: 'true' },
    { label: 'Скрыта на сайте', value: 'false' },
  ];

  const categories = useSelectInfiniteScroll<NewsCategory>({
    mapFunc: (item) => ({
      label: item.name,
      value: item.id,
      is_visible: item.is_visible,
    }),
    requestFunc: getNewsCategories,
    errorMessage: 'Ошибка при получении категорий новостей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
    getOneRequestFunc: getNewsCategory,
    currentModelValue: () => filters.value.category_id,
  });

  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      search: params.search ?? null,
      category_id: params.category_id ?? null,
      is_visible: params.is_visible ?? null,
    };
  };

  const resetFilters = () => {
    filters.value = {
      search: null,
      category_id: null,
      is_visible: null,
    };
  };

  return {
    filters,
    categories,
    IS_VISIBLE_SELECT_OPTIONS,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useNewsSubcategoriesTableFilters;
