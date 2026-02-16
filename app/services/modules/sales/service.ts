import type { ApiResult } from "~/services/api-core";
import { fetchApi } from "~/services/api-core";
import { SALES_ENDPOINT } from "./constants";
import { fromApiSale, toApiSale } from "./mappers";
import type { Sale } from "~/types/gym/sale";

export const listSales = async (): Promise<ApiResult<Sale[]>> => {
  const response = await fetchApi<any[]>(SALES_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiSale) }
    : ({ ...response, data: [] } as ApiResult<Sale[]>);
};

export const registerSale = async (
  payload: Sale
): Promise<ApiResult<Sale>> => {

  const response = await fetchApi<any>(SALES_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiSale(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiSale(response.data),
        message: "Venta registrada.",
      }
    : ({ ...response, data: payload } as ApiResult<Sale>);
};
