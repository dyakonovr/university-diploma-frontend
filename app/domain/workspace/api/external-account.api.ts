import type { EntityId } from "~/shared/types/core/base-entity.types";
import type { Response } from "~/shared/types/core/request.types";
import request from "~/shared/utils/core/request.client";

import type { ExternalAccount } from "../models/external-account.types";

export function getExternalAccounts(workspaceId: EntityId, userId: EntityId) {
  return request<Response<ExternalAccount[]>>({
    baseUrl: "MAIN",
    url: `/workspaces/${workspaceId}/employees/${userId}/external-accounts`,
    method: "GET",
  });
}
