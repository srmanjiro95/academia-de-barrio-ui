import type { Product } from "~/types/catalog/product";

export const toApiProduct = (product: Product) => ({
  name: product.name,
  units: product.units,
  price: product.price,
  description: product.description,
  image_url: product.imageUrl ?? "",
});

export const fromApiProduct = (product: any): Product => ({
  id: product.id,
  name: product.name,
  units: product.units,
  price: product.price,
  description: product.description,
  imageUrl: product.image_url,
});
