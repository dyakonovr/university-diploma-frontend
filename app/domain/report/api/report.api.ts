import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type { ReportGenerateRequest, ReportGenerateResponse } from '../models/report.types';

export function generateReport(workspaceId: EntityId, data: ReportGenerateRequest) {
  return request<Response<ReportGenerateResponse>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/reports/generate`,
    method: 'POST',
    data,
  });
}
