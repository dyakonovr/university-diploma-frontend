import type { EntityId } from '~/shared/types/core/base-entity.types';
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type {
  ScheduleTimeSlot,
  ScheduleTimeSlotCreate,
} from '../models/schedule.types';

export function getScheduleTimeSlots(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<ScheduleTimeSlot[]>>({
    baseUrl: 'SOCIAL_POST',
    url: '/schedules',
    method: 'GET',
    params,
    signal,
  });
}

export function getScheduleTimeSlot(
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<Response<ScheduleTimeSlot>>({
    baseUrl: 'SOCIAL_POST',
    url: '/schedules',
    method: 'GET',
    params,
    signal,
  });
}

export function getScheduleTimeSlotById(
  id: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<ScheduleTimeSlot>>({
    baseUrl: 'SOCIAL_POST',
    url: `/schedules/${id}`,
    method: 'GET',
    signal,
  });
}

export function createScheduleTimeSlot(
  body: ScheduleTimeSlotCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<ScheduleTimeSlot>>({
    baseUrl: 'SOCIAL_POST',
    url: '/schedules',
    method: 'POST',
    signal,
    data: body,
  });
}

export function updateScheduleTimeSlot(
  id: EntityId,
  body: ScheduleTimeSlotCreate,
  signal: AbortSignal | null = null,
) {
  return request<Response<ScheduleTimeSlot>>({
    baseUrl: 'SOCIAL_POST',
    url: `/schedules/${id}`,
    method: 'PUT',
    signal,
    data: body,
  });
}

export function deleteScheduleTimeSlot(
  id: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<ScheduleTimeSlot>>({
    baseUrl: 'SOCIAL_POST',
    url: `/schedules/${id}`,
    method: 'DELETE',
    signal,
  });
}

export function pauseScheduleTimeSlot(id: EntityId, params?: QueryParams) {
  return request<Response<ScheduleTimeSlot>>({
    baseUrl: 'SOCIAL_POST',
    url: `/schedules/${id}/pause`,
    method: 'PATCH',
    params,
  });
}

export function resumeScheduleTimeSlot(id: EntityId, params?: QueryParams) {
  return request<Response<ScheduleTimeSlot>>({
    baseUrl: 'SOCIAL_POST',
    url: `/schedules/${id}/resume`,
    method: 'PATCH',
    params,
  });
}
