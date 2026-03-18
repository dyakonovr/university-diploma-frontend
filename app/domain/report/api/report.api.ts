import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type {
  ReportGenerateRequest,
  ReportGenerateResponse,
  StatisticsReport,
  WorkloadReport,
} from '../models/report.types';

export function generateReport(workspaceId: EntityId, data: ReportGenerateRequest) {
  return request<Response<ReportGenerateResponse>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/reports/generate`,
    method: 'POST',
    data,
  });
}

export function getReportStatistics(
  workspaceId: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<StatisticsReport>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/reports/statistics`,
    method: 'GET',
    signal,
  });
}

export function getReportWorkload(
  workspaceId: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<WorkloadReport>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/reports/workload`,
    method: 'GET',
    signal,
  });
}
