import type { BaseEntity } from '~/shared/types/core/base-entity.types';

export type CommandSessionStatus = 'pending' | 'confirmed' | 'rejected' | 'failed';

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
};

/** Raw API response shape for a command session (backend uses session_id, not id) */
export type CommandSessionRaw = {
  session_id: string;
  raw_input: string;
  actions: CommandAction[];
  human_response: string;
  status: CommandSessionStatus;
  feedback?: string;
  created_at: string;
};

/** Frontend command session with `id` mapped from `session_id` for BaseEntity compatibility */
export type CommandSession = BaseEntity & {
  raw_input: string;
  actions: CommandAction[];
  human_response: string;
  status: CommandSessionStatus;
  feedback?: string;
  created_at: string;
};

/** Maps backend session_id → id for frontend use */
export function mapCommandSession(raw: CommandSessionRaw): CommandSession {
  return {
    id: raw.session_id,
    raw_input: raw.raw_input,
    actions: raw.actions,
    human_response: raw.human_response,
    status: raw.status,
    feedback: raw.feedback,
    created_at: raw.created_at,
  };
}
