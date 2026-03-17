import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { QueryParams, Response, ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type { Task, TaskCreate, TaskUpdate } from '../models/task.types';

export function getTasks(
  workspaceId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Task[]>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/tasks`,
    method: 'GET',
    params,
    signal,
  });
}

export function getTask(id: EntityId, workspaceId: EntityId, signal: AbortSignal | null = null) {
  return request<Response<Task>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/tasks/${id}`,
    method: 'GET',
    signal,
  });
}

export function createTask(workspaceId: EntityId, data: TaskCreate) {
  return request<Response<Task>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/tasks`,
    method: 'POST',
    data,
  });
}

export function updateTask(id: EntityId, workspaceId: EntityId, data: TaskUpdate) {
  return request<Response<Task>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/tasks/${id}`,
    method: 'PATCH',
    data,
  });
}

export function deleteTask(id: EntityId, workspaceId: EntityId) {
  return request<unknown>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/tasks/${id}`,
    method: 'DELETE',
  });
}