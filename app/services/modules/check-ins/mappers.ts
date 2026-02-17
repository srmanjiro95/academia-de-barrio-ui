import type { CheckIn } from "~/types/gym/checkin";

export interface RegisterCheckInPayload {
  qr_uuid: string;
}

export const toApiCheckIn = (qrUuid: string): RegisterCheckInPayload => ({
  qr_uuid: qrUuid,
});

export const fromApiCheckIn = (checkIn: any): CheckIn => ({
  id: checkIn.id,
  memberId: checkIn.member_id,
  memberName: checkIn.member_name,
  date: checkIn.date,
  status: checkIn.status,
});
