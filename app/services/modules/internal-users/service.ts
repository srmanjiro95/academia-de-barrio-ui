import type { ApiResult } from "~/services/api-core";
import { fetchApi } from "~/services/api-core";
import { INTERNAL_USERS_ENDPOINT, buildInternalUserEndpoint } from "./constants";
import { fromApiInternalUser, toApiInternalUser } from "./mappers";
import type { InternalUser } from "~/types/admin/internal-user";

export const listInternalUsers = async (): Promise<ApiResult<InternalUser[]>> => {
  const response = await fetchApi<any[]>(INTERNAL_USERS_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiInternalUser) }
    : ({ ...response, data: [] } as ApiResult<InternalUser[]>);
};

export const createInternalUser = async (
  payload: InternalUser
): Promise<ApiResult<InternalUser>> => {
  const response = await fetchApi<any>(INTERNAL_USERS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiInternalUser(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiInternalUser(response.data),
        message: "Usuario creado.",
      }
    : ({ ...response, data: payload } as ApiResult<InternalUser>);
};

export const updateInternalUser = async (
  payload: InternalUser
): Promise<ApiResult<InternalUser>> => {
  const response = await fetchApi<any>(buildInternalUserEndpoint(payload.id), {
    method: "PUT",
    body: JSON.stringify(toApiInternalUser(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiInternalUser(response.data),
        message: "Usuario actualizado.",
      }
    : ({ ...response, data: payload } as ApiResult<InternalUser>);
};
