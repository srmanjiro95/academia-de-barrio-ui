export type PromotionType = "Inscripción" | "Descuento";
export type PromotionDiscountType = "Porcentaje" | "Monto fijo";
export type PromotionStatus = "Activo" | "Inactivo";

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
}
