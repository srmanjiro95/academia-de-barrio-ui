import type { ApiResult } from "~/services/api-core";
import { fetchApi } from "~/services/api-core";
import { MEMBERSHIPS_ENDPOINT, buildMembershipEndpoint } from "./constants";
import { fromApiMembership, toApiMembership } from "./mappers";
import type { Membership } from "~/types/catalog/membership";

export const listMemberships = async (): Promise<ApiResult<Membership[]>> => {
  const response = await fetchApi<any[]>(MEMBERSHIPS_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiMembership) }
    : ({ ...response, data: [] } as ApiResult<Membership[]>);
};

export const createMembership = async (
  payload: Membership
): Promise<ApiResult<Membership>> => {
  const response = await fetchApi<any>(MEMBERSHIPS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiMembership(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiMembership(response.data),
        message: "Membresía creada.",
      }
    : ({ ...response, data: payload } as ApiResult<Membership>);
};

export const updateMembership = async (
  payload: Membership
): Promise<ApiResult<Membership>> => {
  const response = await fetchApi<any>(buildMembershipEndpoint(payload.id), {
    method: "PUT",
    body: JSON.stringify(toApiMembership(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiMembership(response.data),
        message: "Membresía actualizada.",
      }
    : ({ ...response, data: payload } as ApiResult<Membership>);
};
