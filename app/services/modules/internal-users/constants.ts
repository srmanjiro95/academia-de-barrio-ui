export const INTERNAL_USERS_ENDPOINT = "/admin/internal-users";

export const buildInternalUserEndpoint = (userId: string) =>
  `${INTERNAL_USERS_ENDPOINT}/${userId}`;
