import type { ApiResult } from "~/services/api-core";
import { fetchApi, hasApiBaseUrl, simulateCreate } from "~/services/api-core";
import { MEMBER_MEMBERSHIPS_ENDPOINT } from "./constants";
import { fromApiMemberMembership, toApiMemberMembership } from "./mappers";
import type { MemberMembership } from "~/types/gym/member-membership";

export const listMemberMemberships = async (): Promise<ApiResult<MemberMembership[]>> => {
  const response = await fetchApi<any[]>(MEMBER_MEMBERSHIPS_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiMemberMembership) }
    : ({ ...response, data: [] } as ApiResult<MemberMembership[]>);
};

export const assignMembership = async (
  payload: MemberMembership
): Promise<ApiResult<MemberMembership>> => {
  if (!hasApiBaseUrl()) return simulateCreate(payload);

  const response = await fetchApi<any>(MEMBER_MEMBERSHIPS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiMemberMembership(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiMemberMembership(response.data),
        message: "Membresía asignada.",
      }
    : ({ ...response, data: payload } as ApiResult<MemberMembership>);
};
