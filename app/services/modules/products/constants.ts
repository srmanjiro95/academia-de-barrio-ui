export const PRODUCTS_ENDPOINT = "/catalog/inventory";

export const buildProductEndpoint = (productId: string) =>
  `${PRODUCTS_ENDPOINT}/${productId}`;
