export const PROMOTIONS_ENDPOINT = "/catalog/promotions";

export const buildPromotionEndpoint = (promotionId: string) =>
  `${PROMOTIONS_ENDPOINT}/${promotionId}`;
