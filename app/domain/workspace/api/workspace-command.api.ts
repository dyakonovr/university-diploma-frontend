import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { Response } from '~/shared/types/core/request.types';
import request from '~/shared/utils/core/request.client';

type CommandRequest = {
  text: string;
};

type ActionExecuted = {
  type: string;
  payload: Record<string, unknown>;
};

export type CommandResponse = {
  actions_executed: ActionExecuted[];
  human_response: string;
};

export function postWorkspaceCommand(workspaceId: EntityId, data: CommandRequest) {
  return request<Response<CommandResponse>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/command`,
    method: 'POST',
    data,
  });
}
