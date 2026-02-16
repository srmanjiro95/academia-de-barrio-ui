import type { ApiResult } from "~/services/api-core";
import { fetchApi, hasApiBaseUrl, simulateCreate } from "~/services/api-core";
import { MEMBERSHIPS_ENDPOINT } from "./constants";
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
  if (!hasApiBaseUrl()) return simulateCreate(payload);

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
