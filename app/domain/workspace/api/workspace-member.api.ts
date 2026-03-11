import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { QueryParams, ResponseWithPagination } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

import type { WorkspaceMember, WorkspaceMemberRole } from '../models/workspace-member.types';

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

export function getWorkspaceMembers(workspaceId: EntityId, params?: QueryParams, signal: AbortSignal | null = null) {
  return request<ResponseWithPagination<WorkspaceMember[]>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/employees`,
    method: 'GET',
    params,
    signal,
  });
}