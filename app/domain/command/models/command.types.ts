import type { BaseEntity } from '~/shared/types/core/base-entity.types';

export type CommandSessionStatus = 'pending' | 'confirmed' | 'rejected';

export type CommandAction = {
  type: string;
  payload: Record<string, unknown>;
};

export type CommandRequest = {
  text: string;
};

export type CommandRejectRequest = {
  feedback?: string;
};

export type CommandPreviewResponse = {
  session_id: string;
  actions: CommandAction[];
  human_response: string;
  status: 'pending';
};

export type CommandConfirmResponse = {
  actions_executed: CommandAction[];
  human_response: string;
  status: 'confirmed';
};

export type CommandSession = BaseEntity & {
  command_text: string;
  actions: CommandAction[];
  human_response: string;
  status: CommandSessionStatus;
  created_at: string;
  updated_at: string;
};
