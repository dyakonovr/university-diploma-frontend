import type { BaseEntity } from '~/shared/types/core/base-entity.types';

export type CommandSessionStatus = 'pending' | 'confirmed' | 'rejected' | 'failed';

export type CommandActionType =
  | 'task.create'
  | 'task.update'
  | 'task.assign'
  | 'task.status'
  | 'task.delete'
  | 'calendar_event.create'
  | 'calendar_event.update'
  | 'calendar_event.delete'
  | 'message.send';

export type TaskCreatePayload = {
  title: string;
  description?: string;
  assignee_id?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
};

export type TaskUpdatePayload = {
  task_id: string;
  title?: string;
  description?: string;
  assignee_id?: string;
  priority?: string;
  status?: string;
  deadline?: string;
};

export type TaskAssignPayload = {
  task_id: string;
  assignee_id: string;
};

export type TaskStatusPayload = {
  task_id: string;
  status: 'backlog' | 'in_progress' | 'review' | 'done' | 'cancelled';
};

export type TaskDeletePayload = {
  task_id: string;
};

export type CalendarEventCreatePayload = {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
};

export type CalendarEventUpdatePayload = {
  event_id: string;
  title?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
};

export type CalendarEventDeletePayload = {
  event_id: string;
};

export type MessageSendPayload = {
  text: string;
  channel_name?: string;
};

export type CommandActionPayload =
  | TaskCreatePayload
  | TaskUpdatePayload
  | TaskAssignPayload
  | TaskStatusPayload
  | TaskDeletePayload
  | CalendarEventCreatePayload
  | CalendarEventUpdatePayload
  | CalendarEventDeletePayload
  | MessageSendPayload;

export type CommandAction = {
  type: CommandActionType;
  payload: CommandActionPayload;
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

// --- SSE streaming types ---

export type PreviewStage = 'building_context' | 'calling_ai' | 'parsing_response' | 'saving_session';

export type PreviewStatusEvent = {
  stage: PreviewStage;
};

export type ActionProgressEvent = {
  index: number;
  total: number;
  action: CommandAction;
  done?: boolean;
  success?: boolean;
  error?: string;
};

export type SSEErrorEvent = {
  message: string;
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
