import type { BaseEntity, EntityId } from '~/shared/types/core/base-entity.types';

export type TaskCommentCreate = {
  content: string;
};

export type TaskComment = BaseEntity & {
  task_id: EntityId;
  author_id: EntityId;
  content: string;
  created_at: string;
};
