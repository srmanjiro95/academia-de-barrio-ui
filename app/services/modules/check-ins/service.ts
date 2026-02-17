import type { ApiResult } from "~/services/api-core";
import { fetchApi } from "~/services/api-core";
import { CHECK_INS_ENDPOINT } from "./constants";
import { fromApiCheckIn, toApiCheckIn } from "./mappers";
import type { CheckIn } from "~/types/gym/checkin";

export const listCheckIns = async (): Promise<ApiResult<CheckIn[]>> => {
  const response = await fetchApi<any[]>(CHECK_INS_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiCheckIn) }
    : ({ ...response, data: [] } as ApiResult<CheckIn[]>);
};

export const registerCheckIn = async (
  payload: CheckIn
): Promise<ApiResult<CheckIn>> => {

  const response = await fetchApi<any>(CHECK_INS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiCheckIn(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiCheckIn(response.data),
        message: "Ingreso QR registrado.",
      }
    : ({ ...response, data: payload } as ApiResult<CheckIn>);
};
