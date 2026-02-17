import type { CheckIn } from "~/types/gym/checkin";

export const toApiCheckIn = (checkIn: CheckIn) => ({
  member_id: checkIn.memberId ?? "",
  member_name: checkIn.memberName,
  date: checkIn.date,
  status: checkIn.status,
});

export const fromApiCheckIn = (checkIn: any): CheckIn => ({
  id: checkIn.id,
  memberId: checkIn.member_id,
  memberName: checkIn.member_name,
  date: checkIn.date,
  status: checkIn.status,
});
