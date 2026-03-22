import type { BaseEntity } from "~/shared/types/core/base-entity.types";
import type { JsonSerializable } from "~/shared/types/core/request.types";

type IntegrationBase = {
  workspace_id: string;
  type: string;
  name: string;
  config: Record<string, JsonSerializable>;
  is_active: boolean;
  api_token: string;
};

export type IntegrationCreate = IntegrationBase;

export type Integration = BaseEntity &
  IntegrationBase & {
    created_at: string;
    deleted_at: string;
    last_synced_at?: string | null;
    token_expires_at?: string | null;
  };

/** Config field descriptor returned by GET /integrations/available */
export type ConfigField = {
  key: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
};

/** Available integration provider descriptor */
export type AvailableIntegration = {
  provider: string;
  display_name: string;
  type: string;
  config_fields: ConfigField[];
};

/** Response from POST /integrations/{id}/test */
export type HealthCheckResponse = {
  status: string;
  message?: string;
};

/** Response from POST /integrations/{id}/sync */
export type SyncResponse = {
  created: number;
  updated: number;
  errors?: string[];
};
