import type { BaseEntity, EntityId } from "~/shared/types/core/base-entity.types";

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done' | 'cancelled';

type TaskBase = {
  workspaceId: EntityId;
  assigneeId: EntityId;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string | null;
};

export type TaskCreate = TaskBase;

export type Task = BaseEntity & TaskBase & {
  created_by: EntityId;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}