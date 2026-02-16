export interface MemberMembership {
  id: string;
  memberId: string;
  memberName: string;
  membershipId: string;
  membershipName: string;
  startDate: string;
  endDate: string;
  status: "Vigente" | "Por vencer" | "Vencida";
}
