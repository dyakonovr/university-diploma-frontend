import type { BaseEntity, EntityId } from "~/shared/types/core/base-entity.types";

type WorkspaceBase = {
  name: string;
	owner_id: EntityId;
};

export type WorkspaceCreate = WorkspaceBase;

export type Workspace = BaseEntity & WorkspaceBase & {
  created_at: string;
  updated_at: string;
  deleted_at: string;
};