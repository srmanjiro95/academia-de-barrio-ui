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
  scope: promotion.scope ?? null,
  category: promotion.category ?? null,
  product_ids: promotion.productIds ?? [],
  membership_ids: promotion.membershipIds ?? [],
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
  scope: promotion.scope ?? undefined,
  category: promotion.category ?? undefined,
  productIds: Array.isArray(promotion.product_ids)
    ? promotion.product_ids.filter((value: unknown) => typeof value === "string")
    : [],
  membershipIds: Array.isArray(promotion.membership_ids)
    ? promotion.membership_ids.filter((value: unknown) => typeof value === "string")
    : [],
});
