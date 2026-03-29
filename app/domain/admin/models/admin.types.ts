import type { BaseEntity } from "~/shared/types/core/base-entity.types";

export type AdminUser = BaseEntity & {
  email: string;
  name: string;
  is_admin: boolean;
  blocked_at: string | null;
  created_at: string;
};

export type AdminWorkspace = BaseEntity & {
  name: string;
  owner_id: string;
  owner_name: string;
  owner_email: string;
  member_count: number;
  created_at: string;
};
