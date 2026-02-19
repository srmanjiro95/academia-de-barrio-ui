export const ROLES_ENDPOINT = "/admin/roles";

export const buildRoleEndpoint = (roleId: string) => `${ROLES_ENDPOINT}/${roleId}`;
