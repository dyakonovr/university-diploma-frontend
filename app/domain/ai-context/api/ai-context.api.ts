import type { QueryParams, Response,ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';
import type { AiContext, AiContextCreate } from "../models/ai-context.types";
import type { EntityId } from "~/shared/types/core/base-entity.types";

export function getAiContext(
  workspaceId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null
) {
  return request<Response<AiContext>>({
    baseUrl: 'MAIN',
    url: `/workspace/${workspaceId}/context`,
    method: 'GET',
    params,
    signal,
  });
}

export function updateAiContext(
  workspaceId: EntityId,
  data: AiContextCreate
) {
  return request<Response<AiContext>>({
    baseUrl: 'MAIN',
    url: `/workspace/${workspaceId}/context`,
    method: 'PUT',
    data,
  });
}