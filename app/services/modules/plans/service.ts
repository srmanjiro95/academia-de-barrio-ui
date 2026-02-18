import type { ApiResult } from "~/services/api-core";
import { fetchApi } from "~/services/api-core";
import { PLANS_ENDPOINT, buildPlanEndpoint } from "./constants";
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

export const updatePlan = async (
  payload: DevelopmentPlan
): Promise<ApiResult<DevelopmentPlan>> => {
  const response = await fetchApi<any>(buildPlanEndpoint(payload.id), {
    method: "PUT",
    body: JSON.stringify(toApiPlan(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiPlan(response.data),
        message: "Plan actualizado.",
      }
    : ({ ...response, data: payload } as ApiResult<DevelopmentPlan>);
};
