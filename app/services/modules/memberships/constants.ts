export const MEMBERSHIPS_ENDPOINT = "/catalog/memberships";

export const buildMembershipEndpoint = (membershipId: string) =>
  `${MEMBERSHIPS_ENDPOINT}/${membershipId}`;
