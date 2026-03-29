import type {
  Response,
  ResponseWithPagination,
} from "~/shared/types/core/request.types";
import request from "~/shared/utils/core/request.client";

import type { AdminWorkspace } from "../models/admin.types";

export function getAdminWorkspaces(
  params?: string,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<AdminWorkspace[]>>({
    baseUrl: "MAIN",
    url: "/admin/workspaces",
    method: "GET",
    params,
    signal,
  });
}

export function deleteAdminWorkspace(workspaceId: string) {
  return request<Response<null>>({
    baseUrl: "MAIN",
    url: `/admin/workspaces/${workspaceId}`,
    method: "DELETE",
  });
}
