import type {
  BaseEntity,
  EntityId,
} from "~/shared/types/core/base-entity.types";

export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus =
  | "backlog"
  | "in_progress"
  | "review"
  | "done"
  | "cancelled";

/** Task response from backend (all fields snake_case) */
export type Task = BaseEntity & {
  workspace_id: EntityId;
  assignee_id: EntityId | null;
  created_by: EntityId;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  external_id: string | null;
  external_source: string | null;
};

/** Request body for creating a task (matches backend CreateTaskRequest) */
export type TaskCreate = {
  title: string;
  description?: string | null;
  assignee_id?: string | null;
  priority: string;
  deadline?: string | null;
};

/** Request body for updating a task (matches backend UpdateTaskRequest) */
export type TaskUpdate = {
  title?: string;
  description?: string | null;
  assignee_id?: string | null;
  clear_assignee?: boolean;
  priority?: string;
  status?: string;
  deadline?: string | null;
  clear_deadline?: boolean;
};
