export interface Sale {
  id: string;
  customer: string;
  productId?: string;
  product: string;
  quantity: number;
  total: number;
  date: string;
}
