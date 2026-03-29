import type { BaseEntity } from '~/shared/types/core/base-entity.types';

type UserBase = {
  email: string;
  name: string;
};

export type UserCreate = UserBase & {
  password: string;
};

export type User = BaseEntity & UserBase & {
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};