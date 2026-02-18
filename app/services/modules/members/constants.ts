export const MEMBERS_ENDPOINT = "/gym/members";

export const buildMemberEndpoint = (memberId: string) =>
  `${MEMBERS_ENDPOINT}/${memberId}`;

export const buildRefreshQrEndpoint = (memberId: string) =>
  `${MEMBERS_ENDPOINT}/${memberId}/refresh-qr`;
