import type { MemberMembership } from "~/types/gym/member-membership";

export const toApiMemberMembership = (membership: MemberMembership) => ({
  member_id: membership.memberId,
  member_name: membership.memberName,
  membership_id: membership.membershipId,
  membership_name: membership.membershipName,
  start_date: membership.startDate,
  end_date: membership.endDate,
  status: membership.status,
});

export const fromApiMemberMembership = (membership: any): MemberMembership => ({
  id: membership.id,
  memberId: membership.member_id,
  memberName: membership.member_name,
  membershipId: membership.membership_id,
  membershipName: membership.membership_name,
  startDate: membership.start_date,
  endDate: membership.end_date,
  status: membership.status,
});
