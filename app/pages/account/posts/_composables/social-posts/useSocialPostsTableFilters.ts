import { getPostRequest, getPosts } from '~/domain/raw-post/api/raw-posts.api';
import type { RawPost } from '~/domain/raw-post/models/raw-post.types';
import { getScheduleTimeSlots } from '~/domain/schedule/api/schedule.api';
import type { ScheduleTimeSlot } from '~/domain/schedule/models/schedule.types';
import { formatScheduleSlotLabel } from '~/domain/schedule/utils/schedule.utils';
import { getSocialAccount, getSocialAccounts } from '~/domain/social-account/api/social-account.api';
import type { SocialAccount } from '~/domain/social-account/models/social-account.types';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import { parseUrlParams, type URLParamsParsingConfig } from '~/shared/utils/core/parseURLParams';

type TableFilters = {
  post_id: EntityId | null;
  social_account_id: EntityId | null;
  schedule_id: EntityId | null;
};

const parsingConfig: URLParamsParsingConfig<TableFilters> = [
  { fieldName: 'post_id', type: 'string' },
  { fieldName: 'social_account_id', type: 'string' },
  { fieldName: 'schedule_id', type: 'string' },
];

function useSocialPostsTableFilters() {
  const filters = ref<TableFilters>({
    post_id: null,
    social_account_id: null,
    schedule_id: null,
  });

  const rawPosts = useSelectInfiniteScroll<RawPost>({
    mapFunc: (item) => ({ label: `Raw post ${item.id}`, value: item.id }),
    requestFunc: getPosts,
    errorMessage: 'Ошибка при получении сырых шаблонов',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
    getOneRequestFunc: getPostRequest,
    currentModelValue: () => filters.value.post_id,
  });
  const socialAccounts = useSelectInfiniteScroll<SocialAccount>({
    mapFunc: (item) => ({
      label: `${item.account_name} (${item.provider})`,
      value: item.id,
    }),
    requestFunc: getSocialAccounts,
    errorMessage: 'Ошибка при получении аккаунтов соц. сетей',
    requestParams: (meta, searchValue) => ({
      name: searchValue,
    }),
    getOneRequestFunc: getSocialAccount,
    currentModelValue: () => filters.value.social_account_id,
  });

  const scheduleSlots = useSelectInfiniteScroll<ScheduleTimeSlot>({
    mapFunc: (item) => ({
      label: formatScheduleSlotLabel(item),
      value: item.id,
    }),
    requestFunc: getScheduleTimeSlots,
    errorMessage: 'Ошибка при получении слотов расписания',
    currentModelValue: () => filters.value.schedule_id,
  });

  const parseFiltersFromUrl = () => {
    const params = parseUrlParams(parsingConfig);
    filters.value = {
      post_id: params.post_id ?? null,
      social_account_id: params.social_account_id ?? null,
      schedule_id: params.schedule_id ?? null,
    };
  };

  const resetFilters = () => {
    filters.value = {
      post_id: null,
      social_account_id: null,
      schedule_id: null,
    };
  };

  return {
    filters,
    rawPosts,
    socialAccounts,
    scheduleSlots,
    parseFiltersFromUrl,
    resetFilters,
  };
}

export default useSocialPostsTableFilters;
