import type { QueryParams, Response,ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';
import type { TaskComment, TaskCommentCreate } from "../models/task-comment.types";
import type { EntityId } from "~/shared/types/core/base-entity.types";

export function getTaskComments(
  workspaceId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null
) {
  return request<ResponseWithPagination<TaskComment[]>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/task-comments`,
    method: 'GET',
    params,
    signal,
  });
}

export function createTaskComment(workspaceId: EntityId, data: TaskCommentCreate) {
  return request<Response<TaskComment>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/task-comments`,
    method: 'POST',
    data,
  });
}

export function updateTaskComment(
  id: EntityId,
  workspaceId: EntityId,
  data: TaskCommentCreate
) {
  return request<Response<TaskComment>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/task-comments/${id}`,
    method: 'PUT',
    data,
  });
}

export function deleteTaskComment(id: EntityId, workspaceId: EntityId) {
  return request<Response<TaskComment>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/task-comments/${id}`,
    method: 'DELETE',
  });
}