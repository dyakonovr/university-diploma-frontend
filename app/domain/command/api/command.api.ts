import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { QueryParams, Response, ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';
import { createSSEClient } from '~/shared/utils/core/sse.client';

import type {
  ActionProgressEvent,
  CommandConfirmResponse,
  CommandPreviewResponse,
  CommandRejectRequest,
  CommandRequest,
  CommandSessionRaw,
  PreviewStage,
} from '../models/command.types';

export function postCommand(workspaceId: EntityId, data: CommandRequest) {
  return request<Response<CommandPreviewResponse>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/command`,
    method: 'POST',
    data,
  });
}

export function postCommandStream(
  workspaceId: EntityId,
  data: CommandRequest,
  callbacks: {
    onStatus: (stage: PreviewStage) => void;
    onResult: (preview: CommandPreviewResponse) => void;
    onError: (message: string) => void;
    onDone: () => void;
  },
  signal?: AbortSignal,
) {
  return createSSEClient({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/command/stream`,
    body: data as unknown as Record<string, unknown>,
    signal,
    onEvent(event, rawData) {
      if (event === 'status') {
        const parsed = JSON.parse(rawData) as { stage: PreviewStage };
        callbacks.onStatus(parsed.stage);
      } else if (event === 'result') {
        const parsed = JSON.parse(rawData) as CommandPreviewResponse;
        callbacks.onResult(parsed);
      }
    },
    onError(err) {
      callbacks.onError(err.message);
    },
    onDone() {
      callbacks.onDone();
    },
  });
}

export function confirmCommandSessionStream(
  workspaceId: EntityId,
  sessionId: EntityId,
  callbacks: {
    onActionStart: (progress: ActionProgressEvent) => void;
    onActionDone: (progress: ActionProgressEvent) => void;
    onResult: (result: CommandConfirmResponse) => void;
    onError: (message: string) => void;
    onDone: () => void;
  },
  signal?: AbortSignal,
) {
  return createSSEClient({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/command/${sessionId}/confirm/stream`,
    signal,
    onEvent(event, rawData) {
      if (event === 'action_start') {
        callbacks.onActionStart(JSON.parse(rawData) as ActionProgressEvent);
      } else if (event === 'action_done') {
        callbacks.onActionDone(JSON.parse(rawData) as ActionProgressEvent);
      } else if (event === 'result') {
        callbacks.onResult(JSON.parse(rawData) as CommandConfirmResponse);
      }
    },
    onError(err) {
      callbacks.onError(err.message);
    },
    onDone() {
      callbacks.onDone();
    },
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
