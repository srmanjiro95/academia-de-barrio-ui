import type { ApiResult } from "~/services/api-core";
import { fetchApi } from "~/services/api-core";
import { PROMOTIONS_ENDPOINT, buildPromotionEndpoint } from "./constants";
import { fromApiPromotion, toApiPromotion } from "./mappers";
import type { Promotion } from "~/types/gym/promotion";

export const listPromotions = async (): Promise<ApiResult<Promotion[]>> => {
  const response = await fetchApi<any[]>(PROMOTIONS_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiPromotion) }
    : ({ ...response, data: [] } as ApiResult<Promotion[]>);
};

export const createPromotion = async (
  payload: Promotion
): Promise<ApiResult<Promotion>> => {
  const response = await fetchApi<any>(PROMOTIONS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiPromotion(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiPromotion(response.data),
        message: "Promoción creada.",
      }
    : ({ ...response, data: payload } as ApiResult<Promotion>);
};

export const updatePromotion = async (
  payload: Promotion
): Promise<ApiResult<Promotion>> => {
  const response = await fetchApi<any>(buildPromotionEndpoint(payload.id), {
    method: "PUT",
    body: JSON.stringify(toApiPromotion(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiPromotion(response.data),
        message: "Promoción actualizada.",
      }
    : ({ ...response, data: payload } as ApiResult<Promotion>);
};
