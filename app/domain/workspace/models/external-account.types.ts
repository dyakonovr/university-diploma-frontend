import type { BaseEntity } from "~/shared/types/core/base-entity.types";

export type ExternalAccount = BaseEntity & {
  integration_id: string;
  integration_name: string;
  integration_type: string;
  external_user_id: string;
  external_username: string | null;
  created_at: string;
};
