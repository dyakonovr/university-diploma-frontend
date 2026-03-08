import type { QueryParams, Response,ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';
import type { EntityId } from "~/shared/types/core/base-entity.types";
import type { Integration, IntegrationCreate } from "../models/integration.types";

export function getIntegrations(
  workspaceId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null
) {
  return request<ResponseWithPagination<Integration[]>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/integrations`,
    method: 'GET',
    params,
    signal,
  });
}

export function getIntegration(id: EntityId, workspaceId: EntityId, signal: AbortSignal | null = null) {
  return request<Response<Integration>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/integrations/${id}`,
    method: 'GET',
    signal,
  });
}

export function createIntegration(workspaceId: EntityId, data: IntegrationCreate) {
  return request<Response<Integration>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/integrations`,
    method: 'POST',
    data,
  });
}

export function deleteIntegration(id: EntityId, workspaceId: EntityId) {
  return request<Response<Integration>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/integrations/${id}`,
    method: 'DELETE',
  });
}

export function regenerateIntegrationToken(
  id: EntityId,
  workspaceId: EntityId,
  data: IntegrationCreate
) {
  return request<Response<{ api_token: string }>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/integrations/${id}/regenerate-token`,
    method: 'POST',
    data,
  });
}