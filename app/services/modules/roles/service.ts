import type { ApiResult } from "~/services/api-core";
import { fetchApi } from "~/services/api-core";
import { ROLES_ENDPOINT, buildRoleEndpoint } from "./constants";
import { fromApiRole, toApiRole } from "./mappers";
import type { Role } from "~/types/admin/role";

export const listRoles = async (): Promise<ApiResult<Role[]>> => {
  const response = await fetchApi<any[]>(ROLES_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiRole) }
    : ({ ...response, data: [] } as ApiResult<Role[]>);
};

export const createRole = async (
  payload: Role
): Promise<ApiResult<Role>> => {
  const response = await fetchApi<any>(ROLES_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiRole(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiRole(response.data),
        message: "Rol creado.",
      }
    : ({ ...response, data: payload } as ApiResult<Role>);
};

export const updateRole = async (
  payload: Role
): Promise<ApiResult<Role>> => {
  const response = await fetchApi<any>(buildRoleEndpoint(payload.id), {
    method: "PUT",
    body: JSON.stringify(toApiRole(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiRole(response.data),
        message: "Rol actualizado.",
      }
    : ({ ...response, data: payload } as ApiResult<Role>);
};
