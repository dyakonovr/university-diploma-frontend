import type { BaseEntity } from '~/shared/types/core/base-entity.types';

type UserBase = {
  email: string;
  username: string;
  is_active: boolean;
  telegram_id: string | null;
};

export type UserCreate = UserBase & {
  password: string;
};

export type User = BaseEntity & UserBase & {
  position: string;
  roles?: string[];

  created_at: string;
};

export type PublicUser = BaseEntity & UserBase & {
  created_at: string;
};
