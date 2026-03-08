import type { BaseEntity, EntityId } from "~/shared/types/core/base-entity.types";

export type WorkspaceMemberRole = 'owner' | 'manager' | 'employee';

type WorkspaceMemberBase = {
  user_id: EntityId;
  workspace_id: EntityId;
  role: WorkspaceMemberRole;
  email: string;
  name: string;
};

export type WorkspaceMemberCreate = WorkspaceMemberBase;

export type WorkspaceMember = BaseEntity & WorkspaceMemberBase;