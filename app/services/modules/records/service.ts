import type { ApiResult } from "~/services/api-core";
import { fetchApi } from "~/services/api-core";
import { RECORDS_ENDPOINT } from "./constants";
import { fromApiRecord, toApiRecord } from "./mappers";
import type { FightRecord } from "~/types/gym/record";

export const listRecords = async (): Promise<ApiResult<FightRecord[]>> => {
  const response = await fetchApi<any[]>(RECORDS_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiRecord) }
    : ({ ...response, data: [] } as ApiResult<FightRecord[]>);
};

export const registerRecord = async (
  payload: FightRecord
): Promise<ApiResult<FightRecord>> => {

  const response = await fetchApi<any>(RECORDS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiRecord(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiRecord(response.data),
        message: "Récord creado.",
      }
    : ({ ...response, data: payload } as ApiResult<FightRecord>);
};
