import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { QueryParams, Response } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type { SocialPostStatisticDynamicItem } from '../models/social-post-statistic.types';

/** Получение *общей* статистики и *динамики* *конкретного* поста */
export function getSocialPostDynamicStatistic(
  post_id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<
    Response<{ data: SocialPostStatisticDynamicItem[]; post_id: EntityId }>
  >({
    baseUrl: 'SOCIAL_POST',
    url: `/statistics/post/${post_id}/dynamic`,
    method: 'GET',
    params,
    signal,
  });
}

/** Получение *общей* статистики и *динамики* *всех постов* конкретного *Social Account* */
export function getSocialPostsDynamicStatisticByAccountId(
  social_account_id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<
    Response<{ data: SocialPostStatisticDynamicItem[]; account_id: EntityId }>
  >({
    baseUrl: 'SOCIAL_POST',
    url: `/statistics/account/${social_account_id}/dynamic`,
    method: 'GET',
    params,
    signal,
  });
}

/** Получение *общей* статистики и *динамики* *всех постов* текущего *пользователя по всем Social Account* */
export function getSocialPostsDynamicStatisticByUserId(
  user_id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<
    Response<{ data: SocialPostStatisticDynamicItem[]; user_id: EntityId }>
  >({
    baseUrl: 'SOCIAL_POST',
    url: `/statistics/user/${user_id}/dynamic`,
    method: 'GET',
    params,
    signal,
  });
}
