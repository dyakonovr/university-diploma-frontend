import type { BaseEntity, EntityId } from "~/shared/types/core/base-entity.types";

type TaskCommentBase = {
  taskId: EntityId;
  content: string;
};

export type TaskCommentCreate = TaskCommentBase;

export type TaskComment = BaseEntity & TaskCommentBase & {
  author_id: EntityId;
  created_at: string;
};