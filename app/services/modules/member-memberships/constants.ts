export const MEMBER_MEMBERSHIPS_ENDPOINT = "/gym/member-memberships";

export const buildMemberMembershipEndpoint = (assignmentId: string) =>
  `${MEMBER_MEMBERSHIPS_ENDPOINT}/${assignmentId}`;
