import type { QueryParams, Response,ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';
import type { CalendarEvent, CalendarEventCreate } from "../models/calendar-event.types";
import type { EntityId } from "~/shared/types/core/base-entity.types";

export function getCalendarEvents(
  workspaceId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null
) {
  return request<ResponseWithPagination<CalendarEvent[]>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/calendar-events`,
    method: 'GET',
    params,
    signal,
  });
}

export function getCalendarEvent(id: EntityId, workspaceId: EntityId, signal: AbortSignal | null = null) {
  return request<Response<CalendarEvent>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/calendar-events/${id}`,
    method: 'GET',
    signal,
  });
}

export function createCalendarEvent(workspaceId: EntityId, data: CalendarEventCreate) {
  return request<Response<CalendarEvent>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/calendar-events`,
    method: 'POST',
    data,
  });
}

export function updateCalendarEvent(
  id: EntityId,
  workspaceId: EntityId,
  data: CalendarEventCreate
) {
  return request<Response<CalendarEvent>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/calendar-events/${id}`,
    method: 'PUT',
    data,
  });
}

export function deleteCalendarEvent(id: EntityId, workspaceId: EntityId) {
  return request<Response<CalendarEvent>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/calendar-events/${id}`,
    method: 'DELETE',
  });
}