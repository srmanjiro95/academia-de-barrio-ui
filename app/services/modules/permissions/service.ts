import type { ApiResult } from "~/services/api-core";
import { fetchApi } from "~/services/api-core";
import { PERMISSIONS_ENDPOINT } from "./constants";
import { fromApiPermission, toApiPermission } from "./mappers";
import type { Permissions } from "~/types/admin/role";

export const listPermissions = async (): Promise<ApiResult<Permissions[]>> => {
  const response = await fetchApi<any[]>(PERMISSIONS_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiPermission) }
    : ({ ...response, data: [] } as ApiResult<Permissions[]>);
};

export const createPermission = async (
  payload: Permissions
): Promise<ApiResult<Permissions>> => {
  const response = await fetchApi<any>(PERMISSIONS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiPermission(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiPermission(response.data),
        message: "Permiso creado.",
      }
    : ({ ...response, data: payload } as ApiResult<Permissions>);
};
