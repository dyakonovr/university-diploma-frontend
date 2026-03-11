import type { BaseEntity, EntityId } from '~/shared/types/core/base-entity.types';

export type TaskCommentCreate = {
  content: string;
};

export type TaskComment = BaseEntity & {
  taskId: EntityId;
  authorId: EntityId;
  content: string;
  createdAt: string;
};
