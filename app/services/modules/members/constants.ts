export const MEMBERS_ENDPOINT = "/gym/members";


export const buildRefreshQrEndpoint = (memberId: string) =>
  `${MEMBERS_ENDPOINT}/${memberId}/refresh-qr`;
