export type PromotionType = "Inscripción" | "Descuento a producto" | "Membresía";
export type PromotionDiscountType = "Porcentaje" | "Monto fijo";
export type PromotionStatus = "Activo" | "Inactivo";
export type PromotionScope =
  | "Inscripción"
  | "Toda la tienda"
  | "Categoría"
  | "Productos específicos"
  | "Membresías";

export interface Promotion {
  id: string;
  title: string;
  type: PromotionType;
  discountType?: PromotionDiscountType;
  amount: number;
  description: string;
  startDate: string;
  endDate: string;
  code: string;
  status: PromotionStatus;
  imageUrl: string;
  scope?: PromotionScope;
  category?: string;
  productIds?: string[];
  membershipIds?: string[];
}
