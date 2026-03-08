import type { BaseEntity, EntityId } from "~/shared/types/core/base-entity.types";

export type Action = {
  type: string;
  payload: Record<string, unknown>;
};

export type ActionLog = BaseEntity & {
	workspace_id:   EntityId;
	member_id:      EntityId;
	raw_input:      string;
	actions:       Action[];
	human_response: string;
	created_at:     string;
};