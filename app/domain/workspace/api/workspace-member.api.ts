import request from "~/shared/utils/core/request.client";
import type { WorkspaceMemberRole } from "../models/workspace-member.types";
import type { EntityId } from "~/shared/types/core/base-entity.types";

type InviteMemberRequest = {
  user_id: EntityId;
  role: WorkspaceMemberRole;
};

export function inviteMemberToWorkspace(workspaceId: EntityId, data: InviteMemberRequest) {
  return request({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/members/invite`,
    method: 'POST',
    data,
  });
}

export function removeMemberFromWorkspace(workspaceId: EntityId, userId: EntityId) {
  return request({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/members/${userId}`,
    method: 'DELETE',
  });
}