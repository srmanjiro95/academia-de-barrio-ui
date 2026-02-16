import type { Role } from "~/types/admin/role";

export const toApiRole = (role: Role) => ({
  name: role.name,
  permission_ids: role.permissions.map((permission) => permission.id),
});

export const fromApiRole = (role: any): Role => ({
  id: role.id,
  name: role.name,
  permissions: role.permissions ?? [],
});
