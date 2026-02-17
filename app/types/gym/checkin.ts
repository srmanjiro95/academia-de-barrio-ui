import type { FightRecord } from "~/types/gym/record";

export interface MemberRecordSummary {
  wins: number;
  losses: number;
  draws: number;
  winsByKo: number;
  winsByPoints: number;
}

export interface CheckInMemberPreview {
  memberId: string;
  fullName: string;
  imageUrl?: string;
  status?: string;
  membershipName?: string;
  recordSummary?: MemberRecordSummary;
  records?: FightRecord[];
}

export interface CheckIn {
  id: string;
  memberId?: string;
  memberName: string;
  date: string;
  status: "Aceptado" | "Rechazado";
  memberPreview?: CheckInMemberPreview;
}
