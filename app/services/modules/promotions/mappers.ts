import type { Promotion } from "~/types/gym/promotion";

export const toApiPromotion = (promotion: Promotion) => ({
  title: promotion.title,
  type: promotion.type,
  discount_type: promotion.discountType ?? null,
  amount: promotion.amount,
  description: promotion.description,
  start_date: promotion.startDate,
  end_date: promotion.endDate,
  code: promotion.code,
  status: promotion.status,
  image_url: promotion.imageUrl,
});

export const fromApiPromotion = (promotion: any): Promotion => ({
  id: promotion.id,
  title: promotion.title,
  type: promotion.type,
  discountType: promotion.discount_type ?? undefined,
  amount: promotion.amount,
  description: promotion.description,
  startDate: promotion.start_date,
  endDate: promotion.end_date,
  code: promotion.code,
  status: promotion.status,
  imageUrl: promotion.image_url,
});
