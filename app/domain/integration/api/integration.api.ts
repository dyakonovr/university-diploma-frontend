import type { EntityId } from "~/shared/types/core/base-entity.types";
import type {
  QueryParams,
  Response,
  ResponseWithPagination,
} from "~/shared/types/core/request.types";
import request from "~/shared/utils/core/request.client";

import type {
  AvailableIntegration,
  HealthCheckResponse,
  Integration,
  IntegrationCreate,
  SyncResponse,
} from "../models/integration.types";

export function getIntegrations(
  workspaceId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<Integration[]>>({
    baseUrl: "MAIN",
    url: `/workspaces/${workspaceId}/integrations`,
    method: "GET",
    params,
    signal,
  });
}

export function getIntegration(
  id: EntityId,
  workspaceId: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<Integration>>({
    baseUrl: "MAIN",
    url: `/workspaces/${workspaceId}/integrations/${id}`,
    method: "GET",
    signal,
  });
}

export function createIntegration(
  workspaceId: EntityId,
  data: IntegrationCreate,
) {
  return request<Response<Integration>>({
    baseUrl: "MAIN",
    url: `/workspaces/${workspaceId}/integrations`,
    method: "POST",
    data,
  });
}

export function deleteIntegration(id: EntityId, workspaceId: EntityId) {
  return request<Response<Integration>>({
    baseUrl: "MAIN",
    url: `/workspaces/${workspaceId}/integrations/${id}`,
    method: "DELETE",
  });
}

export function regenerateIntegrationToken(
  id: EntityId,
  workspaceId: EntityId,
) {
  return request<Response<{ apiToken: string; tokenExpiresAt: string }>>({
    baseUrl: "MAIN",
    url: `/workspaces/${workspaceId}/integrations/${id}/regenerate-token`,
    method: "POST",
  });
}

export function testIntegration(id: EntityId, workspaceId: EntityId) {
  return request<Response<HealthCheckResponse>>({
    baseUrl: "MAIN",
    url: `/workspaces/${workspaceId}/integrations/${id}/test`,
    method: "POST",
  });
}

export function syncIntegration(id: EntityId, workspaceId: EntityId) {
  return request<Response<SyncResponse>>({
    baseUrl: "MAIN",
    url: `/workspaces/${workspaceId}/integrations/${id}/sync`,
    method: "POST",
  });
}

export function getAvailableIntegrations() {
  return request<Response<AvailableIntegration[]>>({
    baseUrl: "MAIN",
    url: "/integrations/available",
    method: "GET",
  });
}
