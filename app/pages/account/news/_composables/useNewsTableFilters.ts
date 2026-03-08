import { getNewsHashtags } from '~/domain/news-hashtag/api/news-hashtag.api';
import type { NewsHashtag } from '~/domain/news-hashtag/models/news-hashtag.types';
import { getNewsSubcategories } from '~/domain/news-subcategory/api/news-subcategories.api';
import type { NewsSubcategory } from '~/domain/news-subcategory/models/news-subcategory.types';
import { getPublicUsers } from '~/domain/user/api/users/users.public-api';
import type { PublicUser } from '~/domain/user/models/user.types';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';
import {
  parseUrlParams,
  type URLParamsParsingConfig,
} from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  title: string | null;
  content: string | null;
  user_id: EntityId | null;
  subcategory_id: EntityId | null;
  is_visible: boolean | null;
  hashtags: EntityId[];
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'title', type: 'string' },
  { fieldName: 'content', type: 'string' },
  { fieldName: 'user_id', type: 'string' },
  { fieldName: 'subcategory_id', type: 'string' },
  { fieldName: 'is_visible', type: 'boolean' },
  { fieldName: 'hashtags', type: 'string', isArray: true },
];

function useNewsTableFilters() {
  const filters = ref<TableFilters>({
    title: null,
    content: null,
    subcategory_id: null,
    user_id: null,
    is_visible: null,
    hashtags: [],
  });

  const IS_VISIBLE_SELECT_OPTIONS: SelectOption[] = [
    { label: 'Видна на сайте', value: 'true' },
    { label: 'Скрыта на сайте', value: 'false' },
  ];

  const subcategories = useSelectInfiniteScroll<NewsSubcategory>({
    mapFunc: (item) => ({
      label: item.name,
      value: item.id,
      is_visible: item.is_visible,
    }),
    requestFunc: getNewsSubcategories,
    errorMessage: 'Ошибка при получении подкатегорий новостей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
  });

  const users = useSelectInfiniteScroll<PublicUser>({
    mapFunc: (item) => ({ label: item.username, value: item.id }),
    requestFunc: getPublicUsers,
    errorMessage: 'Ошибка при получении пользователей',
    requestParams: (meta, searchValue) => ({
      username: searchValue,
    }),
  });

  const hashtags = useSelectInfiniteScroll<NewsHashtag>({
    mapFunc: (item) => ({ label: item.name, value: item.id }),
    requestFunc: getNewsHashtags,
    errorMessage: 'Ошибка при получении хэштегов',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
  });

  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      title: params.title ?? null,
      content: params.content ?? null,
      user_id: params.user_id ?? null,
      subcategory_id: params.subcategory_id ?? null,
      is_visible: params.is_visible ?? null,
      hashtags: params.hashtags ?? [],
    };
  };

  const resetFilters = () => {
    filters.value = {
      title: null,
      content: null,
      subcategory_id: null,
      user_id: null,
      is_visible: null,
      hashtags: [],
    };
  };

  return {
    filters,
    subcategories,
    users,
    hashtags,
    IS_VISIBLE_SELECT_OPTIONS,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useNewsTableFilters;
