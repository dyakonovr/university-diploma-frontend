import type { Setting, SettingCreate } from '~/domain/flow/model/setting.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

export function getSettings(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Setting[]>>({
    baseUrl: 'FLOW',
    url: '/settings',
    method: 'GET',
    params,
    signal,
  });
}

export function getSetting(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<Setting>>({
    baseUrl: 'FLOW',
    url: `/settings/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function createSetting(
  body: SettingCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<Setting>>({
    baseUrl: 'FLOW',
    url: '/settings',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updateSetting(
  id: EntityId,
  body: SettingCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<Setting>>({
    baseUrl: 'FLOW',
    url: `/settings/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}
