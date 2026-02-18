export const PRODUCT_CATEGORIES = [
  "Guantes",
  "Botas de boxeo",
  "Protectores",
  "Cascos",
  "Petos",
  "Cuerdas",
  "Shorts",
  "Batas",
  "Tops",
  "Vendaje y equipo médico",
  "Abarrotes",
  "Otros",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product {
  id: string;
  name: string;
  units: number;
  price: number;
  description: string;
  imageUrl?: string;
  category?: ProductCategory;
}
