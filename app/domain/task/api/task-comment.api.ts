import type { Response, ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';
import type { TaskComment, TaskCommentCreate } from '../models/task-comment.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';

export function getTaskComments(
  workspaceId: EntityId,
  taskId: EntityId,
  signal: AbortSignal | null = null
) {
  return request<ResponseWithPagination<TaskComment[]>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/tasks/${taskId}/comments`,
    method: 'GET',
    signal,
  });
}

export function createTaskComment(
  workspaceId: EntityId,
  taskId: EntityId,
  data: TaskCommentCreate
) {
  return request<Response<TaskComment>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/tasks/${taskId}/comments`,
    method: 'POST',
    data,
  });
}

export function deleteTaskComment(
  id: EntityId,
  workspaceId: EntityId,
  taskId: EntityId
) {
  return request<Response<TaskComment>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/tasks/${taskId}/comments/${id}`,
    method: 'DELETE',
  });
}
