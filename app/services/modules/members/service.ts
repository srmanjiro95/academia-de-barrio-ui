import type { ApiResult } from "~/services/api-core";
import { fetchApi } from "~/services/api-core";
import { MEMBERS_ENDPOINT, buildRefreshQrEndpoint } from "./constants";
import { fromApiMember, toApiMember } from "./mappers";
import type { GymMember } from "~/types/gym/member";

export const listMembers = async (): Promise<ApiResult<GymMember[]>> => {
  const response = await fetchApi<any[]>(MEMBERS_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiMember) }
    : ({ ...response, data: [] } as ApiResult<GymMember[]>);
};

export const createMember = async (
  payload: GymMember
): Promise<ApiResult<GymMember>> => {

  const response = await fetchApi<any>(MEMBERS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiMember(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiMember(response.data),
        message: "Miembro creado.",
      }
    : ({ ...response, data: payload } as ApiResult<GymMember>);
};


export const refreshMemberQr = async (
  memberId: string
): Promise<ApiResult<GymMember>> => {
  const response = await fetchApi<any>(buildRefreshQrEndpoint(memberId), {
    method: "POST",
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiMember(response.data),
        message: "QR actualizado y correo enviado.",
      }
    : ({
        ...response,
        data: null as unknown as GymMember,
      } as ApiResult<GymMember>);
};
