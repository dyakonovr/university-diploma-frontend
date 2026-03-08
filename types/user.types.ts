import type { BaseEntity } from './base-entity.types';

export type UserBase = {
  login: string;
  name: string;
  surname: string;
  middlename: string;
};

export type UserCreate = UserBase & {
  password: string;
};

export type User = BaseEntity & UserBase & {
  createdAt: string;
};