import type { Permissions } from "~/types/admin/role";

export const toApiPermission = (permission: Permissions) => ({
  name: permission.name,
});

export const fromApiPermission = (permission: any): Permissions => ({
  id: permission.id,
  name: permission.name,
});
