import type { BaseEntity, EntityId } from "~/shared/types/core/base-entity.types"

type CalendarEventBase = {
  workspace_id: EntityId
	title:       string
	description: string | null;
	start_time:   string;
	end_time:     string;
	location:    string;
};

export type CalendarEventCreate = CalendarEventBase;

export type CalendarEvent = BaseEntity & CalendarEventBase & {
	created_by:   string
	created_at:   string;
	updated_at:   string;
	deleted_at:   string;
}