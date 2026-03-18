import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { QueryParams, Response, ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type { ReportPreset, ReportPresetCreate } from '../models/report.types';

export function getReportPresets(
  workspaceId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<ReportPreset[]>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/reports/presets`,
    method: 'GET',
    params,
    signal,
  });
}

export function getReportPreset(
  id: EntityId,
  workspaceId: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<ReportPreset>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/reports/presets/${id}`,
    method: 'GET',
    signal,
  });
}

export function createReportPreset(workspaceId: EntityId, data: ReportPresetCreate) {
  return request<Response<ReportPreset>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/reports/presets`,
    method: 'POST',
    data,
  });
}

export function updateReportPreset(
  id: EntityId,
  workspaceId: EntityId,
  data: ReportPresetCreate,
) {
  return request<Response<ReportPreset>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/reports/presets/${id}`,
    method: 'PATCH',
    data,
  });
}

export function deleteReportPreset(id: EntityId, workspaceId: EntityId) {
  return request<Response<ReportPreset>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/reports/presets/${id}`,
    method: 'DELETE',
  });
}

export function seedReportPresets(workspaceId: EntityId) {
  return request<Response<ReportPreset[]>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/reports/presets/seed`,
    method: 'POST',
  });
}
