import type { Sale } from "~/types/gym/sale";

export const toApiSale = (sale: Sale) => ({
  customer: sale.customer,
  product_id: sale.productId ?? sale.product,
  product: sale.product,
  quantity: sale.quantity,
  total: sale.total,
  date: sale.date,
});

export const fromApiSale = (sale: any): Sale => ({
  id: sale.id,
  customer: sale.customer,
  productId: sale.product_id,
  product: sale.product,
  quantity: sale.quantity,
  total: sale.total,
  date: sale.date,
});
