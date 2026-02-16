import type { ApiResult } from "~/services/api-core";
import { fetchApi, hasApiBaseUrl, simulateCreate } from "~/services/api-core";
import { PRODUCTS_ENDPOINT } from "./constants";
import { fromApiProduct, toApiProduct } from "./mappers";
import type { Product } from "~/types/catalog/product";

export const listProducts = async (): Promise<ApiResult<Product[]>> => {
  const response = await fetchApi<any[]>(PRODUCTS_ENDPOINT);
  return response.ok
    ? { ok: true, data: response.data.map(fromApiProduct) }
    : ({ ...response, data: [] } as ApiResult<Product[]>);
};

export const createProduct = async (
  payload: Product
): Promise<ApiResult<Product>> => {
  if (!hasApiBaseUrl()) return simulateCreate(payload);

  const response = await fetchApi<any>(PRODUCTS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(toApiProduct(payload)),
  });

  return response.ok
    ? {
        ok: true,
        data: fromApiProduct(response.data),
        message: "Producto creado.",
      }
    : ({ ...response, data: payload } as ApiResult<Product>);
};
