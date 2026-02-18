import type { Membership } from "~/types/catalog/membership";

export const toApiMembership = (membership: Membership) => ({
  name: membership.name,
  price: membership.price,
  duration: membership.duration,
  includes: membership.includes,
  image_url: membership.imageUrl ?? "",
});

export const fromApiMembership = (membership: any): Membership => ({
  id: membership.id,
  name: membership.name,
  price: membership.price,
  duration: membership.duration,
  includes: membership.includes ?? [],
  imageUrl: membership.image_url,
});
