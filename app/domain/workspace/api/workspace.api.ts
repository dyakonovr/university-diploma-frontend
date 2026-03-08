import type { QueryParams, Response,ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';
import type { Workspace, WorkspaceCreate } from "../models/workspace.types";
import type { EntityId } from "~/shared/types/core/base-entity.types";

export function getWorkspaces(
  id: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null
) {
  return request<ResponseWithPagination<Workspace[]>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${id}`,
    method: 'GET',
    params,
    signal,
  });
}

export function getWorkspace(id: EntityId, signal: AbortSignal | null = null) {
  return request<Response<Workspace>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${id}`,
    method: 'GET',
    signal,
  });
}

export function createWorkspace(data: WorkspaceCreate) {
  return request<Response<Workspace>>({
    baseUrl: 'MAIN',
    url: `/workspaces`,
    method: 'POST',
    data,
  });
}

export function updateWorkspace(
  id: EntityId,
  data: WorkspaceCreate
) {
  return request<Response<Workspace>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${id}`,
    method: 'PUT',
    data,
  });
}

export function deleteWorkspace(id: EntityId) {
  return request<Response<Workspace>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${id}`,
    method: 'DELETE',
  });
}