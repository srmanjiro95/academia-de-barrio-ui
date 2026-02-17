import type { CheckIn, CheckInMemberPreview, MemberRecordSummary } from "~/types/gym/checkin";
import type { FightRecord } from "~/types/gym/record";

export interface RegisterCheckInPayload {
  qr_uuid: string;
}

export const toApiCheckIn = (qrUuid: string): RegisterCheckInPayload => ({
  qr_uuid: qrUuid,
});

function mapRecordSummary(summary: any): MemberRecordSummary | undefined {
  if (!summary) return undefined;

  return {
    wins: Number(summary.wins ?? 0),
    losses: Number(summary.losses ?? 0),
    draws: Number(summary.draws ?? 0),
    winsByKo: Number(summary.wins_by_ko ?? summary.winsByKo ?? 0),
    winsByPoints: Number(summary.wins_by_points ?? summary.winsByPoints ?? 0),
  };
}

function mapRecord(record: any): FightRecord {
  return {
    id: record.id ?? `REC-${Math.random().toString(16).slice(2)}`,
    memberId: record.member_id ?? record.memberId,
    memberName: record.member_name ?? record.memberName ?? "",
    category: record.category,
    wins: Number(record.wins ?? 0),
    losses: Number(record.losses ?? 0),
    draws: Number(record.draws ?? 0),
    winsByKo: Number(record.wins_by_ko ?? record.winsByKo ?? 0),
    winsByPoints: Number(record.wins_by_points ?? record.winsByPoints ?? 0),
  };
}

function mapMemberPreview(raw: any): CheckInMemberPreview | undefined {
  const member = raw.member ?? raw.member_preview ?? raw.gym_member;
  if (!member) return undefined;

  const firstName = member.first_name ?? member.firstName ?? "";
  const lastName = member.last_name ?? member.lastName ?? "";
  const fallbackName = `${firstName} ${lastName}`.trim();
  const fullName = member.full_name ?? member.fullName ?? (fallbackName || "Miembro");

  const recordsRaw = raw.records ?? member.records ?? raw.fight_records ?? [];

  return {
    memberId: member.id ?? raw.member_id ?? raw.memberId ?? "",
    fullName,
    imageUrl: member.image_url ?? member.imageUrl ?? undefined,
    status: member.status ?? undefined,
    membershipName:
      member.membership_name ?? member.membershipName ?? member.membership?.name ?? undefined,
    recordSummary: mapRecordSummary(raw.record_summary ?? raw.recordSummary ?? member.record_summary),
    records: Array.isArray(recordsRaw) ? recordsRaw.map(mapRecord) : undefined,
  };
}

export const fromApiCheckIn = (checkIn: any): CheckIn => ({
  id: checkIn.id,
  memberId: checkIn.member_id,
  memberName: checkIn.member_name,
  date: checkIn.date,
  status: checkIn.status,
  memberPreview: mapMemberPreview(checkIn),
});
