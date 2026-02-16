import type { ApiResult } from "~/services/api-core";
import { fetchApi, hasApiBaseUrl, simulateCreate } from "~/services/api-core";
import { PLANS_ENDPOINT } from "./constants";
import { fromApiPlan, toApiPlan } from "./mappers";
import type { DevelopmentPlan } from "~/types/gym/plan";

export const listPlans = async (): Promise<ApiResult<DevelopmentPlan[]>> => {
  const response = await fetchApi<any[]>(PLANS_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiPlan) }
    : ({ ...response, data: [] } as ApiResult<DevelopmentPlan[]>);
};

export const createPlan = async (
  payload: DevelopmentPlan
): Promise<ApiResult<DevelopmentPlan>> => {
  if (!hasApiBaseUrl()) return simulateCreate(payload);

  const response = await fetchApi<any>(PLANS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiPlan(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiPlan(response.data),
        message: "Plan creado.",
      }
    : ({ ...response, data: payload } as ApiResult<DevelopmentPlan>);
};
