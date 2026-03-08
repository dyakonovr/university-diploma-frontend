import type { BaseEntity } from "~/shared/types/core/base-entity.types";
import type { JsonSerializable } from "~/shared/types/core/request.types";

type IntegrationBase = {
  workspace_id: string
	type:        string
	name:        string
	config:      Record<string, JsonSerializable>;
	is_active:    boolean
	api_token:    string
};

export type IntegrationCreate = IntegrationBase;

export type Integration = BaseEntity & IntegrationBase & {
  created_at: string;
  deleted_at: string;
};