import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { QueryParams, Response, ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type {
  CommandConfirmResponse,
  CommandPreviewResponse,
  CommandRejectRequest,
  CommandRequest,
  CommandSessionRaw,
} from '../models/command.types';

export function postCommand(workspaceId: EntityId, data: CommandRequest) {
  return request<Response<CommandPreviewResponse>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/command`,
    method: 'POST',
    data,
  });
}

export function confirmCommandSession(workspaceId: EntityId, sessionId: EntityId) {
  return request<Response<CommandConfirmResponse>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/command/${sessionId}/confirm`,
    method: 'POST',
  });
}

export function rejectCommandSession(
  workspaceId: EntityId,
  sessionId: EntityId,
  data?: CommandRejectRequest,
) {
  return request<Response<CommandPreviewResponse>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/command/${sessionId}/reject`,
    method: 'POST',
    data,
  });
}

export function getCommandSessions(
  workspaceId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<CommandSessionRaw[]>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/command/sessions`,
    method: 'GET',
    params,
    signal,
  });
}

export function getCommandSession(
  workspaceId: EntityId,
  sessionId: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<CommandSessionRaw>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/command/sessions/${sessionId}`,
    method: 'GET',
    signal,
  });
}

export function deleteCommandSession(workspaceId: EntityId, sessionId: EntityId) {
  return request<unknown>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/command/sessions/${sessionId}`,
    method: 'DELETE',
  });
}
