import type { Permission } from '../domain/permission/models/permission.types';

export type Role = {
  id: string;
  name: string;
  permissions?: Permission[];
};
