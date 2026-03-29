import type {
  Response,
  ResponseWithPagination,
} from "~/shared/types/core/request.types";
import request from "~/shared/utils/core/request.client";

import type { AdminUser } from "../models/admin.types";

export function getAdminUsers(
  params?: string,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<AdminUser[]>>({
    baseUrl: "MAIN",
    url: "/admin/users",
    method: "GET",
    params,
    signal,
  });
}

export function blockUser(userId: string) {
  return request<Response<null>>({
    baseUrl: "MAIN",
    url: `/admin/users/${userId}/block`,
    method: "POST",
  });
}

export function unblockUser(userId: string) {
  return request<Response<null>>({
    baseUrl: "MAIN",
    url: `/admin/users/${userId}/unblock`,
    method: "POST",
  });
}
